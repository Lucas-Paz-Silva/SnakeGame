// Configuração do canvas e do contexto de desenho
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const GRID_SIZE = 20; // Tamanho de cada célula
const GRID_COUNT = canvas.width / GRID_SIZE; // Quantidade de células no grid

// Variáveis do jogo
let snake = [{ x: 10, y: 10 }]; // Posição inicial da cobra
let food = generateFood(); // Geração inicial da comida
let direction = 'right'; // Direção inicial da cobra
let score = 0; // Pontuação do jogador
let gameLoop; // Referência ao loop do jogo
let speed = 100; // Velocidade inicial do jogo
let countdownTimer; // Timer para o contador de início
let bestScore = localStorage.getItem('bestScore') || 0; // Melhor pontuação salva no localStorage
let countdown; // Tempo do countdown (3 segundos)

// Exibe a melhor pontuação na tela
document.getElementById('record').textContent = `Recorde: ${bestScore}`;

// Evento para capturar as teclas pressionadas e mudar a direção
document.addEventListener('keydown', changeDirection);

// Atualiza a velocidade conforme o controle deslizante
document.getElementById('speed').addEventListener('input', function(event) {
    const speedLevel = parseInt(event.target.value); // Valor do controle de velocidade
    speed = Math.max(50, 200 - speedLevel * 20); // Aumenta a velocidade com base na posição do controle
    document.getElementById('speedValue').textContent = speedLevel; // Atualiza o valor da velocidade
});

// Função para iniciar o jogo
function startGame() {
    document.getElementById('gameOver').style.display = 'none'; // Esconde o texto de "Game Over"
    document.getElementById('startButton').style.display = 'none'; // Esconde o botão de "Iniciar"
    document.getElementById('tryAgainButton').style.display = 'none'; // Esconde o botão de "Tentar Novamente"

    // Reseta o jogo
    if (gameLoop) clearInterval(gameLoop); // Limpa o loop de jogo anterior
    snake = [{ x: 10, y: 10 }]; // Reinicia a cobra
    direction = 'right'; // Reinicia a direção
    score = 0; // Reseta a pontuação
    document.getElementById('score').textContent = `Pontuação: ${score}`; // Atualiza a pontuação

    // Inicia o countdown de 3 segundos
    countdown = 3;
    countdownTimer = setInterval(function() {
        countdown--; // Decrementa o tempo do countdown
        renderCountdown(countdown); // Atualiza o contador na tela

        if (countdown === 0) {
            clearInterval(countdownTimer); // Limpa o timer de countdown
            gameLoop = setInterval(update, speed); // Inicia o loop do jogo
        }
    }, 1000);
}

// Função para renderizar o countdown no canvas
function renderCountdown(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    draw(); // Redesenha a cobra e a comida
    ctx.fillStyle = "#ecf0f1"; // Cor do texto do countdown
    ctx.font = "48px Arial"; // Fonte
    ctx.textAlign = "center"; // Alinha o texto ao centro
    ctx.fillText(time, canvas.width / 2, canvas.height / 2); // Exibe o tempo no centro do canvas
}

// Função para gerar a comida
function generateFood() {
    while (true) {
        const newFood = {
            x: Math.floor(Math.random() * GRID_COUNT),
            y: Math.floor(Math.random() * GRID_COUNT)
        };

        // Garante que a comida não apareça sobre a cobra
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            return newFood;
        }
    }
}

// Função para mudar a direção da cobra
function changeDirection(event) {
    const key = event.key;
    const directions = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };

    const newDirection = directions[key];
    const oppositeDirections = {
        up: 'down',
        down: 'up',
        left: 'right',
        right: 'left'
    };

    if (newDirection && newDirection !== oppositeDirections[direction]) {
        direction = newDirection;
    }
}

// Função que atualiza o estado do jogo a cada intervalo
function update() {
    // Movimento da cabeça da cobra
    const head = { ...snake[0] };
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Verificação de colisões
    if (head.x < 0 || head.x >= GRID_COUNT || head.y < 0 || head.y >= GRID_COUNT ||
        snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        gameOver();
        return;
    }

    snake.unshift(head); // Adiciona a nova cabeça da cobra

    // Verifica se a cobra comeu a comida
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        document.getElementById('score').textContent = `Pontuação: ${score}`;
        food = generateFood(); // Gera nova comida
        if (score > bestScore) { // Atualiza o recorde
            bestScore = score;
            localStorage.setItem('bestScore', bestScore);
        }
        draw(); // Redesenha
    } else {
        snake.pop(); // Remove a cauda se não comeu
    }

    draw(); // Desenha os elementos do jogo
}

// Função que desenha a cobra e a comida
function draw() {
    ctx.fillStyle = '#34495e'; // Cor de fundo do jogo
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Preenche o fundo

    // Desenha a cobra com estilo personalizado
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#1abc9c' : '#2ecc71'; // Cobra com gradiente de verde
        ctx.fillRect(
            segment.x * GRID_SIZE,
            segment.y * GRID_SIZE,
            GRID_SIZE - 1,
            GRID_SIZE - 1
        );
    });

    // Desenha a comida com estilo personalizado (círculo)
    ctx.fillStyle = '#e74c3c'; // Cor vermelha para a comida
    ctx.beginPath();
    ctx.arc(
        food.x * GRID_SIZE + GRID_SIZE / 2,
        food.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2,
        0,
        2 * Math.PI
    );
    ctx.fill(); // Preenche a comida com a cor
}

// Função de Game Over
function gameOver() {
    clearInterval(gameLoop); // Para o loop do jogo
    document.getElementById('gameOver').style.display = 'block'; // Exibe o Game Over
    document.getElementById('tryAgainButton').style.display = 'block'; // Exibe o botão de tentar novamente
    document.getElementById('startButton').style.display = 'none'; // Esconde o botão de iniciar
}
