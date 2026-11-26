// Run with: node tests/smoke.cjs (requires Playwright and server at localhost:8000).
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH ? {executablePath:process.env.CHROMIUM_PATH} : {}),args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--no-sandbox']});
 const page=await browser.newPage(); const errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Deterministic landmarks exercise application behavior without claiming model accuracy.
 await page.route('https://cdn.jsdelivr.net/npm/@mediapipe/**',async route=>{
  const url=route.request().url();
  if(url.includes('camera_utils'))return route.fulfill({body:'window.Camera=class{start(){return Promise.resolve()}stop(){}}',contentType:'application/javascript'});
  const name=url.includes('/holistic')?'Holistic':url.includes('/selfie_segmentation')?'SelfieSegmentation':'Hands';
  await route.fulfill({contentType:'application/javascript',body:`window.${name}=class {setOptions(){}onResults(cb){this.cb=cb}async send({image}){let h=Array.from({length:21},(_,i)=>({x:.5+i*.003,y:.5+i*.002,z:0}));this.cb({image,segmentationMask:image,multiHandLandmarks:window.noHands?[]:[h],multiHandedness:[{label:'Right'}],faceLandmarks:h,poseLandmarks:h,leftHandLandmarks:h,rightHandLandmarks:h});}async close(){}};`});
 });
 await page.goto('http://localhost:8000/#01-bloques');
 for(const id of ['01-bloques','02-pizarra','04-puntos','05-hilos','06-invisible']){
  await page.locator(`[data-module="${id}"]`).click();
  const f=page.frameLocator('#module-frame');await f.locator('#start').click();await f.locator('#start').waitFor({state:'hidden'});
  await page.waitForTimeout(300);
  assert.equal(await page.locator(`[data-module="${id}"]`).getAttribute('aria-pressed'),'true');
  if(id==='01-bloques'){await f.locator('body').evaluate(()=>window.noHands=true);await page.waitForTimeout(100);assert.match(await f.locator('#status').textContent(),/Pausa/);}
  if(id==='02-pizarra'){await f.getByRole('button',{name:'Limpiar',exact:true}).click();await f.getByRole('button',{name:'Borrador',exact:true}).click();}
  if(id==='04-puntos')await f.getByRole('button',{name:'Rostro: mostrar / ocultar'}).click();
  if(id==='05-hilos'){await f.getByRole('button',{name:'Activar sonido',exact:true}).click();await f.getByRole('button',{name:'Silenciar',exact:true}).waitFor();}
  if(id==='06-invisible'){await f.getByRole('button',{name:'Capturar fondo en 5 s'}).click();await page.waitForTimeout(5300);await f.getByRole('button',{name:'Activar invisibilidad',exact:true}).click();await page.waitForTimeout(100);assert.match(await f.locator('#status').textContent(),/Invisibilidad activa/);}
  console.log('PASS',id);
 }
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/modules-mobile.png'});
 assert.deepEqual(errors,[]);
 // Permission failure: app must report error and permit retry.
 const denied=await browser.newPage();await denied.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Permission denied','NotAllowedError')};});
 await denied.route('https://cdn.jsdelivr.net/**',route=>route.fulfill({body:'window.Hands=class{}',contentType:'application/javascript'}));
 await denied.goto('http://localhost:8000/modules/01-bloques/');await denied.locator('#start').click();await denied.getByRole('status').filter({hasText:'Permission denied'}).waitFor();assert.equal(await denied.locator('#start').isEnabled(),true);console.log('PASS camera denial');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
