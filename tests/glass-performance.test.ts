// @vitest-environment node
import { describe, expect, test } from "vitest";
import { evaluateSample, geometriesMatch, measureGeometries, orderedCases, percentile } from "../scripts/audit-glass-performance.mjs";

const phase=(name:string)=>{
  const start=34+["scene-load","activation","first-input","selection-lifecycle","interaction","scroll"].indexOf(name)*6000;
  return {name,start,end:start+5001,duration:5001,frames:Array.from({length:301},(_,i)=>start+i*16.67),p95:16.67,encodes:0,longTasks:[],scrollDistance:name==="scroll"?480:0};
};
const sample=()=>({measurementVersion:9,texture:"glass",renderer:"css",samplers:1,svgResources:0,builds:[],encodes:[],sceneReadiness:{texture:"solid",builds:0,encodes:0,samplers:0,fontsReadyAt:0,imageDecodedAt:15,imageURL:"https://fixture/scene.jpg",paint:{url:"https://fixture/scene.jpg",scene:true,renderTime:30,observedAt:32,size:100},readyAt:33},materialReadiness:{warmupStartedAt:23350,warmupFinishedAt:23850,stableReadyAt:23850},phases:[phase("scene-load"),phase("activation"),phase("first-input"),phase("interaction"),phase("scroll")],idleRafRequests:0,geometryStable:true,stateChanged:true,commits:[{at:24040}],events:[{type:"keydown",trusted:true,at:24039},{type:"wheel",trusted:true,at:30039}]});
const denseSample=()=>({...sample(),usage:"dense",mobile:false,stateChanged:false,
  phases:[phase("scene-load"),phase("activation"),phase("first-input"),phase("selection-lifecycle"),phase("interaction"),phase("scroll")],
  commits:[{at:12040,value:"item-0"},{at:18040,value:"item-1"}],
  states:[{kind:"focus",at:24040,value:"Project file 00"}],
  portals:[{kind:"closed",at:18050,id:1},{kind:"opened",at:18080,id:2}],stablePortal:{before:2,after:2},
  events:[{type:"keydown",trusted:true,at:18039},{type:"keydown",trusted:true,at:24039},{type:"wheel",trusted:true,at:30039}],
});
describe("Glass performance evidence",()=>{
  test("geometry evidence detects translated surfaces and unchanged labels",()=>{
    const rect={x:20,y:40,width:240,height:48};
    const before=[{...rect,label:{...rect,text:"Pin"}}];
    expect(geometriesMatch(before,before)).toBe(true);
    expect(geometriesMatch(before,[{...before[0],x:21}])).toBe(false);
    expect(geometriesMatch(before,[{...before[0],label:{...before[0].label,x:21}}])).toBe(false);
    expect(geometriesMatch(before,[{...before[0],label:null}])).toBe(false);
    expect(geometriesMatch([],[])).toBe(false);
    expect(geometriesMatch(before,[{...rect,label:{...rect,text:"Pause",width:245}}])).toBe(true);
  });
  test("Dense text offsets include only real scroll ancestors inside the surface and retain raw viewport evidence",()=>{
    const rect=(x:number,y:number,width=240,height=48)=>({x,y,width,height,left:x,right:x+width,top:y,bottom:y+height});
    const outside={scrollTop:999,scrollLeft:999,parentElement:null};
    const descendants=new Set<unknown>();
    const owner={scrollTop:5,scrollLeft:2,parentElement:outside,getAttribute:()=>"select-content",getBoundingClientRect:()=>({toJSON:()=>rect(20,40)}),contains:(node:unknown)=>descendants.has(node)};
    const viewport={scrollTop:75,scrollLeft:3,parentElement:owner,getAttribute:()=>"select-viewport"};
    const item={scrollTop:0,scrollLeft:0,parentElement:viewport,getAttribute:()=>"select-item"};
    [owner,viewport,item].forEach(node=>descendants.add(node));
    let textY=100;
    const text={textContent:"Project file 00",parentElement:item};
    const doc={defaultView:{NodeFilter:{SHOW_TEXT:4}},createTreeWalker:()=>{
      let first=true;return {currentNode:text,nextNode(){const result=first;first=false;return result;}};
    },createRange:()=>({selectNodeContents(){},getBoundingClientRect:()=>({toJSON:()=>rect(25,textY,120,20)})})};
    Object.assign(owner,{ownerDocument:doc});
    const before=measureGeometries([owner],true);
    textY=20;viewport.scrollTop=155;
    const after=measureGeometries([owner],true);
    expect(before[0].label.y).toBe(180);
    expect(after[0].label.y).toBe(180);
    expect(after[0].label.viewportRect.y).toBe(20);
    expect(after[0].label.x).toBe(30);
    expect(after[0].label.scrollOffsets).toHaveLength(2);
    expect(geometriesMatch(before,after)).toBe(true);
    expect(geometriesMatch(before,[{...after[0],y:41}])).toBe(false);
    expect(geometriesMatch(before,[{...after[0],label:{...after[0].label,y:181}}])).toBe(false);
    expect(geometriesMatch(measureGeometries([owner]),before)).toBe(false);
  });
  test("percentiles retain tail stalls without mutating raw order",()=>{
    const raw=[100,16,17,16];expect(percentile(raw)).toBe(100);expect(raw).toEqual([100,16,17,16]);expect(percentile([])).toBeNull();
  });
  test("deterministic rotation includes each condition and independent repetition",()=>{
    const cases=orderedCases(["desktop-light-1","desktop-dark-2"],3);
    expect(cases).toHaveLength(108);expect(cases).toEqual(orderedCases(["desktop-light-1","desktop-dark-2"],3));
    expect(new Set(cases.map(value=>JSON.stringify(value))).size).toBe(108);
  });
  test("empty, duplicate or invalid conditions cannot create passing evidence",()=>{
    expect(()=>orderedCases([],3)).toThrow();
    expect(()=>orderedCases(["desktop-light-1"],0)).toThrow();
    expect(()=>orderedCases(["desktop-light-1"],1.5)).toThrow();
    expect(()=>orderedCases(["mobile-light-1"],1)).toThrow();
    expect(()=>orderedCases(["desktop-light-1","desktop-light-1"],1)).toThrow();
    expect(()=>orderedCases(["desktop-light-1"],1,[],["glass"])).toThrow();
  });
  test("stable budgets reject short samples, rebuilds, long tasks and absent state changes",()=>{
    expect(evaluateSample(sample())).toEqual([]);
    expect(evaluateSample({...sample(),phases:[phase("scroll")]})).toContain("interaction:missing-or-duplicate");
    const bad=sample();bad.phases[3]={...bad.phases[3],duration:1000,frames:[],p95:25,encodes:2,longTasks:[{startTime:0,duration:60}] as never[]};
    bad.idleRafRequests=3;bad.geometryStable=false;bad.stateChanged=false;
    expect(evaluateSample(bad)).toEqual(expect.arrayContaining(["interaction:insufficient-sample","interaction:p95","interaction:unexpected-raster-work","interaction:long-task","idle:raf","interaction:geometry","interaction:no-state-commit"]));
  });
  test("CSS material activation rejects accidental raster or SVG work",()=>{
    expect(evaluateSample({...sample(),builds:[{start:100,end:180}]})).toContain("glass:unexpected-raster-work");
    expect(evaluateSample({...sample(),encodes:[{at:120}]})).toContain("glass:unexpected-raster-work");
    expect(evaluateSample({...sample(),svgResources:1})).toContain("glass:unexpected-sampling");
  });
  test("initial scene work stays separate and material prewarming cannot pass",()=>{
    const value=sample();value.phases[0].longTasks=[{startTime:0,duration:130}] as never[];
    expect(evaluateSample(value)).toEqual([]);
    for(const ready of [{...value.sceneReadiness,builds:1},{...value.sceneReadiness,encodes:1},{...value.sceneReadiness,samplers:1},{...value.sceneReadiness,texture:"glass"},{...value.sceneReadiness,imageURL:"https://fixture/other.jpg"},{...value.sceneReadiness,paint:{...value.sceneReadiness.paint,scene:false}},{...value.sceneReadiness,paint:{...value.sceneReadiness.paint,renderTime:0}},{...value.sceneReadiness,paint:{...value.sceneReadiness.paint,observedAt:10}},{...value.sceneReadiness,imageDecodedAt:-1},{...value.sceneReadiness,readyAt:7000}])
      expect(evaluateSample({...value,sceneReadiness:ready})).toContain("scene:unready-or-prewarmed");
    expect(evaluateSample({...value,phases:value.phases.slice(1)})).toContain("scene-load:missing-or-duplicate");
  });
  test("desktop and mobile use native CSS sampling with no UA spoofing requirement",()=>{
    expect(evaluateSample({...sample(),mobile:true})).toEqual([]);
    expect(evaluateSample({...sample(),mobile:true,renderer:"svg"})).toContain("glass:unexpected-sampling");
    expect(evaluateSample({...sample(),samplers:0})).toContain("glass:unexpected-sampling");
  });
  test("independent segmented surfaces retain exactly one sampler per item",()=>{
    for(const usage of ["tabs","switch"]){
      expect(evaluateSample({...sample(),usage,samplers:2})).toEqual([]);
      expect(evaluateSample({...sample(),usage,samplers:1})).toContain("glass:unexpected-sampling");
    }
  });
  test("runtime errors cannot produce passing evidence",()=>{
    expect(evaluateSample({...sample(),errors:["uncaught optical error"]})).toContain("runtime:errors");
  });
  test("stable input requires its own state commit and trusted input in each phase",()=>{
    expect(evaluateSample({...sample(),commits:[{at:12040}]})).toContain("interaction:no-state-commit");
    expect(evaluateSample({...sample(),events:[{type:"keydown",trusted:false,at:24039},{type:"wheel",trusted:false,at:30039}]})).toEqual(expect.arrayContaining(["interaction:no-trusted-input","scroll:no-trusted-input"]));
    expect(evaluateSample({...sample(),events:[{type:"keydown",trusted:true,at:12039},{type:"wheel",trusted:true,at:12039}]})).toEqual(expect.arrayContaining(["interaction:no-trusted-input","scroll:no-trusted-input"]));
  });
  test("v9 cannot promote historical mixed-lifecycle evidence to a new passing run",()=>{
    for(const measurementVersion of [7,8])expect(evaluateSample({...sample(),measurementVersion})).toContain("measurement:unsupported-version");
  });
  test("stable readiness follows the explicit warm-up and precedes stable interaction",()=>{
    for(const materialReadiness of [undefined,{warmupStartedAt:23350,warmupFinishedAt:23850,stableReadyAt:23350},{warmupStartedAt:23350,warmupFinishedAt:23800,stableReadyAt:23800},{warmupStartedAt:24000,warmupFinishedAt:24500,stableReadyAt:24500}])
      expect(evaluateSample({...sample(),materialReadiness})).toContain("interaction:unready");
  });
  test("Dense reports selection lifecycle costs separately from steady keyboard interaction",()=>{
    const value=denseSample();
    value.phases[3]={...value.phases[3],p95:70,longTasks:[{startTime:18060,duration:65}] as never[]};
    expect(evaluateSample(value)).toEqual([]);
    expect(value.phases[3].longTasks).toHaveLength(1);
    expect(evaluateSample({...value,phases:value.phases.filter(entry=>entry.name!=="selection-lifecycle")})).toContain("selection-lifecycle:missing-or-duplicate");
    expect(evaluateSample({...value,phases:[...value.phases,phase("selection-lifecycle")]})).toContain("selection-lifecycle:missing-or-duplicate");
    expect(evaluateSample({...value,phases:value.phases.map(entry=>entry.name==="selection-lifecycle"?{...entry,duration:1000}:entry)})).toContain("selection-lifecycle:insufficient-sample");
  });
  test("Dense lifecycle requires a changed value, trusted selection and observed close/reopen marks",()=>{
    const value=denseSample();
    expect(evaluateSample({...value,commits:[{at:12040,value:"item-0"}]})).toContain("selection-lifecycle:no-value-commit");
    expect(evaluateSample({...value,commits:[{at:12040,value:"item-0"},{at:18040,value:"item-0"}]})).toContain("selection-lifecycle:no-value-commit");
    expect(evaluateSample({...value,commits:[{at:12040,value:"item-0"},{at:24040,value:"item-1"}]})).toContain("selection-lifecycle:no-value-commit");
    expect(evaluateSample({...value,events:value.events.filter(entry=>entry.at!==18039)})).toContain("selection-lifecycle:no-trusted-input");
    for(const portals of [[],[{kind:"closed",at:18050,id:1}],[{kind:"closed",at:18050,id:1},{kind:"opened",at:18080,id:1}]])
      expect(evaluateSample({...value,portals})).toContain("selection-lifecycle:missing-portal-cycle");
  });
  test("Dense steady interaction needs actual open-list state changes and keeps one Portal",()=>{
    const value=denseSample();
    expect(evaluateSample({...value,states:[]})).toContain("interaction:no-stable-state-change");
    expect(evaluateSample({...value,states:[{kind:"focus",at:18040,value:"Project file 00"}]})).toContain("interaction:no-stable-state-change");
    expect(evaluateSample({...value,stablePortal:{before:2,after:3}})).toContain("interaction:portal-recreated");
    expect(evaluateSample({...value,portals:[...value.portals,{kind:"opened",at:24050,id:3}]})).toContain("interaction:portal-recreated");
    expect(evaluateSample({...value,materialReadiness:{...value.materialReadiness,warmupStartedAt:22000}})).toContain("interaction:lifecycle-overlap");
  });
  test("Dense touch steady interaction explicitly measures trusted native list scrolling",()=>{
    const value={...denseSample(),mobile:true,states:[{kind:"scroll",at:24040,from:0,to:84}],
      events:[{type:"touchstart",trusted:true,at:18039},{type:"touchmove",trusted:true,at:24039},{type:"touchmove",trusted:true,at:30039}]};
    expect(evaluateSample(value)).toEqual([]);
    expect(evaluateSample({...value,states:[{kind:"scroll",at:24040,from:84,to:84}]})).toContain("interaction:no-stable-state-change");
    expect(evaluateSample({...value,states:denseSample().states})).toContain("interaction:no-stable-state-change");
    expect(evaluateSample({...value,events:value.events.filter(entry=>entry.at!==24039)})).toContain("interaction:no-trusted-input");
  });
});
