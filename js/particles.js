/* =============================================
   Coral particles backdrop (desktop + mobile)
   Couleur coral #DB5A59 (thème secondaire du site)
   ============================================= */
(function () {
  'use strict';

  if (document.getElementById('bgParticles')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'bgParticles';
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    zIndex: '0',
    pointerEvents: 'none',
  });

  function appendIt() {
    document.body.appendChild(canvas);
    start();
  }

  if (document.body) appendIt();
  else document.addEventListener('DOMContentLoaded', appendIt);

  function start() {
    const ctx = canvas.getContext('2d');
    let W = 0, H = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const IS_MOBILE = window.matchMedia('(max-width: 900px)').matches;

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    // Densité : desktop = plus de particules
    const COUNT = IS_MOBILE ? 30 : 70;
    const particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 2.2 + 0.8,
        vx: (Math.random() - 0.5) * 0.25,
        vy: -(Math.random() * 0.45 + 0.15),
        alpha: Math.random() * 0.5 + 0.25,
        twinkle: Math.random() * Math.PI * 2,
        twinkleSpeed: 0.012 + Math.random() * 0.022,
      });
    }

    function tick() {
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.twinkle += p.twinkleSpeed;

        // wrap around
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;

        const twinkleFactor = 0.75 + Math.sin(p.twinkle) * 0.25;
        const a = p.alpha * twinkleFactor;

        // glow halo coral
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(219, 90, 89, ' + (a * 0.14).toFixed(3) + ')';
        ctx.fill();

        // core dot coral
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(219, 90, 89, ' + a.toFixed(3) + ')';
        ctx.fill();
      }
      requestAnimationFrame(tick);
    }
    tick();
  }
})();
