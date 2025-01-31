const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 400;

const box = 20;
let snake = [{ x: 10 * box, y: 10 * box }];
let direction = "RIGHT";
let food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let speed = 200;

document.getElementById("highScore").innerText = "Recorde: " + highScore;

function draw() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "green" : "lime";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    let newX = snake[0].x;
    let newY = snake[0].y;

    if (direction === "LEFT") newX -= box;
    if (direction === "RIGHT") newX += box;
    if (direction === "UP") newY -= box;
    if (direction === "DOWN") newY += box;

    if (newX === food.x && newY === food.y) {
        score++;
        document.getElementById("score").innerText = "Pontuação: " + score;
        food = { x: Math.floor(Math.random() * 20) * box, y: Math.floor(Math.random() * 20) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: newX, y: newY };

    if (collision(newHead, snake) || newX < 0 || newY < 0 || newX >= canvas.width || newY >= canvas.height) {
        clearInterval(gameInterval);
        document.getElementById("retryButton").classList.remove("hidden");
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = "Recorde: " + highScore;
        }
        return;
    }

    snake.unshift(newHead);
}

function collision(head, body) {
    for (let i = 0; i < body.length; i++) {
        if (head.x === body[i].x && head.y === body[i].y) {
            return true;
        }
    }
    return false;
}

function startGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0;
    document.getElementById("score").innerText = "Pontuação: 0";
    document.getElementById("retryButton").classList.add("hidden");
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
}

function adjustSpeed() {
    let speedValue = document.getElementById("speed").value;
    speed = 300 - (speedValue * 25);
    clearInterval(gameInterval);
    gameInterval = setInterval(draw, speed);
}

function changeDirection(newDirection) {
    if (newDirection === "LEFT" && direction !== "RIGHT") direction = "LEFT";
    if (newDirection === "RIGHT" && direction !== "LEFT") direction = "RIGHT";
    if (newDirection === "UP" && direction !== "DOWN") direction = "UP";
    if (newDirection === "DOWN" && direction !== "UP") direction = "DOWN";
}

document.addEventListener("keydown", event => {
    if (event.key === "ArrowLeft") changeDirection("LEFT");
    if (event.key === "ArrowRight") changeDirection("RIGHT");
    if (event.key === "ArrowUp") changeDirection("UP");
    if (event.key === "ArrowDown") changeDirection("DOWN");
});
