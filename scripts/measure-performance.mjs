import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
const browser=await chromium.launch({channel:process.env.PLAYWRIGHT_CHANNEL||"chrome"});
const base=process.env.PLAYWRIGHT_BASE_URL||"http://127.0.0.1:3001";
const runs=[];
for(let i=0;i<3;i++){
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[];
  page.on("pageerror",error=>errors.push(error.message));
  const session=await context.newCDPSession(page);
  await session.send("Network.enable");
  await session.send("Network.emulateNetworkConditions",{offline:false,latency:150,downloadThroughput:200000,uploadThroughput:93750});
  await session.send("Emulation.setCPUThrottlingRate",{rate:4});
  await page.addInitScript(()=>{
    window.__inkPerf={lcp:0,cls:0};
    new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__inkPerf.lcp=entry.startTime;}).observe({type:"largest-contentful-paint",buffered:true});
    new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__inkPerf.cls+=entry.value;}).observe({type:"layout-shift",buffered:true});
  });
  await page.goto(base,{waitUntil:"networkidle",timeout:120000});
  await page.evaluate(()=>document.fonts.ready);
  const metrics=await page.evaluate(()=>({...window.__inkPerf,fcp:performance.getEntriesByName("first-contentful-paint")[0]?.startTime??null,resources:performance.getEntriesByType("resource").reduce((sum,e)=>sum+e.transferSize,0)}));
  runs.push({...metrics,errors});
  if(i===0){await mkdir("docs/qa/screenshots",{recursive:true});await page.screenshot({path:"docs/qa/screenshots/home-mobile-viewport.png"});}
  await context.close();
}
const desktop=await browser.newPage({viewport:{width:1440,height:1000}});
await desktop.goto(base,{waitUntil:"networkidle"});await desktop.screenshot({path:"docs/qa/screenshots/home-desktop-viewport.png"});
await browser.close();
const median=key=>runs.map(r=>r[key]).sort((a,b)=>a-b)[1];
const report={environment:"Local Next.js production server; Chrome; 390x844; 4x CPU slowdown; 150ms latency; 1.6Mbps download; new browser context each run; server image cache may be warm",runs,median:{lcp:median("lcp"),cls:median("cls"),fcp:median("fcp")},limitations:"Lab sample only, not field Core Web Vitals or INP measurement."};
await writeFile("docs/qa/performance.json",JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report,null,2));
