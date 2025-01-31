const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = "right";
let food = { x: 100, y: 100 };
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameInterval;
let speed = 200 - (document.getElementById("speed").value * 20);

document.getElementById("highScore").innerText = `Recorde: ${highScore}`;

function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = "right";
    score = 0;
    document.getElementById("score").innerText = "Pontuação: 0";
    document.getElementById("startButton").classList.add("hidden");
    document.getElementById("retryButton").classList.add("hidden");
    
    placeFood();
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
}

function updateGame() {
    let head = { ...snake[0] };

    switch (direction) {
        case "up":
            head.y -= 20;
            break;
        case "down":
            head.y += 20;
            break;
        case "left":
            head.x -= 20;
            break;
        case "right":
            head.x += 20;
            break;
    }

    if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height || isColliding(head)) {
        gameOver();
        return;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById("score").innerText = `Pontuação: ${score}`;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            document.getElementById("highScore").innerText = `Recorde: ${highScore}`;
        }
        placeFood();
    } else {
        snake.pop();
    }

    drawGame();
}

function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, 20, 20);

    ctx.fillStyle = "green";
    snake.forEach((segment) => ctx.fillRect(segment.x, segment.y, 20, 20));
}

function placeFood() {
    food = {
        x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
        y: Math.floor(Math.random() * (canvas.height / 20)) * 20,
    };
}

function isColliding(head) {
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

function gameOver() {
    clearInterval(gameInterval);
    document.getElementById("retryButton").classList.remove("hidden");
}

function changeDirection(newDirection) {
    if (
        (newDirection === "up" && direction !== "down") ||
        (newDirection === "down" && direction !== "up") ||
        (newDirection === "left" && direction !== "right") ||
        (newDirection === "right" && direction !== "left")
    ) {
        direction = newDirection;
    }
}

function adjustSpeed() {
    speed = 200 - (document.getElementById("speed").value * 20);
    clearInterval(gameInterval);
    gameInterval = setInterval(updateGame, speed);
}

document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") changeDirection("up");
    if (event.key === "ArrowDown") changeDirection("down");
    if (event.key === "ArrowLeft") changeDirection("left");
    if (event.key === "ArrowRight") changeDirection("right");
});

function handleTouchStart(event, direction) {
    event.preventDefault();
    changeDirection(direction);
}
