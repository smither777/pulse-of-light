const welcome = document.getElementById('welcome');
const game = document.getElementById('game');
const pulse = document.getElementById('pulse');
const pulsesDisplay = document.getElementById('beats');
const bestDisplay = document.getElementById('best');
const message = document.getElementById('message');
const startButton = document.getElementById('start');

let pulses = 0;
let bestScore = localStorage.getItem('bestScore') || 0;
bestDisplay.textContent = bestScore;
let speed = 2;
let directionX = 1;
let directionY = 1;
let x, y;
let brightness = 1;
let fade = 1;
let mover;

pulse.addEventListener('click', () => {
  pulses++;
  pulsesDisplay.textContent = pulses;
  speed += 0.2;
  brightness = Math.min(2, brightness + 0.1);
  fade = Math.min(1, fade + 0.3);
  pulse.style.transform = `scale(${brightness})`;
  directionX = (Math.random() - 0.5) * 2;
  directionY = (Math.random() - 0.5) * 2;

  if (pulses === 10) {
    pulse.classList.add('medium');
  } else if (pulses === 30) {
    pulse.classList.remove('medium');
    pulse.classList.add('oval');
  } else if (pulses === 50) {
    pulse.classList.remove('oval');
    pulse.classList.add('dynamic');
  }
});

pulse.addEventListener('touchstart', (e) => {
  e.preventDefault(); // Prevent scrolling
  pulses++;
  pulsesDisplay.textContent = pulses;
  speed += 0.2;
  brightness = Math.min(2, brightness + 0.1);
  fade = Math.min(1, fade + 0.3);
  pulse.style.transform = `scale(${brightness})`;
  directionX = (Math.random() - 0.5) * 2;
  directionY = (Math.random() - 0.5) * 2;

  if (pulses === 10) {
    pulse.classList.add('medium');
  } else if (pulses === 30) {
    pulse.classList.remove('medium');
    pulse.classList.add('oval');
  } else if (pulses === 50) {
    pulse.classList.remove('oval');
    pulse.classList.add('dynamic');
  }
});

function startGame() {
  welcome.style.display = 'none';
  game.style.display = 'flex';
  
  pulses = 0;
  pulsesDisplay.textContent = pulses;
  speed = 2;
  brightness = 1;
  fade = 1;
  x = 50; // Percentage-based starting position
  y = 50;
  
  pulse.style.left = `${x}%`;
  pulse.style.top = `${y}%`;
  pulse.style.opacity = fade;
  pulse.style.transform = `scale(${brightness})`;
  pulse.style.display = 'block';
  pulse.classList.remove('medium', 'oval', 'dynamic');

  message.style.opacity = 0;
  message.textContent = '';
  if (mover) clearInterval(mover);

  mover = setInterval(movePulse, 20);
}

function movePulse() {
  const gameWidth = game.offsetWidth;
  const gameHeight = game.offsetHeight;
  const pulseSize = pulse.offsetWidth;

  x += directionX * speed * (gameWidth / 100); // Scale movement to viewport
  y += directionY * speed * (gameHeight / 100);

  // Keep pulse within bounds (5% padding)
  if (x <= 5) x = 5;
  if (x >= 95 - (pulseSize / gameWidth * 100)) x = 95 - (pulseSize / gameWidth * 100);
  if (y <= 15) y = 15; // Account for .beats
  if (y >= 85 - (pulseSize / gameHeight * 100)) y = 85 - (pulseSize / gameHeight * 100);

  pulse.style.left = `${x}%`;
  pulse.style.top = `${y}%`;

  fade -= 0.005;
  pulse.style.opacity = fade;
  if (fade <= 0) gameOver();
}

function gameOver() {
  clearInterval(mover);
  pulse.style.display = 'none';
  message.textContent = 'Even the smallest light fights to shine.';
  message.style.opacity = 1;

  if (pulses > bestScore) {
    bestScore = pulses;
    bestDisplay.textContent = bestScore;
    localStorage.setItem('bestScore', bestScore);
  }

  const gameOverText = document.createElement('p');
  gameOverText.textContent = 'Game Over';
  gameOverText.className = 'text';
  gameOverText.style.position = 'absolute';
  gameOverText.style.top = '40%';
  gameOverText.style.left = '50%';
  gameOverText.style.transform = 'translateX(-50%)';
  game.appendChild(gameOverText);

  const restartButton = document.createElement('button');
  restartButton.id = 'restart';
  restartButton.textContent = 'Start Again';
  restartButton.style.position = 'absolute';
  restartButton.style.top = '60%';
  restartButton.style.left = '50%';
  restartButton.style.transform = 'translateX(-50%)';
  game.appendChild(restartButton);

  const shareX = document.createElement('button');
  shareX.id = 'share-x';
  shareX.textContent = 'X';
  shareX.style.position = 'absolute';
  shareX.style.top = '75%';
  shareX.style.left = '45%';
  shareX.style.transform = 'translateX(-50%)';
  game.appendChild(shareX);

  const shareFacebook = document.createElement('button');
  shareFacebook.id = 'share-facebook';
  shareFacebook.textContent = 'Facebook';
  shareFacebook.style.position = 'absolute';
  shareFacebook.style.top = '75%';
  shareFacebook.style.left = '55%';
  shareFacebook.style.transform = 'translateX(-50%)';
  game.appendChild(shareFacebook);

  restartButton.addEventListener('click', () => {
    game.removeChild(gameOverText);
    game.removeChild(restartButton);
    game.removeChild(shareX);
    game.removeChild(shareFacebook);
    game.style.display = 'none';
    welcome.style.display = 'flex';
  });

  shareX.addEventListener('click', () => {
    const shareText = `I sustained the Pulse of Light for ${pulses} pulses! Can you keep the spark alive? Try it: ${window.location.href} #PulseOfLight`;
    const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(xUrl, '_blank');
  });

  shareFacebook.addEventListener('click', () => {
    const shareText = `I sustained the Pulse of Light for ${pulses} pulses! Can you keep the spark alive? Try it: ${window.location.href} #PulseOfLight`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
    window.open(facebookUrl, '_blank');
  });
}

startButton.addEventListener('click', startGame);