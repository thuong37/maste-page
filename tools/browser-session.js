// Dependency-free Chrome DevTools session for screenshots and interaction checks.
// Explicit device metrics avoid Chrome's minimum desktop window width at 375px.
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function openBrowser(chrome, profile) {
  const process = spawn(chrome, ['--headless=new','--no-sandbox','--disable-gpu','--no-first-run',`--user-data-dir=${profile}`,'--remote-debugging-port=0','about:blank'], {stdio:'ignore',windowsHide:true});
  let launchError;process.on('error',err=>{launchError=err;});
  const activePort=path.join(profile,'DevToolsActivePort');
  for(let i=0;!fs.existsSync(activePort);i++){if(launchError)throw launchError;if(i>200){process.kill();throw new Error('Chrome debug startup timed out');}await delay(100);}
  const port=fs.readFileSync(activePort,'utf8').split('\n')[0];
  const targets=await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const socket=new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject)=>{socket.onopen=resolve;socket.onerror=reject;});
  let seq=0;const pending=new Map();const errors=[];
  socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(new Error(m.error.message)):p.resolve(m.result);}}else if(m.method==='Runtime.exceptionThrown'){errors.push(m.params.exceptionDetails.text+': '+(m.params.exceptionDetails.exception?.description||''));}};
  const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});socket.send(JSON.stringify({id,method,params}));});
  await send('Page.enable');await send('Runtime.enable');
  return {send,errors,
    async size(width,height){await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});},
    async evaluate(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;},
    async navigate(url){await send('Page.navigate',{url});for(let i=0;i<100;i++){await delay(100);const r=await send('Runtime.evaluate',{expression:'document.readyState',returnByValue:true});if(r.result.value==='complete')return;}throw new Error('Page load timed out');},
    async screenshot(file){const shot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});fs.writeFileSync(file,Buffer.from(shot.data,'base64'));},
    async close(){socket.close();process.kill();if(process.exitCode===null)await Promise.race([new Promise(resolve=>process.once('exit',resolve)),delay(3000)]);}
  };
}
module.exports={openBrowser};
