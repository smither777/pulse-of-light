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

function startGame() {
  welcome.style.display = 'none';
  game.style.display = 'block';
  
  pulses = 0;
  pulsesDisplay.textContent = pulses;
  speed = 2;
  brightness = 1;
  fade = 1;
  x = game.offsetWidth / 2 - pulse.offsetWidth / 2;
  y = game.offsetHeight / 2 - pulse.offsetHeight / 2;
  
  pulse.style.left = `${x}px`;
  pulse.style.top = `${y}px`;
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

  x += directionX * speed;
  y += directionY * speed;

  if (x <= 0 || x >= gameWidth - pulseSize) directionX *= -1;
  if (y <= 0 || y >= gameHeight - pulseSize) directionY *= -1;

  pulse.style.left = `${x}px`;
  pulse.style.top = `${y}px`;

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
  gameOverText.style.top = '40%';
  gameOverText.style.transform = 'translateY(-50%)';
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
  shareX.style.left = '45%'; // Closer to center
  shareX.style.transform = 'translateX(-50%)';
  game.appendChild(shareX);

  const shareFacebook = document.createElement('button');
  shareFacebook.id = 'share-facebook';
  shareFacebook.textContent = 'Facebook';
  shareFacebook.style.position = 'absolute';
  shareFacebook.style.top = '75%';
  shareFacebook.style.left = '55%'; // Closer to center
  shareFacebook.style.transform = 'translateX(-50%)';
  game.appendChild(shareFacebook);

  restartButton.addEventListener('click', () => {
    game.removeChild(gameOverText);
    game.removeChild(restartButton);
    game.removeChild(shareX);
    game.removeChild(shareFacebook);
    game.style.display = 'none';
    welcome.style.display = 'block';
  });

  const shareText = `I sustained the Pulse of Light for ${pulses} pulses! Can you keep the spark alive? Try it: [Your Game URL] #PulseOfLight`;
  const encodedText = encodeURIComponent(shareText);

  shareX.addEventListener('click', () => {
    const xUrl = `https://twitter.com/intent/tweet?text=${encodedText}`;
    window.open(xUrl, '_blank');
  });

  shareFacebook.addEventListener('click', () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=[Your Game URL]&quote=${encodedText}`; // Fixed syntax
    window.open(facebookUrl, '_blank');
  });
}

startButton.addEventListener('click', startGame);