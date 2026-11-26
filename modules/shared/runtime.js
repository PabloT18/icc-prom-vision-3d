/* Classic scripts deliberately keep support for direct file opening and Pages subpaths. */
window.Vision = (() => {
    const video = document.querySelector('#video'), canvas = document.querySelector('#stage');
    const ctx = canvas.getContext('2d'), status = document.querySelector('#status');
    let model, stream, stopped = false, running = false, raf, lastVideoTime = -1;
    const versions = { hands: '0.4.1675469240', holistic: '0.5.1675471629', selfie_segmentation: '0.1.1675465747' };
    const cleanups = [];
    const button = (label, fn) => { const b = document.createElement('button'); b.textContent = label; b.onclick = fn; document.querySelector('#controls').append(b); return b; };
    function background(image = video, alpha = 1) {
        if (!image || (image === video && video.readyState < 2)) return;
        ctx.save(); ctx.globalAlpha = alpha; ctx.translate(960, 0); ctx.scale(-1, 1); ctx.drawImage(image, 0, 0, 960, 540); ctx.restore();
    }
    const point = p => ({ x: (1 - p.x) * 960, y: p.y * 540 });
    const pinch = h => Math.hypot(h[4].x-h[8].x,h[4].y-h[8].y) / Math.max(.01, Math.hypot(h[0].x-h[9].x,h[0].y-h[9].y)) < .35;
    const edges = [[0,1],[1,2],[2,3],[3,4],[0,5],[5,6],[6,7],[7,8],[5,9],[9,10],[10,11],[11,12],[9,13],[13,14],[14,15],[15,16],[13,17],[0,17],[17,18],[18,19],[19,20]];
    function landmarks(points, links = [], color = '#00f0ff', radius = 3) {
        if (!points) return;
        ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = 1;
        for (const [a,b] of links) { if (!points[a] || !points[b]) continue; if ((points[a].visibility ?? 1)<.5 || (points[b].visibility ?? 1)<.5) continue; const p=point(points[a]),q=point(points[b]);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke(); }
        for (const p of points) { if ((p.visibility ?? 1)<.5) continue;const q=point(p);ctx.beginPath();ctx.arc(q.x,q.y,radius,0,Math.PI*2);ctx.fill(); }
    }
    function dispose() { stopped = true; running = false; cancelAnimationFrame(raf); stream?.getTracks().forEach(t=>t.stop()); cleanups.forEach(fn=>fn()); Promise.resolve(model?.close()).catch(()=>{}); }
    window.addEventListener('pagehide', dispose);
    function start(config) {
        document.querySelector('#help').textContent = config.help;
        const startButton = document.querySelector('#start');
        startButton.onclick = async () => {
            if (running || stopped) return;
            running = true; startButton.disabled = true; status.textContent = 'Cargando cámara y reconocimiento…';
            try {
                if (!navigator.mediaDevices?.getUserMedia) throw new Error('Abre esta página mediante localhost o HTTPS.');
                stream = await navigator.mediaDevices.getUserMedia({ video: { width: { ideal: 960 }, height: { ideal: 540 }, facingMode: 'user' }, audio: false });
                if (stopped) { stream.getTracks().forEach(t=>t.stop()); return; }
                video.srcObject = stream; await video.play();
                const type = config.model || 'hands';
                const Ctor = { hands: window.Hands, holistic: window.Holistic, selfie_segmentation: window.SelfieSegmentation }[type];
                if (!Ctor) throw new Error('No se descargó la librería. Revisa tu conexión y recarga.');
                model = new Ctor({ locateFile: f => `https://cdn.jsdelivr.net/npm/@mediapipe/${type}@${versions[type]}/${f}` });
                model.setOptions(type === 'hands' ? { maxNumHands: 2, modelComplexity: 0, minDetectionConfidence: .6, minTrackingConfidence: .6 } : type === 'holistic' ? { modelComplexity: 0, smoothLandmarks: true, refineFaceLandmarks: true, minDetectionConfidence: .5, minTrackingConfidence: .5 } : { modelSelection: 1 });
                model.onResults(r => { if (!stopped && running) config.results(r); });
                let previous = performance.now();
                const loop = async now => {
                    if (!running || stopped) return;
                    try {
                        const dt = Math.min(.05, (now-previous)/1000); previous=now;
                        if (!document.hidden && video.readyState>=2 && video.currentTime !== lastVideoTime) { lastVideoTime=video.currentTime; await model.send({ image: video }); }
                        if (!stopped) config.draw?.(dt, now);
                        if (!stopped) raf=requestAnimationFrame(loop);
                    } catch(error) { fail(error); }
                };
                status.textContent = 'Activo · muestra tus manos'; startButton.hidden = true;
                raf=requestAnimationFrame(loop);
            } catch(error) { fail(error); }
        };
        function fail(error) {
            running=false; stream?.getTracks().forEach(t=>t.stop()); Promise.resolve(model?.close()).catch(()=>{}); model=null;
            status.textContent = 'No se pudo iniciar o continuar: ' + error.message + ' · Puedes reintentar.';
            startButton.hidden=false;startButton.disabled=false;
        }
    }
    return { video, canvas, ctx, status, start, point, pinch, edges, landmarks, background, button, cleanups };
})();
