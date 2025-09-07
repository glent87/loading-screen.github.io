// Smooth theme color interpolator.
// Changes colors every 5 seconds and smoothly animates CSS variables over 800ms.
document.addEventListener('DOMContentLoaded', () => {

  const THEMES = [
    {
      name: 'cyan',
      vars: {
        '--bg-1': '#070707',
        '--bg-2': '#151515',
        '--accent': '#56d0d6',
        '--accent-2': '#2aaeb3',
        '--muted': '#9ea3a7',
        '--text': '#eef0f2',
        '--particle-color': '220,230,235',
        '--particle-glow': '86,208,214',
        '--light-sweep-opacity': '0.03'
      }
    },
    {
      name: 'warm',
      vars: {
        '--bg-1': '#0b0502',
        '--bg-2': '#24120a',
        '--accent': '#ff8a00',
        '--accent-2': '#ff4d4d',
        '--muted': '#d6b9a8',
        '--text': '#fff7ef',
        '--particle-color': '255,230,200',
        '--particle-glow': '255,140,20',
        '--light-sweep-opacity': '0.035'
      }
    },
    {
      name: 'violet',
      vars: {
        '--bg-1': '#08030f',
        '--bg-2': '#2b1350',
        '--accent': '#a46cff',
        '--accent-2': '#6b4cff',
        '--muted': '#bda7d6',
        '--text': '#f5f0ff',
        '--particle-color': '230,215,255',
        '--particle-glow': '164,108,255',
        '--light-sweep-opacity': '0.03'
      }
    }
  ];

  const INTERVAL = 5000; // change every 5 seconds
  const DURATION = 800; // animate over 800ms

  const root = document.documentElement;
  let idx = 0;

  // helpers
  function hexToRgb(hex){
    hex = hex.replace('#','');
    if (hex.length === 3) hex = hex.split('').map(h=>h+h).join('');
    const n = parseInt(hex,16);
    return [(n>>16)&255, (n>>8)&255, n&255];
  }
  function rgbToHex(r,g,b){
    return '#' + [r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('');
  }
  function parseRgbString(s){
    return s.split(',').map(x=>parseInt(x.trim(),10));
  }

  // read current CSS variable values (if set) and return as numeric map
  function getCurrentVars(themeTemplate){
    const res = {};
    const cs = getComputedStyle(root);
    for (const key of Object.keys(themeTemplate)){
      const val = cs.getPropertyValue(key).trim();
      if (!val) {
        res[key] = themeTemplate[key];
      } else {
        res[key] = val;
      }
    }
    return res;
  }

  // produce numeric representation for interpolation
  function toNumericMap(vars){
    const num = {};
    for (const k in vars){
      const v = vars[k];
      if (k === '--particle-color' || k === '--particle-glow'){
        num[k] = parseRgbString(v);
      } else if (k === '--light-sweep-opacity'){
        num[k] = [parseFloat(v)];
      } else {
        // hex colors -> rgb array
        num[k] = hexToRgb(v);
      }
    }
    return num;
  }

  // set CSS vars from numeric map (array values)
  function setVarsFromNumeric(num){
    for (const k in num){
      const arr = num[k];
      if (k === '--particle-color' || k === '--particle-glow'){
        root.style.setProperty(k, arr.map(v=>Math.round(v)).join(','));
      } else if (k === '--light-sweep-opacity'){
        root.style.setProperty(k, String(arr[0]));
      } else {
        root.style.setProperty(k, rgbToHex(Math.round(arr[0]), Math.round(arr[1]), Math.round(arr[2])));
      }
    }
  }

  // animate from current to target over duration (ms)
  function animateTo(targetVars, duration){
    const currentCss = getCurrentVars(targetVars);
    const start = toNumericMap(currentCss);
    const end = toNumericMap(targetVars);

    const startTime = performance.now();
    function step(now){
      const t = Math.min(1, (now - startTime) / duration);
      const ease = t; // linear (change if you want ease)
      const interp = {};
      for (const k in start){
        const s = start[k];
        const e = end[k];
        const out = [];
        for (let i=0;i<e.length;i++){
          out[i] = s[i] + (e[i] - s[i]) * ease;
        }
        interp[k] = out;
      }
      setVarsFromNumeric(interp);
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function nextTheme(){
    const nextIdx = (idx + 1) % THEMES.length;
    animateTo(THEMES[nextIdx].vars, DURATION);
    idx = nextIdx;
  }

  // initialize: set to first theme variables immediately
  setTimeout(()=>{
    setVarsFromNumeric(toNumericMap(THEMES[0].vars));
  }, 0);

  // start cycle
  setInterval(nextTheme, INTERVAL);

  /* ---------- PARTICLES (reads CSS variables each frame) ---------- */

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

  function getParticleColors(){
    const cs = getComputedStyle(document.documentElement);
    let pc = cs.getPropertyValue('--particle-color').trim();
    let pg = cs.getPropertyValue('--particle-glow').trim();
    if (!pc) pc = '220,230,235';
    if (!pg) pg = '86,208,214';
    return { pc, pg };
  }

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
    draw(ctx, colors){
      ctx.beginPath();
      ctx.fillStyle = `rgba(${colors.pc},${this.alpha})`;
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fill();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(${colors.pg},${this.alpha*0.06})`;
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

    const colors = getParticleColors();

    for (let p of particles){
      p.step(dt);
      p.draw(ctx, colors);
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

});
