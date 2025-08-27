/* script.js — только частицы на canvas (без подсказок) */

document.addEventListener('DOMContentLoaded', () => {

  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d', { alpha: true });

  function fitCanvas(){
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  window.addEventListener('resize', fitCanvas, { passive:true });
  fitCanvas();

  const COUNT = Math.max(28, Math.floor(window.innerWidth / 36));
  const particles = [];

  function rnd(a,b){ return Math.random()*(b-a)+a; }

  class Particle{
    constructor(init=false){
      this.reset(init);
    }
    reset(init=false){
      this.x = rnd(-20, window.innerWidth + 20);
      this.y = rnd(-20, window.innerHeight + 20);
      this.r = rnd(0.6, 2.6);
      this.vx = rnd(-0.25, 0.25);
      this.vy = rnd(-0.12, 0.12);
      this.alpha = rnd(0.06, 0.22);
      this.life = rnd(8, 22) + (init?rnd(0,10):0);
      this.age = 0;
    }
    step(dt){
      this.x += this.vx * dt * 0.06;
      this.y += this.vy * dt * 0.06;
      this.age += dt * 0.01;
      if (this.x < -40 || this.x > window.innerWidth + 40 || this.y < -40 || this.y > window.innerHeight + 40 || this.age > this.life){
        this.reset(false);
      }
    }
    draw(ctx){
      ctx.beginPath();
      ctx.fillStyle = `rgba(220,230,235,${this.alpha})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();

      // glow
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(86,208,214,${this.alpha*0.06})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r*4.5, 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }
  }

  for (let i=0;i<COUNT;i++) particles.push(new Particle(true));

  let last = performance.now();
  function frame(now){
    const dt = now - last;
    last = now;
    ctx.clearRect(0,0,canvas.width,canvas.height);

    for (let p of particles){
      p.step(dt);
      p.draw(ctx);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
});
