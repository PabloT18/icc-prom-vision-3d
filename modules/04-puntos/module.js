(() => {
 const V=Vision,c=V.ctx;let face=true,body=true,hands=true;
 V.button('Rostro: mostrar / ocultar',()=>face=!face);V.button('Cuerpo: mostrar / ocultar',()=>body=!body);V.button('Manos: mostrar / ocultar',()=>hands=!hands);
 V.start({model:'holistic',help:'Aléjate para mostrar el cuerpo. Visualiza puntos del rostro, contornos de ojos, postura y ambas manos. Este módulo no interpreta emociones ni identifica personas.',results(r){
 c.clearRect(0,0,960,540);V.background();
 if(body)V.landmarks(r.poseLandmarks,window.POSE_CONNECTIONS||[], '#fcc000',3);
 if(face){V.landmarks(r.faceLandmarks,[], '#98d9df',1);V.landmarks(r.faceLandmarks,window.FACEMESH_CONTOURS||[], '#00f0ff',0);}
 if(hands){V.landmarks(r.leftHandLandmarks,V.edges,'#50ed80');V.landmarks(r.rightHandLandmarks,V.edges,'#ff6080');}
 V.status.textContent=`Rostro: ${r.faceLandmarks?.length||0} puntos · Cuerpo: ${r.poseLandmarks?.length||0} · Manos: ${(r.leftHandLandmarks?.length||0)+(r.rightHandLandmarks?.length||0)}`;
 }});
})();
