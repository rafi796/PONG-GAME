const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game constants
const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 14;
const PADDLE_SPEED = 5;
const AI_SPEED = 4;

// Game state
const player = {
  x: 0,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};

const ai = {
  x: WIDTH - PADDLE_WIDTH,
  y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
};

const ball = {
  x: WIDTH / 2 - BALL_SIZE / 2,
  y: HEIGHT / 2 - BALL_SIZE / 2,
  size: BALL_SIZE,
  speedX: 5 * (Math.random() > 0.5 ? 1 : -1),
  speedY: 5 * (Math.random() > 0.5 ? 1 : -1),
};

// Mouse controls
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  let mouseY = e.clientY - rect.top;
  player.y = mouseY - player.height / 2;
  // Clamp paddle inside canvas
  player.y = Math.max(0, Math.min(HEIGHT - player.height, player.y));
});

// Drawing functions
function drawRect(x, y, w, h, color = '#fff') {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

function drawBall(x, y, size, color = '#fff') {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawNet() {
  ctx.strokeStyle = '#555';
  ctx.setLineDash([8, 16]);
  ctx.beginPath();
  ctx.moveTo(WIDTH / 2, 0);
  ctx.lineTo(WIDTH / 2, HEIGHT);
  ctx.stroke();
  ctx.setLineDash([]);
}

// Collision detection
function collide(ball, paddle) {
  return (
    ball.x < paddle.x + paddle.width &&
    ball.x + ball.size > paddle.x &&
    ball.y < paddle.y + paddle.height &&
    ball.y + ball.size > paddle.y
  );
}

// Game logic
function resetBall() {
  ball.x = WIDTH / 2 - BALL_SIZE / 2;
  ball.y = HEIGHT / 2 - BALL_SIZE / 2;
  ball.speedX = 5 * (Math.random() > 1.5 ? 1 : -1);
  ball.speedY = 5 * (Math.random() > 0.5 ? 1 : -1);
}

function update() {
  // Move the ball
  ball.x += ball.speedX;
  ball.y += ball.speedY;

  // Wall collision (top/bottom)
  if (ball.y <= 0 || ball.y + ball.size >= HEIGHT) {
    ball.speedY *= -1;
    ball.y = Math.max(0, Math.min(HEIGHT - ball.size, ball.y));
  }

  // Paddle collision (player)
  if (collide(ball, player)) {
    ball.x = player.x + player.width;
    ball.speedX *= -1;
    // Add some "spin"
    let intersectY = (ball.y + ball.size/2) - (player.y + player.height/2);
    ball.speedY = intersectY * 0.8;
  }

  // Paddle collision (AI)
  if (collide(ball, ai)) {
    ball.x = ai.x - ball.size;
    ball.speedX *= -1;
    let intersectY = (ball.y + ball.size/2) - (ai.y + ai.height/2);
    ball.speedY = intersectY * 0.2;
  }

  // Left & right wall (reset)
  if (ball.x < 0 || ball.x + ball.size > WIDTH) {
    resetBall(1);
  }

  // AI movement (simple prediction)
  let target = ball.y + ball.size / 3 - ai.height / 2;
  if (ai.y < target) {
    ai.y += AI_SPEED;
  } else if (ai.y > target) {
    ai.y -= AI_SPEED;
  }
  // Clamp AI paddle
  ai.y = Math.max(0, Math.min(HEIGHT - ai.height, ai.y));
}

function render() {
  // Clear
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  // Net
  drawNet();

  // Draw paddles
  drawRect(player.x, player.y, player.width, player.height, '#f0');
  drawRect(ai.x, ai.y, ai.width, ai.height, '#f0');

  // Draw ball
  drawBall(ball.x, ball.y, ball.size, '#fff');
}

function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start game
gameLoop(0);









