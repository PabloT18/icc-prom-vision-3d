(() => {
 const V=Vision,c=V.ctx,ink=document.createElement('canvas');ink.width=960;ink.height=540;const pen=ink.getContext('2d');
 const colors=['#00f0ff','#ff4060','#fcc000','#50ed80','#ffffff'];let color=colors[0],previous=null,erase=false;
 colors.forEach(col=>{const b=V.button('●',()=>{color=col;erase=false;});b.style.color=col;b.setAttribute('aria-label','Color '+col);});
 V.button('Borrador',()=>erase=!erase);V.button('Limpiar',()=>{pen.clearRect(0,0,960,540);previous=null;});
 V.start({help:'Pinza pulgar–índice para dibujar; suelta para levantar el lápiz. Apunta a la paleta de la franja inferior con cualquiera de las manos para elegir color. También puedes usar los botones.',
 results(r){c.clearRect(0,0,960,540);V.background(undefined,.35);const hands=r.multiHandLandmarks||[];
 const paletteHand=hands.find(h=>{const p=V.point(h[8]);return p.y>490&&p.x>=300&&p.x<650;});
 if(paletteHand){const p=V.point(paletteHand[8]);color=colors[Math.floor((p.x-300)/70)];erase=false;}
 const h=hands.find(h=>h!==paletteHand&&V.pinch(h));
 if(h){const p=V.point(h[8]);if(p.y<480){pen.globalCompositeOperation=erase?'destination-out':'source-over';pen.strokeStyle=color;pen.lineWidth=erase?32:5;pen.lineCap='round';pen.beginPath();pen.moveTo((previous||p).x,(previous||p).y);pen.lineTo(p.x,p.y);pen.stroke();previous=p;}else previous=null;}else previous=null;
 c.drawImage(ink,0,0);colors.forEach((col,i)=>{c.fillStyle=col;c.fillRect(300+i*70,495,60,30);if(col===color&&!erase){c.strokeStyle='#fff';c.lineWidth=3;c.strokeRect(298+i*70,493,64,34);}});
 hands.forEach(h=>{const p=V.point(h[8]);c.fillStyle=color;c.beginPath();c.arc(p.x,p.y,7,0,7);c.fill();});V.status.textContent=erase?'Borrador activo':h?'Dibujando':'Haz pinza para dibujar';
 }});
})();
