(() => {
 const V=Vision,c=V.ctx;let points=[],audio,osc,gain,enabled=false;
 const sound=V.button('Activar sonido',async()=>{try{if(!audio){audio=new AudioContext();osc=audio.createOscillator();gain=audio.createGain();gain.gain.value=0;osc.type='sine';osc.connect(gain);gain.connect(audio.destination);osc.start();}await audio.resume();enabled=!enabled;sound.textContent=enabled?'Silenciar':'Activar sonido';if(!enabled)gain.gain.setTargetAtTime(0,audio.currentTime,.1);}catch(e){V.status.textContent='Audio no disponible: '+e.message;}});
 V.cleanups.push(()=>{if(audio)audio.close();});document.addEventListener('visibilitychange',()=>{if(document.hidden){points=[];if(gain)gain.gain.setTargetAtTime(0,audio.currentTime,.05);}});
 V.start({help:'Mueve una o ambas manos para deformar la cortina. La cámara permanece oculta. Activa el sonido con el botón; la altura de la mano modifica el tono.',
 results(r){points=(r.multiHandLandmarks||[]).map(h=>V.point(h[8]));},draw(dt,now){
 c.fillStyle='#071018';c.fillRect(0,0,960,540);c.lineWidth=1;c.strokeStyle='#9cffff';
 for(let x=0;x<=960;x+=12){c.beginPath();for(let y=0;y<=540;y+=8){let offset=Math.sin(y*.014+now*.0006+x*.01)*3;for(const p of points){const d=Math.hypot(x-p.x,y-p.y);offset+=(x<p.x?-1:1)*90*Math.exp(-d*d/18000);}if(y===0)c.moveTo(x+offset,y);else c.lineTo(x+offset,y);}c.stroke();}
 if(audio){const active=enabled&&points.length&&!document.hidden;gain.gain.setTargetAtTime(active?.045:0,audio.currentTime,.08);if(active)osc.frequency.setTargetAtTime(110+(1-points[0].y/540)*660,audio.currentTime,.08);}
 V.status.textContent=points.length?'Interacción activa':'Muestra una mano frente a la cámara';
 }});
})();
