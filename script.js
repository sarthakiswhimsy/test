document.addEventListener("DOMContentLoaded", () => {

  // =====================
  // COUNTDOWN (TEST)
  // =====================
  const targetDate = Date.now() + 5000;
  const countdownEl = document.getElementById("countdown");

  const countdownTimer = setInterval(() => {

    const diff = targetDate - Date.now();

    if (diff <= 0) {
      clearInterval(countdownTimer);

      document.getElementById("countdownSection").style.display = "none";
      document.getElementById("gameSection").style.display = "none";
      document.getElementById("birthdayScene").style.display = "block";

      setupBirthdayScene();
      return;
    }
 const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  countdownEl.innerText =
    `${days}d ${hours}h ${minutes}m ${seconds}s`;

  }, 1000);
// =====================
// RACCOON GAME (SMOOTH & SLOW)
// =====================
// =====================
// GAME
// =====================
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");

let raccoon, obstacle;
let score = 0;
let highScore = 0;
let speed = 3; // slower + constant
let gameRunning = false;
let animationId;

function initGame() {
  raccoon = {
    x: 50,
    y: 150,
    vy: 0,
    gravity: 0.6,
    jumpPower: -12,
    grounded: true
  };

  obstacle = {
    x: canvas.width,
    y: 150
  };

  score = 0;
  speed = 3; // constant speed
  gameRunning = true;

  highScore = localStorage.getItem("highScore") || 0;
  document.getElementById("highScore").innerText = highScore;
  document.getElementById("score").innerText = 0;
}

function drawBackground() {
  ctx.fillStyle = "#fff5f8";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "#444";
  ctx.beginPath();
  ctx.moveTo(0, 170);
  ctx.lineTo(canvas.width, 170);
  ctx.stroke();
}

function drawRaccoon() {
  ctx.font = "28px Arial";
  ctx.fillText("🦝", raccoon.x, raccoon.y);
}

function drawObstacle() {
  ctx.font = "28px Arial";
  ctx.fillText("🎂", obstacle.x, obstacle.y);
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBackground();

  // physics
  raccoon.vy += raccoon.gravity;
  raccoon.y += raccoon.vy;

  if (raccoon.y >= 150) {
    raccoon.y = 150;
    raccoon.vy = 0;
    raccoon.grounded = true;
  }

  // move obstacle
  obstacle.x -= speed;

  if (obstacle.x < -20) {
    obstacle.x = canvas.width + Math.random() * 200;

    score++;
    document.getElementById("score").innerText = score;

    // ❌ REMOVED speed increase
  }

  // collision
  if (
    raccoon.x < obstacle.x + 20 &&
    raccoon.x + 20 > obstacle.x &&
    raccoon.y > 130
  ) {
    gameRunning = false;

    if (score > highScore) {
      localStorage.setItem("highScore", score);
      document.getElementById("highScore").innerText = score;
    }

    cancelAnimationFrame(animationId);

    setTimeout(() => {
      alert("Game Over 🦝\nScore: " + score);
    }, 100);

    return;
  }

  drawRaccoon();
  drawObstacle();

  animationId = requestAnimationFrame(gameLoop);
}

// =====================
// CONTROLS
// =====================

// keyboard
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();

    if (raccoon && raccoon.grounded && gameRunning) {
      raccoon.vy = raccoon.jumpPower;
      raccoon.grounded = false;
    }
  }
});

// mobile tap
canvas.addEventListener("touchstart", () => {
  if (raccoon && raccoon.grounded && gameRunning) {
    raccoon.vy = raccoon.jumpPower;
    raccoon.grounded = false;
  }
});

// =====================
// START BUTTON
// =====================
startBtn.addEventListener("click", () => {
  initGame();
  gameLoop();
});

  // =====================
  // BIRTHDAY SCENE
  // =====================
  function setupBirthdayScene() {

    const btn = document.getElementById("openGiftBtn");
    const img = document.getElementById("raccoonWithGift");

    const images = ["img5.jpg", "img2.jpg", "img3.jpg", "img4.jpg"];
    let index = 0;

    const slideshow = setInterval(() => {
      index = (index + 1) % images.length;

      img.style.opacity = 0;
      setTimeout(() => {
        img.src = images[index];
        img.style.opacity = 1;
      }, 300);

    }, 2000);

    btn.onclick = () => {

      clearInterval(slideshow);
      launchConfetti();

      setTimeout(() => {

        document.getElementById("birthdayScene").style.display = "none";
        document.getElementById("balloonGameSection").style.display = "block";

        startBalloonGame();

      }, 700);
    };
  }


  // =====================
  // CONFETTI
  // =====================
  function launchConfetti() {
    for (let i = 0; i < 35; i++) {

      const c = document.createElement("div");

      c.style.position = "fixed";
      c.style.width = "8px";
      c.style.height = "8px";
      c.style.background = ["#ffe066", "#ff4d6d", "#4cc9f0"][Math.floor(Math.random() * 3)];
      c.style.top = "50%";
      c.style.left = "50%";
      c.style.borderRadius = "50%";
      c.style.zIndex = "999";

      document.body.appendChild(c);

      const angle = Math.random() * 2 * Math.PI;
      const dist = Math.random() * 250;

      c.animate([
        { transform: "translate(0,0)", opacity: 1 },
        {
          transform: `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist}px)`,
          opacity: 0
        }
      ], {
        duration: 1000,
        easing: "ease-out"
      });

      setTimeout(() => c.remove(), 1000);
    }
  }


  // =====================
  // BALLOON SECTION
  // =====================
  function startBalloonGame() {

    const container = document.getElementById("balloonContainer");
    const message = document.getElementById("balloonMessage");
    const continueBtn = document.getElementById("continueBtn");

    container.innerHTML = "";
    message.innerText = "";
    continueBtn.style.display = "none";

    let remaining = 8;

    const messages = [
  "I wish that you always remember how special you truly are 💖",
"I wish that you find success in everything you dream of ✨",
"I wish that life treats you gently and you have fewer migraines 🌟",
"I wish that you always stay exactly the way you are 🦝❤️",
"I wish that every day feels like it’s a little bit about you 🎉",
"I wish that you receive all the happiness you truly deserve 🌈",
"I wish that we stay together through everything, till the very end, you and me 🤍",
"I wish that you always remember we are exactly the same, and that’s what makes us so special 🫶"
    ]

    for (let i = 0; i < 8; i++) {

      const balloon = document.createElement("span");
      balloon.innerText = "🎈";

      balloon.onclick = () => {

        balloon.style.transform = "scale(0)";
        setTimeout(() => balloon.remove(), 300);

        message.innerText =
          messages[Math.floor(Math.random() * messages.length)];

        remaining--;

        if (remaining === 0) {
          setTimeout(() => {

            continueBtn.style.display = "inline-block";

            continueBtn.onclick = () => {
              document.getElementById("balloonGameSection").style.display = "none";
              document.getElementById("finalSection").style.display = "block";
            };

          }, 500);
        }
      };

      container.appendChild(balloon);
    }
  }


  // =====================
  // FINAL BUTTONS
  // =====================
  window.viewAgain = function () {

    document.getElementById("finalSection").style.display = "none";

    document.getElementById("countdownSection").style.display = "block";
    document.getElementById("gameSection").style.display = "block";

    location.reload(); // clean restart
  };

  window.playGameOnly = function () {

    document.getElementById("finalSection").style.display = "none";
    document.getElementById("countdownSection").style.display = "none";
    document.getElementById("birthdayScene").style.display = "none";
    document.getElementById("balloonGameSection").style.display = "none";

    document.getElementById("gameSection").style.display = "block";
  };

});