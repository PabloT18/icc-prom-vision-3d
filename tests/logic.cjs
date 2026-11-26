const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.join(__dirname,'..');
function environment(){
 let now=0,frame,callback,stops=0,closes=0;const handlers={};
 const ctx=new Proxy({}, {get:(o,k)=>o[k]||(()=>{}),set:(o,k,v)=>(o[k]=v,true)});
 const el=()=>({textContent:'',hidden:false,disabled:false,style:{},children:[],append(b){this.children.push(b)},setAttribute(){},getContext:()=>ctx});
 const els={'#video':{readyState:4,currentTime:0,play:async()=>{},srcObject:null},'#stage':el(),'#status':el(),'#help':el(),'#controls':el(),'#start':el()};
 const model=class {setOptions(){}onResults(cb){callback=cb}async send({image}){callback({image,segmentationMask:{},multiHandLandmarks:[],faceLandmarks:[],poseLandmarks:[]})}async close(){closes++}};
 const sandbox={console,Promise,Math,performance:{now:()=>now},document:{hidden:false,querySelector:k=>els[k],createElement:el,addEventListener:(n,f)=>handlers[n]=f},navigator:{mediaDevices:{getUserMedia:async()=>({getTracks:()=>[{stop:()=>stops++}]})}},requestAnimationFrame:f=>(frame=f,1),cancelAnimationFrame:()=>{frame=null}};
 sandbox.window=sandbox;sandbox.addEventListener=(n,f)=>handlers[n]=f;sandbox.Hands=sandbox.Holistic=sandbox.SelfieSegmentation=model;
 const context=vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'modules/shared/runtime.js'),'utf8'),context);
 return {context,els,handlers,get stops(){return stops},get closes(){return closes},async tick(t){now=t;els['#video'].currentTime++;await frame(t)},emit:r=>callback(r)};
}
(async()=>{
 for(const id of ['01-bloques','02-pizarra','04-puntos','05-hilos','06-invisible']){
 const e=environment();vm.runInContext(fs.readFileSync(path.join(root,'modules',id,'module.js'),'utf8'),e.context);await e.els['#start'].onclick();await e.tick(33);
 const click=name=>e.els['#controls'].children.find(b=>b.textContent===name).onclick();
 if(id==='01-bloques')assert.match(e.els['#status'].textContent,/Pausa/);
 if(id==='02-pizarra'){click('Borrador');await e.tick(66);assert.match(e.els['#status'].textContent,/Borrador/);click('Limpiar');}
 if(id==='04-puntos')assert.match(e.els['#status'].textContent,/Rostro: 0/);
 if(id==='06-invisible'){click('Activar invisibilidad');assert.match(e.els['#status'].textContent,/Captura primero/);click('Capturar fondo en 5 s');await e.tick(5100);click('Activar invisibilidad');await e.tick(5200);assert.match(e.els['#status'].textContent,/Invisibilidad activa/);}
 e.handlers.pagehide();assert.equal(e.stops,1);assert.equal(e.closes,1);console.log('PASS',id,'and cleanup');
 }
 const e=environment();e.context.navigator.mediaDevices.getUserMedia=async()=>{throw new Error('Permission denied')};e.context.Vision.start({results(){},help:''});await e.els['#start'].onclick();assert.match(e.els['#status'].textContent,/Permission denied/);assert.equal(e.els['#start'].disabled,false);console.log('PASS denied camera and retry');
})().catch(e=>{console.error(e);process.exit(1)});
