import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { chromium } from "@playwright/test";
import { startDocsPreview } from "./lib/docs-preview.mjs";

export function percentile(values, fraction = .95) {
  const sorted = [...values].sort((a,b) => a-b);
  return sorted[Math.max(0,Math.ceil(sorted.length*fraction)-1)] ?? null;
}

export function evaluateSample(sample) {
  const failures=[];
  for(const name of ["activation","first-input","interaction","scroll"])
    if(sample.phases?.filter(phase=>phase.name===name).length!==1)failures.push(`${name}:missing-or-duplicate`);
  for(const phase of sample.phases ?? []) {
    if(["interaction","scroll"].includes(phase.name)) {
      if(phase.duration<5000 || phase.frames.length<120)failures.push(`${phase.name}:insufficient-sample`);
      if(phase.p95===null || phase.p95>20)failures.push(`${phase.name}:p95`);
      if(phase.encodes)failures.push(`${phase.name}:map-rebuild`);
      if(phase.longTasks.some(task=>task.duration>50))failures.push(`${phase.name}:long-task`);
    }
    if(sample.texture==="glass" && ["activation","first-input","portal-reopen"].includes(phase.name)
      && phase.longTasks.some(task=>task.duration>50 && sample.builds?.some(build=>task.startTime<build.end && task.startTime+task.duration>build.start)))failures.push(`${phase.name}:build-long-task`);
  }
  if((sample.phases?.find(phase=>phase.name==="scroll")?.scrollDistance??0)<120)failures.push("scroll:distance");
  if(sample.idleRafRequests!==0)failures.push("idle:raf");
  if(!sample.geometryStable)failures.push("interaction:geometry");
  if(!sample.stateChanged)failures.push("interaction:no-state-commit");
  if(sample.mobile && sample.texture==="glass" && (sample.renderer!=="css" || sample.samplers!==0))failures.push("mobile:unexpected-svg");
  return failures;
}

export function orderedCases(profiles, repetitions=3, usages=["clear","regular","dense"],textures=["solid","aero","glass"]) {
  const choices=(values,allowed,name)=>{
    if(!Array.isArray(values) || !values.length || new Set(values).size!==values.length || values.some(value=>!allowed.includes(value)))throw Error(`Invalid ${name}`);
  };
  choices(profiles,["desktop-light-1","desktop-dark-1","desktop-light-2","desktop-dark-2","mobile-light-2","mobile-dark-2"],"profiles");
  choices(usages,["clear","regular","dense"],"usages");choices(textures,["solid","aero","glass"],"textures");
  if(!Number.isInteger(repetitions) || repetitions<1)throw Error("Repetitions must be a positive integer");
  let seed=20261017;const random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/2**32;};
  const cases=[];
  for(let repetition=0;repetition<repetitions;repetition++) {
    const batch=profiles.flatMap(profile=>usages.flatMap(usage=>textures.map(texture=>({profile,usage,texture,repetition}))));
    for(let index=batch.length-1;index>0;index--){const target=Math.floor(random()*(index+1));[batch[index],batch[target]]=[batch[target],batch[index]];}
    cases.push(...batch);
  }
  return cases;
}

/** Browser-only instrumentation; never imported into the product bundle.
 *  只记录真实输入、提交和帧调度；不把 RAF 当成 GPU 呈现或 INP。 */
function installProbe() {
  const audit={events:[],commits:[],tasks:[],encodes:[],builds:[],phases:[],active:null,raf:0,last:0,scrollTops:new WeakMap()};
  const builds=new WeakMap();
  const createImageData=CanvasRenderingContext2D.prototype.createImageData;
  CanvasRenderingContext2D.prototype.createImageData=function(...args){
    if(!builds.has(this.canvas)) {
      const build={start:performance.now(),end:Infinity,width:this.canvas.width,height:this.canvas.height};
      builds.set(this.canvas,build);audit.builds.push(build);
    }
    return createImageData.apply(this,args);
  };
  for(const method of ["toDataURL","toBlob"]) {
    const original=HTMLCanvasElement.prototype[method];
    HTMLCanvasElement.prototype[method]=function(...args){
      audit.encodes.push({at:performance.now(),method,width:this.width,height:this.height});
      const build=builds.get(this);
      if(method==="toBlob" && build) {
        const callback=args[0];args[0]=blob=>{build.end=performance.now();callback(blob);};
      }
      const result=original.apply(this,args);if(method==="toDataURL"&&build)build.end=performance.now();return result;
    };
  }
  const observer=new PerformanceObserver(list=>audit.tasks.push(...list.getEntries().map(entry=>({startTime:entry.startTime,duration:entry.duration}))));
  observer.observe({type:"longtask",buffered:false});
  for(const name of ["pointerdown","pointerup","pointermove","keydown","wheel","touchstart","touchmove","touchend"])document.addEventListener(name,event=>audit.events.push({type:name,at:performance.now(),eventTime:event.timeStamp,trusted:event.isTrusted,key:event.key}),{capture:true,passive:true});
  window.addEventListener("glass-fixture:commit",event=>audit.commits.push({at:performance.now(),...event.detail}));
  document.addEventListener("scroll",event=>{
    const node=event.target;if(!(node instanceof Element))return;
    const previous=audit.scrollTops.get(node)??0,top=node.scrollTop;audit.scrollTops.set(node,top);
    if(audit.active)audit.active.scrollDistance+=Math.abs(top-previous);
  },true);
  const frame=now=>{if(!audit.active)return;audit.active.frames.push(now);audit.raf=requestAnimationFrame(frame);};
  audit.begin=name=>{if(audit.active)throw Error("Overlapping measurement phase");audit.active={name,start:performance.now(),frames:[],scrollDistance:0};audit.raf=requestAnimationFrame(frame);};
  audit.end=()=>{
    cancelAnimationFrame(audit.raf);const phase=audit.active;audit.active=null;phase.end=performance.now();phase.duration=phase.end-phase.start;audit.phases.push(phase);
  };
  audit.finish=()=>{observer.disconnect();return {events:audit.events,commits:audit.commits,tasks:audit.tasks,encodes:audit.encodes,builds:audit.builds,phases:audit.phases};};
  window.__glassAudit=audit;
}

async function digest(directory) {
  const hash=crypto.createHash("sha256");
  async function visit(relative="") {
    const entries=await fs.readdir(path.join(directory,relative),{withFileTypes:true});
    for(const entry of entries.sort((a,b)=>a.name.localeCompare(b.name))) {
      const name=path.join(relative,entry.name);
      if(entry.isDirectory())await visit(name);else {hash.update(name.replaceAll("\\","/"));hash.update(await fs.readFile(path.join(directory,name)));}
    }
  }
  await visit();return hash.digest("hex");
}

async function touchScroll(session,box,direction) {
  const x=box.x+box.width/2,y=box.y+box.height*.65;
  await session.send("Input.dispatchTouchEvent",{type:"touchStart",touchPoints:[{x,y,id:1}]});
  for(let step=1;step<=6;step++) {
    await session.send("Input.dispatchTouchEvent",{type:"touchMove",touchPoints:[{x,y:y-direction*step*14,id:1}]});
    await new Promise(resolve=>setTimeout(resolve,16));
  }
  await session.send("Input.dispatchTouchEvent",{type:"touchEnd",touchPoints:[]});
}

async function measure(origin,condition,artifactHash) {
  const started=Date.now(),[device,theme,dprString]=condition.profile.split("-");
  const mobile=device==="mobile",dpr=Number(dprString),viewport=mobile?{width:390,height:844}:{width:1280,height:900};
  const browser=await chromium.launch({channel:"chromium"});let context,timeout;
  try {
    context=await browser.newContext({viewport,deviceScaleFactor:dpr,hasTouch:mobile,isMobile:mobile,
      ...(mobile?{userAgent:`Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${browser.version()} Mobile Safari/537.36`}:{})});
    timeout=setTimeout(()=>void context.close(),45000);
    await context.addInitScript(({theme})=>{localStorage.setItem("unitary-theme-preference",theme);localStorage.setItem("unitary-texture-preference-v2","solid");},{theme});
    await context.addInitScript(installProbe);
    const page=await context.newPage();page.setDefaultTimeout(10000);
    const errors=[];page.on("pageerror",error=>errors.push(error.message));
    await page.goto(`${origin}/site/build/glass-regression.html?usage=${condition.usage}`);
    await page.waitForFunction(()=>document.documentElement.dataset.glassFixtureReady==="true");
    await page.evaluate(async()=>{await document.fonts.ready;const image=new Image();image.src=getComputedStyle(document.querySelector(".glass-fixture-landscape")).backgroundImage.match(/url\("?([^")]+)"?\)/)[1];await image.decode();});
    const dense=condition.usage==="dense";
    const owner=dense?page.locator('[data-slot="select-content"]'):page.getByTestId("optical-owner");
    const action=dense?page.locator('[data-slot="select-trigger"]'):page.getByRole("button",{name:condition.usage==="clear"?"Playback":"Pin",exact:true});
    const begin=name=>page.evaluate(name=>window.__glassAudit.begin(name),name),end=()=>page.evaluate(()=>window.__glassAudit.end());
    await begin("activation");await page.evaluate(texture=>window.__glassFixture.activate(texture),condition.texture);
    await page.waitForFunction(texture=>document.documentElement.dataset.texture===texture,condition.texture);
    if(!dense && condition.texture==="glass" && !mobile)await owner.waitFor({state:"visible"});
    if(!dense && condition.texture==="glass" && !mobile)await page.waitForFunction(()=>document.querySelector('[data-testid="optical-owner"]')?.dataset.uniGlassRenderer==="svg");
    await end();
    await begin("first-input");if(mobile)await action.tap();else await action.click();
    if(dense){
      await owner.waitFor({state:"visible"});
      if(condition.texture==="glass"&&!mobile)await page.waitForFunction(()=>document.querySelector('[data-slot="select-content"]')?.dataset.uniGlassRenderer==="svg");
      if(mobile)await page.getByRole("option",{name:"Project file 01",exact:true}).tap();
      else {
        await page.waitForFunction(()=>document.activeElement?.getAttribute('data-slot')==='select-item');
        await page.keyboard.press("ArrowDown");
        await page.waitForFunction(()=>document.activeElement?.textContent?.includes('Project file 01'));
        await page.keyboard.press("Enter");
      }
      await owner.waitFor({state:"hidden"});
    }
    await end();
    if(dense){
      await begin("portal-reopen");if(mobile)await action.tap();else await action.click();await owner.waitFor({state:"visible"});
      if(condition.texture==="glass"&&!mobile)await page.waitForFunction(()=>document.querySelector('[data-slot="select-content"]')?.dataset.uniGlassRenderer==="svg");
      await end();
    }
    await page.waitForFunction(()=>document.getAnimations().every(animation=>animation.playState!=="running"));
    await page.waitForTimeout(500); // Explicit stable-phase warm-up; first input above has none.
    const geometry=await owner.boundingBox(),actionBox=dense?null:await action.boundingBox(),commitsBefore=await page.evaluate(()=>window.__glassAudit.commits.length);
    await begin("interaction");let index=0;const interactionStart=Date.now();
    while(Date.now()-interactionStart<5050) {
      if(dense && mobile) {
        // CSS fallback has no map construction; exercise normal touch selections and reopenings.
        await page.getByRole("option",{name:`Project file ${index%2?"01":"00"}`,exact:true}).tap();
        await owner.waitFor({state:"hidden"});await action.tap();await owner.waitFor({state:"visible"});
      }
      else if(dense)await page.keyboard.press(index%2?"ArrowUp":"ArrowDown");
      else if(mobile)await action.tap();
      else {
        await page.mouse.move(actionBox.x+actionBox.width*(.2+.6*(index%10)/10),actionBox.y+actionBox.height/2);
        if(index%10===0)await action.click();if(index%10===5)await action.press("Space");
      }
      index++;await page.waitForTimeout(dense||mobile?100:30);
    }
    await page.waitForFunction(()=>document.getAnimations().every(animation=>animation.playState!=="running"));
    await end();const afterGeometry=await owner.boundingBox();
    const scrollOwner=dense?owner:page.getByTestId("scroll-stage"),scrollBox=await scrollOwner.boundingBox();
    const session=await context.newCDPSession(page);
    if(!mobile)await scrollOwner.hover({position:{x:scrollBox.width*.7,y:scrollBox.height*.55}});
    await begin("scroll");index=0;const scrollStart=Date.now();
    while(Date.now()-scrollStart<5050) {
      const direction=Math.floor(index/(mobile?3:20))%2?-1:1;
      if(mobile)await touchScroll(session,scrollBox,direction);else await page.mouse.wheel(0,48*direction);
      index++;await page.waitForTimeout(mobile?120:35);
    }
    await end();await page.mouse.move(1,1);await page.waitForTimeout(600);
    const snapshot=await owner.evaluate(el=>({renderer:el.dataset.uniGlassRenderer??"css",effectiveOpacity:getComputedStyle(el).getPropertyValue("--_uni-glass-effective-opacity"),samplers:Array.from(document.querySelectorAll('[data-uni-glass-renderer="svg"]')).length}));
    const idleRafRequests=await page.evaluate(async()=>{let count=0;const original=requestAnimationFrame;window.requestAnimationFrame=callback=>{count++;return original.call(window,callback);};await new Promise(resolve=>setTimeout(resolve,1000));window.requestAnimationFrame=original;return count;});
    const raw=await page.evaluate(()=>window.__glassAudit.finish());
    const phases=raw.phases.map(phase=>{
      const gaps=phase.frames.slice(1).map((timestamp,index)=>timestamp-phase.frames[index]);
      return {...phase,p95:percentile(gaps),max:gaps.length?Math.max(...gaps):null,encodes:raw.encodes.filter(entry=>entry.at>=phase.start&&entry.at<phase.end).length,longTasks:raw.tasks.filter(entry=>entry.startTime<phase.end&&entry.startTime+entry.duration>phase.start)};
    });
    const stateChanged=dense?raw.commits.some(commit=>commit.value!=="item-0"):raw.commits.length>commitsBefore;
    const result={...condition,startedAt:new Date(started).toISOString(),wallTimeMs:Date.now()-started,artifactHash,browser:browser.version(),userAgent:await page.evaluate(()=>navigator.userAgent),viewport,dpr,mobile,theme,...snapshot,phases,events:raw.events,commits:raw.commits,longTasks:raw.tasks,encodes:raw.encodes,builds:raw.builds,idleRafRequests,stateChanged,geometry:{before:geometry,after:afterGeometry},geometryStable:geometry.width===afterGeometry.width&&geometry.height===afterGeometry.height,errors};
    result.failures=[...evaluateSample(result),...errors.map(error=>`page:${error}`)];return result;
  }finally{clearTimeout(timeout);await context?.close();await browser.close();}
}

export async function runAudit(options) {
  const artifact=path.resolve(options.artifact),output=path.resolve(options.output??".scratch/glass-performance");
  const cases=orderedCases(options.profiles??["desktop-light-1","desktop-dark-1","desktop-light-2","desktop-dark-2","mobile-light-2","mobile-dark-2"],options.repetitions??3,options.usages,options.textures);
  await fs.access(path.join(artifact,"site/build/glass-regression.html"));
  const run=path.join(output,new Date().toISOString().replaceAll(/[:.]/g,"-")+"-"+crypto.randomBytes(3).toString("hex"));await fs.mkdir(run,{recursive:true});
  const hash=await digest(artifact),preview=await startDocsPreview(artifact),results=[];
  const harnessHash=crypto.createHash("sha256").update(await fs.readFile(new URL(import.meta.url))).digest("hex");
  await fs.writeFile(path.join(run,"manifest.json"),JSON.stringify({startedAt:new Date().toISOString(),artifactHash:hash,harnessHash,host:{platform:process.platform,arch:process.arch,node:process.version},seed:20261017,cases,phase:options.phase??"verification",budget:{stableWindowMs:5000,p95Ms:20,longTaskMs:50}},null,2));
  try {
    for(const [index,condition] of cases.entries()) {
      let result;try{result=await measure(preview.url,condition,hash);}catch(error){result={...condition,failures:[String(error)],wallTimeMs:null};}
      results.push(result);await fs.writeFile(path.join(run,`${String(index).padStart(3,"0")}.json`),JSON.stringify(result,null,2));
      console.log(JSON.stringify({index:index+1,total:cases.length,...condition,p95:result.phases?.filter(p=>["interaction","scroll"].includes(p.name)).map(p=>({phase:p.name,p95:p.p95})),failures:result.failures}));
    }
  }finally{await preview.close();}
  const unstableControls=results.filter(result=>result.texture==="solid"&&result.failures.length).map(({profile,usage,repetition})=>({profile,usage,repetition}));
  const summary={run,artifactHash:hash,results:results.length,failed:results.filter(result=>result.failures.length).length,unstableControls,complete:results.length===cases.length&&results.every(result=>!result.failures.length)};
  await fs.writeFile(path.join(run,"summary.json"),JSON.stringify(summary,null,2));console.log(JSON.stringify(summary));return summary;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href) {
  const values={};for(let index=2;index<process.argv.length;index+=2){const key=process.argv[index]?.replace(/^--/,"");if(!["artifact","output","phase","profiles","repetitions","usages","textures"].includes(key)||!process.argv[index+1])throw Error("Expected a known --key and value");values[key]=process.argv[index+1];}
  if(!values.artifact)throw Error("--artifact must name a production docs build with UNITARY_DOCS_TEST_FIXTURES=1");
  const summary=await runAudit({artifact:values.artifact,output:values.output,phase:values.phase,repetitions:values.repetitions?Number(values.repetitions):3,profiles:values.profiles?.split(","),usages:values.usages?.split(","),textures:values.textures?.split(",")});
  process.exitCode=summary.complete?0:1;
}
