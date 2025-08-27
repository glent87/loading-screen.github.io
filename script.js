// --- Динамические советы ---
const tips = [
  "Совет: Уважайте других игроков.",
  "Совет: Соблюдайте правила RP.",
  "Совет: Не используйте баги в личных целях.",
  "Совет: Играйте честно и получайте удовольствие!"
];

let tipIndex = 0;
const tipElement = document.getElementById("tip");

setInterval(() => {
  tipIndex = (tipIndex + 1) % tips.length;
  tipElement.textContent = tips[tipIndex];
}, 4000);

// --- Зацикленный прогресс ---
let progress = 0;
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");

function loopProgress() {
  progress = 0;
  const interval = setInterval(() => {
    if (progress < 100) {
      progress += 2; // шаг роста
      progressBar.style.width = progress + "%";
      progressText.textContent = progress + "%";
    } else {
      clearInterval(interval);
      setTimeout(loopProgress, 1000); // пауза и перезапуск
    }
  }, 100); // скорость
}

loopProgress();

// --- Частицы на фоне ---
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.speedX = (Math.random() - 0.5) * 1.5;
    this.speedY = (Math.random() - 0.5) * 1.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = "rgba(200,200,200,0.7)";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particlesArray = [];
  for (let i = 0; i < 100; i++) {
    particlesArray.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});
