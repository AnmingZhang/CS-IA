const difficultySettings = {
    easy: {size: 10, mines: 12, cellSize: 640 / 10},
    medium: {size: 16, mines: 40, cellSize: 640 / 16},
    hard: {size: 20, mines: 80, cellSize: 640 / 20}
};

let difficulty = "easy";
let {size, mines, cellSize} = difficultySettings[difficulty];
let flags = mines;
let visited = Array.from({length: size}, () => Array(size).fill(false));
let flagged = Array.from({length: size}, () => Array(size).fill(false));
let board = Array.from({length: size}, () => Array(size).fill(0));
let gridSize = {width: cellSize * size, height: cellSize * size};
let firstClick = true;
let startTime = Date.now();
let timerInterval;

document.addEventListener("DOMContentLoaded", () => {
    startNewGameWithDifficulty("easy");

    document.getElementById("easy-button").addEventListener("click", () => startNewGameWithDifficulty("easy"));
    document.getElementById("medium-button").addEventListener("click", () => startNewGameWithDifficulty("medium"));
    document.getElementById("hard-button").addEventListener("click", () => startNewGameWithDifficulty("hard"));
    document.getElementById("play-again-button").addEventListener("click", () => startNewGameWithDifficulty(difficulty));
});

function setDifficulty(newDifficulty) {
    ({size, mines, cellSize} = difficultySettings[newDifficulty]);
    flags = mines;
    visited = Array.from({length: size}, () => Array(size).fill(false));
    flagged = Array.from({length: size}, () => Array(size).fill(false));
    board = Array.from({length: size}, () => Array(size).fill(0));
    gridSize = {width: cellSize * size, height: cellSize * size};
    firstClick = true;
    startTime = Date.now();
    updateFlagsRemaining();

    const gameContainer = document.getElementById("game-container");
    gameContainer.style.setProperty("--grid-size", size);
    gameContainer.style.setProperty("--cell-size", `${cellSize}px`);
}

function startNewGameWithDifficulty(difficulty) {
    setDifficulty(difficulty); 
    drawBoard(document.getElementById("game-container"));
    hideGameOverScreen(); 
    startTimer();
}

function generateMines(click) {
    const safeZone = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const nx = click[0] + i;
            const ny = click[1] + j;
            if (nx >= 0 && ny >= 0 && nx < size && ny < size) {
                safeZone.push([nx, ny]);
            }
        }
    }

    let minesToPlace = mines;
    while (minesToPlace > 0) {
        const r1 = Math.floor(Math.random() * size);
        const r2 = Math.floor(Math.random() * size);
        if (!safeZone.some(([x, y]) => x === r1 && y === r2) && board[r1][r2] === 0) {
            board[r1][r2] = -1;
            minesToPlace--;
        }
    }

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j] === -1) continue;
            let count = 0;
            for (let x = Math.max(0, i - 1); x < Math.min(size, i + 2); x++) {
                for (let y = Math.max(0, j - 1); y < Math.min(size, j + 2); y++) {
                    if (board[x][y] === -1) {
                        count++;
                    }
                }
            }
            board[i][j] = count;
        }
    }
}

function createBoard(click) {
    board = Array.from({length: size}, () => Array(size).fill(0));
    generateMines(click);
    return board;
}

function floodFill(x, y) {
    if (x < 0 || y < 0 || x >= size || y >= size || visited[x][y]) {
        return;
    }

    visited[x][y] = true;

    if (board[x][y] !== 0) {
        return;
    }

    for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
            if (dx !== 0 || dy !== 0) {
                floodFill(x + dx, y + dy);
            }
        }
    }
}

function leftClick(x, y) {
    if (firstClick) {
        createBoard([x, y]); 
        firstClick = false;
    }

    if (board[x][y] === -1) {
        revealMines();
        visited[x][y] = true
        drawBoard(document.getElementById("game-container"));
        showGameOverScreen(false);
    } else {
        floodFill(x, y);
        drawBoard(document.getElementById("game-container"));
    }

    if (visited.flat().filter(Boolean).length === size * size - mines) {
        revealSafe();
        showGameOverScreen(true);
    }
}

function rightClick(x, y) {
    if (!visited[x][y]) {
        flagged[x][y] = !flagged[x][y];
        flags += flagged[x][y] ? -1 : 1;
        updateFlagsRemaining();
        drawBoard(document.getElementById("game-container"));
    }
}

function drawBoard(container) {
    container.innerHTML = "";  

    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;

            if (visited[x][y]) {
                cell.classList.add("revealed");
                if (board[x][y] > 0) {
                    cell.textContent = board[x][y];
                } else if (board[x][y] === -1) {
                    cell.classList.remove("revealed");
                    cell.classList.add("mine");
                    cell.textContent = "💣";
                }
            } else if (flagged[x][y]) {
                cell.textContent = "🚩";
            }

            cell.addEventListener("click", () => leftClick(x, y));
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                rightClick(x, y);
            });

            container.appendChild(cell);
        }
    }
}

function revealMines() {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] === -1) {
                visited[x][y] = true;
            }
        }
    }
}

function revealSafe() {
    for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
            if (board[x][y] !== -1) {
                const cell = document.querySelector(`#game-container .cell:nth-child(${x * board.length + y + 1})`);
                if (cell) {
                    cell.classList.add("safe"); 
                    cell.textContent = "";
                }
            }
        }
    }
}

function updateFlagsRemaining() {
    const flagsRemainingElement = document.getElementById("flags-remaining");
    flagsRemainingElement.textContent = `🚩: ${flags}`;
}

function showGameOverScreen(won) {
    stopTimer();
    const gameOverScreen = document.getElementById("game-over-screen");
    const gameOverMessage = document.getElementById("game-over-message");

    gameOverMessage.textContent = won ? `You Won! Time: ${document.getElementById("timer").textContent.split(' ')[1]}` : "Game Over!";
    score = document.getElementById("timer").textContent.split(' ')[1];
    if (won) {
        endGameMinesweeper(score);
    }
    gameOverScreen.style.display = "flex";
}

function hideGameOverScreen() {
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "none";
}

function startTimer() {
    startTime = Date.now(); 

    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        document.getElementById("timer").textContent = `⏰: ${formatTime(elapsedTime)}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);  
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secondsLeft = seconds % 60;
    return `${minutes}:${secondsLeft.toString().padStart(2, '0')}`; 
}

function endGameMinesweeper(timeTaken) {
    updateScore('minesweeper', timeTaken); 
}

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = ''; 
});