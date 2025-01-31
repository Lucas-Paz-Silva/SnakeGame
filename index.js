document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("retryButton").addEventListener("click", startGame);
    document.getElementById("speed").addEventListener("input", adjustSpeed);

    // Eventos de toque para os controles móveis
    document.querySelectorAll(".control-button").forEach(button => {
        button.addEventListener("touchstart", (event) => {
            const direction = event.target.getAttribute("data-direction");
            changeDirection(direction);
        });
    });
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = "right";
let food = generateFood();
let gameInterval;
let speed = 200; // Velocidade inicial

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "right";
    food = generateFood();
    document.getElementById("retryButton").classList.add("hidden");
    document.getElementById("startButton").classList.add("hidden");

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
}

function updateGame() {
    moveSnake();
    if (checkCollision()) {
        clearInterval(gameInterval);
        document.getElementById("retryButton").classList.remove("hidden");
        return;
    }
    drawGame();
}

function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case "up": head.y -= 20; break;
        case "down": head.y += 20; break;
        case "left": head.x -= 20; break;
        case "right": head.x += 20; break;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
    } else {
        snake.pop();
    }
}

function drawGame() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);

    ctx.fillStyle = "green";
    snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
}

function generateFood() {
    return {
        x: Math.floor(Math.random() * 20) * 20,
        y: Math.floor(Math.random() * 20) * 20
    };
}

function checkCollision() {
    let head = snake[0];
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
        return true;
    }
    return snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
}

function changeDirection(newDirection) {
    if ((newDirection === "up" && direction !== "down") ||
        (newDirection === "down" && direction !== "up") ||
        (newDirection === "left" && direction !== "right") ||
        (newDirection === "right" && direction !== "left")) {
        direction = newDirection;
    }
}

function adjustSpeed() {
    let speedValue = document.getElementById("speed").value;
    speed = 300 - (speedValue * 30); // Ajustando escala de 1 a 10
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = setInterval(updateGame, speed);
    }
}
