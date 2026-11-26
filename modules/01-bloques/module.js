(() => {
 const V=Vision,c=V.ctx;let paddle=480,tracked=false,score=0,lives=3,ball,bricks,ended=false;
 function serve(){ball={x:paddle,y:440,vx:180,vy:-230};}
 function reset(){score=0;lives=3;ended=false;bricks=Array.from({length:40},(_,i)=>({x:50+(i%10)*86,y:160+Math.floor(i/10)*24,alive:true}));serve();}
 reset();V.button('Reiniciar partida',reset);
 V.start({help:'Mueve una mano para desplazar la plataforma. Sin mano visible, el juego se pausa. Destruye todos los bloques; tienes 3 vidas.',
 results(r){tracked=!!r.multiHandLandmarks?.length;if(tracked)paddle=Math.max(65,Math.min(895,V.point(r.multiHandLandmarks[0][9]).x));},
 draw(dt){c.clearRect(0,0,960,540);V.background(undefined,.3);
 if(tracked&&!ended){ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;if(ball.x<8||ball.x>952){ball.x=Math.max(8,Math.min(952,ball.x));ball.vx*=-1;}if(ball.y<8){ball.y=8;ball.vy=Math.abs(ball.vy);}
 if(ball.vy>0&&ball.y>=462&&ball.y<=482&&Math.abs(ball.x-paddle)<73){ball.y=461;ball.vy=-Math.abs(ball.vy);ball.vx=(ball.x-paddle)*4;}
 for(const b of bricks){if(b.alive&&ball.x>b.x-8&&ball.x<b.x+86&&ball.y>b.y-8&&ball.y<b.y+26){b.alive=false;score+=10;ball.vy*=-1;break;}}
 if(ball.y>550){lives--;if(lives===0)ended=true;else serve();}if(bricks.every(b=>!b.alive))ended=true;
 }
 for(const b of bricks){if(b.alive){c.fillStyle=`hsl(${180+(b.y-160)*2} 90% 55%)`;c.fillRect(b.x,b.y,78,18);}}
 c.fillStyle='#fff';c.fillRect(paddle-65,470,130,12);c.fillStyle='#fcc000';c.beginPath();c.arc(ball.x,ball.y,8,0,Math.PI*2);c.fill();
 V.status.textContent=ended?(lives?'¡Ganaste! Reinicia para jugar.':'Fin de partida · reinicia'): `${tracked?'Jugando':'Pausa: muestra una mano'} · Puntos ${score} · Vidas ${lives}`;
 }});
})();
