// Repeatable browser checks for the company prototype; no third-party packages.
const assert = require('assert/strict');
const http = require('http');
const fs = require('fs');
const path = require('path');
const {openBrowser} = require('./browser-session');
const ROOT=path.resolve(__dirname,'..');
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg'};
const server=http.createServer((req,res)=>{
  const file=path.resolve(ROOT,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(ROOT+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);return res.end();}
  res.setHeader('Content-Type',MIME[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  fs.mkdirSync(path.join(ROOT,'scratch'),{recursive:true});
  const profile=fs.mkdtempSync(path.join(ROOT,'scratch','company-test-'));
  let browser;
  try{
    browser=await openBrowser(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',profile);
    const base=`http://127.0.0.1:${server.address().port}`;
    const run=expression=>browser.evaluate(expression);
    const click=selector=>run(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const change=(selector,value)=>run(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});el.value=${JSON.stringify(value)};el.dispatchEvent(new Event('change',{bubbles:true}));})()`);
    const count=()=>run('document.querySelectorAll("#company-grid .company-card").length');
    // Explicit width checks avoid a false pass on Chrome's default 500px window.
    const checkLayout=async(width)=>{
      assert.equal(await run('innerWidth'),width);
      const metrics=await run('({width:innerWidth,scroll:document.documentElement.scrollWidth})');
      assert.ok(metrics.scroll<=metrics.width,`Overflow at ${width}px: ${metrics.scroll}`);
    };
    await browser.size(1440,900);await browser.navigate(base+'/kham-pha-cong-ty.html');
    await run('localStorage.removeItem("easycv-company-follows-v1")');await browser.navigate(base+'/kham-pha-cong-ty.html');
    assert.equal(await run('EASYCV_COMPANIES.length'),26);assert.equal(await count(),9);await checkLayout(1440);
    assert.equal(await run('document.querySelector("#following-count").textContent'),'3');
    await click('[data-follow="3"]');assert.equal(await run('document.querySelector("#following-count").textContent'),'2');
    await browser.navigate(base+'/kham-pha-cong-ty.html');assert.equal(await run('document.querySelector("#following-count").textContent'),'2');
    await click('[data-follow="3"]');await click('[data-view="following"]');assert.equal(await count(),3);
    await click('[data-view="applied"]');assert.equal(await count(),5);
    await click('[data-view="viewed"]');assert.equal(await count(),9);
    await click('[data-view="discover"]');await click('[data-page="2"]');assert.equal(await run('document.querySelector("#company-pagination [aria-current=page]").textContent'),'2');
    await click('[data-collection="bank"]');assert.equal(await count(),3);
    await click('[data-quick="flexible"]');assert.equal(await count(),1);
    await click('#reset-filters');
    await run('document.querySelector("#company-keyword").value="fpt software";document.querySelector("#company-search").requestSubmit()');assert.equal(await count(),1);
    await change('#company-location','Hồ Chí Minh');assert.equal(await count(),0);
    await click('[data-reset]');assert.equal(await count(),9);
    await change('#company-location','Hà Nội');assert.equal(await run('document.querySelector("#company-location").value'),'Hà Nội');
    assert.equal(await run('Array.from(document.querySelectorAll("#company-grid .company-city"),e=>e.textContent).every(s=>s.includes("Hà Nội"))'),true);
    await click('#reset-filters');
    await run('document.querySelector("#company-keyword").value="CONG NGHE";document.querySelector("#company-search").requestSubmit()');
    assert.equal(await run('document.querySelectorAll("#company-grid .company-card").length>0'),true);
    await click('#reset-filters');
    await click('[data-filter="city"][value="Đà Nẵng"]');assert.equal(await count(),2);
    await click('[data-remove="city"]');assert.equal(await count(),9);
    await change('#company-sort','name');
    const sorted=await run('Array.from(document.querySelectorAll("#company-grid h3 a"),e=>e.textContent)');assert.deepEqual(sorted,[...sorted].sort((a,b)=>a.localeCompare(b,'vi')));
    await browser.size(375,900);await checkLayout(375);await click('#mobile-filter-toggle');assert.equal(await run('document.querySelector("#mobile-filter-toggle").getAttribute("aria-expanded")'),'true');
    await click('#mobile-toggle-btn');assert.equal(await run('document.querySelector("#mobile-toggle-btn").getAttribute("aria-expanded")'),'true');
    assert.equal(await run(`document.querySelector('#mobile-drawer-overlay a[href="kham-pha-cong-ty.html"]')!==null`),true);
    await browser.navigate(base+'/cong-ty.html?id=1');await checkLayout(375);
    assert.equal(await run('document.querySelectorAll("#profile-job-list .job-card").length'),2);
    await click('#about-toggle');assert.equal(await run('document.querySelector("#about-more").hidden'),false);
    await change('#profile-job-location','Đà Nẵng');assert.equal(await run('document.querySelectorAll("#profile-job-list .job-card").length'),1);
    assert.ok((await run('document.querySelector(".job-title-link").getAttribute("href")')).includes('id=13'));
    await click('#show-matched-jobs');assert.equal(await run('document.querySelector("#profile-job-match").checked'),true);
    await run('Object.defineProperty(navigator,"share",{value:undefined,configurable:true});Object.defineProperty(navigator,"clipboard",{value:{writeText:async text=>{window.testSharedUrl=text;}},configurable:true})');
    await click('#share-company');const sharedUrl=new URL(await run('window.testSharedUrl'));assert.equal(sharedUrl.pathname,'/cong-ty.html');assert.equal(sharedUrl.searchParams.get('id'),'1');
    const firstJob=await run('document.querySelector(".job-title-link").getAttribute("href")');
    assert.equal(await run(`fetch(${JSON.stringify(firstJob)}).then(r=>r.status)`),200);
    await browser.size(1440,900);await checkLayout(1440);
    // Every directory record has a valid profile and all shared jobs are reachable.
    const ids=await run('EASYCV_COMPANIES.map(c=>c.id)');
    const allJobs=await run('EASYCV_COMPANIES.flatMap(c=>c.jobs.map(j=>j.id))');assert.equal(new Set(allJobs).size,28);
    for(const id of ids){await browser.navigate(base+'/cong-ty.html?id='+id);assert.ok(await run('!!document.querySelector(".profile-title h1")'));assert.ok(await run('document.querySelectorAll("#profile-job-list .job-card").length>0'));}
    await browser.navigate(base+'/cong-ty.html?id=missing');assert.equal(await run('document.querySelector("main h1").textContent'),'Không tìm thấy công ty');
    assert.deepEqual(browser.errors,[]);
    console.log('PASS: directory search/filter/sort/pagination, follow persistence, activity tabs, mobile navigation, profiles, job filters and links, invalid ID, true 1440/375 layouts.');
  }finally{if(browser)await browser.close();server.close();fs.rmSync(profile,{recursive:true,force:true});}
})().catch(err=>{console.error(err);process.exitCode=1;});
