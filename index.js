const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const GRID_SIZE = 20;
        const GRID_COUNT = canvas.width / GRID_SIZE;
        let snake, food, direction, gameLoop, score, highScore = 0, speed;

        function startGame() {
            document.getElementById('startButton').classList.add('hidden');
            document.getElementById('retryButton').classList.add('hidden');
            snake = [{ x: 10, y: 10 }];
            food = { x: Math.floor(Math.random() * GRID_COUNT), y: Math.floor(Math.random() * GRID_COUNT) };
            direction = 'right';
            score = 0;
            speed = parseInt(document.getElementById('speed').value);
            document.getElementById('score').innerText = `Pontuação: ${score}`;
            gameLoop = setInterval(update, speed);
        }

        function adjustSpeed() {
            clearInterval(gameLoop);
            speed = parseInt(document.getElementById('speed').value);
            gameLoop = setInterval(update, speed);
        }

        function changeDirection(newDirection) {
            const opposite = { up: 'down', down: 'up', left: 'right', right: 'left' };
            if (newDirection !== opposite[direction]) {
                direction = newDirection;
            }
        }

        function update() {
            const head = { ...snake[0] };
            if (direction === 'up') head.y--;
            if (direction === 'down') head.y++;
            if (direction === 'left') head.x--;
            if (direction === 'right') head.x++;
            
            if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT ||
                snake.some(segment => segment.x === head.x && segment.y === head.y)) {
                clearInterval(gameLoop);
                document.getElementById('retryButton').classList.remove('hidden');
                alert("Game Over!");
                return;
            }

            snake.unshift(head);
            if (head.x === food.x && head.y === food.y) {
                score++;
                document.getElementById('score').innerText = `Pontuação: ${score}`;
                if (score > highScore) {
                    highScore = score;
                    document.getElementById('highScore').innerText = `Recorde: ${highScore}`;
                }
                food = { x: Math.floor(Math.random() * GRID_COUNT), y: Math.floor(Math.random() * GRID_COUNT) };
                clearInterval(gameLoop);
                speed = Math.max(50, speed - 5);
                gameLoop = setInterval(update, speed);
            } else {
                snake.pop();
            }
            draw();
        }

        function draw() {
            ctx.fillStyle = '#34495e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? '#1abc9c' : '#2ecc71';
                ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
            });

            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(food.x * GRID_SIZE, food.y * GRID_SIZE, GRID_SIZE - 1, GRID_SIZE - 1);
        }

        document.addEventListener('keydown', event => {
            const keyMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
            if (keyMap[event.key]) changeDirection(keyMap[event.key]);
        });
