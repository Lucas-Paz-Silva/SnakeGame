const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = "right";
let food = generateFood();
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameSpeed = 200;
let gameInterval;
let gameRunning = false;

document.getElementById("highScore").innerText = `Recorde: ${highScore}`;

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("retryButton").addEventListener("click", startGame);
    document.getElementById("speed").addEventListener("input", adjustSpeed);

    document.querySelectorAll(".control-button").forEach(button => {
        button.addEventListener("click", handleControl);
        button.addEventListener("touchstart", handleControl, { passive: true });
    });

    document.addEventListener("keydown", handleKeyPress);
});

function handleControl(event) {
    const direction = event.target.getAttribute("data-direction");
    changeDirection(direction);
}

function startGame() {
    if (gameRunning) return;

    gameRunning = true;
    snake = [{ x: 200, y: 200 }];
    direction = "right";
    food = generateFood();
    score = 0;
    document.getElementById("score").innerText = `Pontuação: ${score}`;
    document.getElementById("startButton").classList.add("hidden");
    document.getElementById("retryButton").classList.add("hidden");

    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, gameSpeed);
}

function adjustSpeed() {
    const speedValue = document.getElementById("speed").value;
    gameSpeed = 400 - (speedValue * 35);
    if (gameRunning) {
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, gameSpeed);
    }
}

function handleKeyPress(event) {
    switch (event.key) {
        case "ArrowUp": changeDirection("up"); break;
        case "ArrowDown": changeDirection("down"); break;
        case "ArrowLeft": changeDirection("left"); break;
        case "ArrowRight": changeDirection("right"); break;
    }
}

function changeDirection(newDirection) {
    const oppositeDirections = {
        up: "down",
        down: "up",
        left: "right",
        right: "left"
    };

    if (newDirection !== oppositeDirections[direction]) {
        direction = newDirection;
    }
}

function updateGame() {
    let head = { ...snake[0] };

    switch (direction) {
        case "up": head.y -= 20; break;
        case "down": head.y += 20; break;
        case "left": head.x -= 20; break;
        case "right": head.x += 20; break;
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || checkCollision(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("score").innerText = `Pontuação: ${score}`;
        food = generateFood();

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = `Recorde: ${highScore}`;
        }
    } else {
        snake.pop();
    }

    drawGame();
}

function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    document.getElementById("retryButton").classList.remove("hidden");
}

function generateFood() {
    let foodX, foodY;
    do {
        foodX = Math.floor(Math.random() * (canvas.width / 20)) * 20;
        foodY = Math.floor(Math.random() * (canvas.height / 20)) * 20;
    } while (snake.some(segment => segment.x === foodX && segment.y === foodY));

    return { x: foodX, y: foodY };
}

function checkCollision(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);

    ctx.fillStyle = "lime";
    snake.forEach(segment => {
        ctx.fillRect(segment.x, segment.y, 20, 20);
    });
}
