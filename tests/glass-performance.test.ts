// @vitest-environment node
import { describe, expect, test } from "vitest";
import { evaluateSample, orderedCases, percentile } from "../scripts/audit-glass-performance.mjs";

const phase=(name:string)=>({name,duration:5001,frames:Array.from({length:301},(_,i)=>i*16.67),p95:16.67,encodes:0,longTasks:[],scrollDistance:name==="scroll"?480:0});
const sample=()=>({texture:"glass",phases:[phase("activation"),phase("first-input"),phase("interaction"),phase("scroll")],idleRafRequests:0,geometryStable:true,stateChanged:true});
describe("Glass performance evidence",()=>{
  test("percentiles retain tail stalls without mutating raw order",()=>{
    const raw=[100,16,17,16];expect(percentile(raw)).toBe(100);expect(raw).toEqual([100,16,17,16]);expect(percentile([])).toBeNull();
  });
  test("deterministic rotation includes each condition and independent repetition",()=>{
    const cases=orderedCases(["desktop-light-1","desktop-dark-2"],3);
    expect(cases).toHaveLength(54);expect(cases).toEqual(orderedCases(["desktop-light-1","desktop-dark-2"],3));
    expect(new Set(cases.map(value=>JSON.stringify(value))).size).toBe(54);
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
    const bad=sample();bad.phases[2]={...bad.phases[2],duration:1000,frames:[],p95:25,encodes:2,longTasks:[{startTime:0,duration:60}] as never[]};
    bad.idleRafRequests=3;bad.geometryStable=false;bad.stateChanged=false;
    expect(evaluateSample(bad)).toEqual(expect.arrayContaining(["interaction:insufficient-sample","interaction:p95","interaction:map-rebuild","interaction:long-task","idle:raf","interaction:geometry","interaction:no-state-commit"]));
  });
  test("cold map construction is gated separately from baseline component startup",()=>{
    const cold={...sample(),builds:[{start:100,end:180}]};cold.phases[0]={...cold.phases[0],encodes:2,longTasks:[{startTime:100,duration:80}] as never[]};
    expect(evaluateSample(cold)).toContain("activation:build-long-task");
    expect(evaluateSample({...cold,texture:"solid"})).toEqual([]);
    // A slow native component opening before raster work remains in raw diagnostics, not a fabricated map failure.
    cold.phases[0].longTasks=[{startTime:0,duration:80}] as never[];
    expect(evaluateSample(cold)).toEqual([]);
  });
  test("mobile evidence cannot accidentally claim desktop SVG as CSS fallback",()=>{
    const mobile={...sample(),mobile:true,renderer:"svg",samplers:1};
    expect(evaluateSample(mobile)).toContain("mobile:unexpected-svg");
    expect(evaluateSample({...mobile,renderer:"css",samplers:0})).toEqual([]);
  });
});
