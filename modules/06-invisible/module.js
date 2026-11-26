(() => {
 const V=Vision,c=V.ctx,bg=document.createElement('canvas'),mask=document.createElement('canvas');bg.width=mask.width=960;bg.height=mask.height=540;const b=bg.getContext('2d'),m=mask.getContext('2d');let captured=false,invisible=false,countdown=null;
 const capture=V.button('Capturar fondo en 5 s',()=>{if(V.video.readyState<2){V.status.textContent='Primero inicia la cámara.';return;}countdown=performance.now()+5000;});
 const toggle=V.button('Activar invisibilidad',()=>{if(!captured){V.status.textContent='Captura primero el fondo sin personas.';return;}invisible=!invisible;toggle.textContent=invisible?'Mostrar persona':'Activar invisibilidad';});
 V.start({model:'selfie_segmentation',help:'Inicia la cámara, pulsa capturar y sal del encuadre durante 5 segundos. Regresa y activa la invisibilidad. Mantén fija la cámara y estable la iluminación. El control de este módulo es por botones.',results(r){
 if(countdown){const remaining=Math.ceil((countdown-performance.now())/1000);V.status.textContent='Sal del encuadre · captura en '+Math.max(0,remaining)+' s';if(remaining<=0){b.drawImage(r.image,0,0,960,540);captured=true;countdown=null;V.status.textContent='Fondo capturado · regresa y activa el efecto';}}
 c.clearRect(0,0,960,540);V.background(r.image);
 if(captured&&invisible){m.clearRect(0,0,960,540);m.globalCompositeOperation='source-over';m.drawImage(r.segmentationMask,0,0,960,540);m.globalCompositeOperation='source-in';m.drawImage(bg,0,0);m.globalCompositeOperation='source-over';V.background(mask);}
 if(!countdown&&captured)V.status.textContent=invisible?'Invisibilidad activa · cámara fija':'Fondo listo · persona visible';
 }});
})();
