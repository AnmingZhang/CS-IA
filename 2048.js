const rows = 4;
const cols = 4;
let board = [];
let score = 0;
let gameOver = false;

const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');

function initializeBoard() {
    hideGameOverScreen();
    score = 0;
    gameOver = false;
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    generateTile();
    generateTile();
    updateGrid();
}

function generateTile() {
    let emptyCells = [];
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] === 0) emptyCells.push({ x, y });
        }
    }
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[x][y] = Math.random() < 0.75 ? 2 : 4;
    }
}

function updateGrid() {
    gridElement.innerHTML = '';
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            const cellValue = board[x][y];
            const cell = document.createElement('div');
            cell.className = 'cell';
            if (cellValue) {
                cell.dataset.value = cellValue;
                cell.textContent = cellValue;
            }
            gridElement.appendChild(cell);
        }
    }
    scoreElement.textContent = `Score: ${score}`;
}

function slide(row) {
    row = row.filter(val => val);
    for (let i = 0; i < row.length - 1; i++) {
        if (row[i] === row[i + 1]) {
            row[i] *= 2;
            score += row[i];
            row[i + 1] = 0;
        }
    }
    row = row.filter(val => val);
    while (row.length < cols) row.push(0);
    return row;
}

function rotateClockwise(board) {
    return board[0].map((_, index) => board.map(row => row[index]).reverse());
}

function rotateCounterClockwise(board) {
    return board[0].map((_, index) => board.map(row => row[row.length - 1 - index]));
}

function moveLeft() {
    board = board.map(row => slide(row));
}

function moveRight() {
    board = board.map(row => slide(row.reverse()).reverse());
}

function moveUp() {
    board = rotateClockwise(board);
    moveRight();
    board = rotateCounterClockwise(board);
}

function moveDown() {
    board = rotateClockwise(board);
    moveLeft();
    board = rotateCounterClockwise(board);
}

function checkGameStatus() {
    if (board.flat().includes(16)) {
        gameOver = true;
        showGameOverScreen(true);
    }
    if (!board.flat().includes(0)) {
        if (!canMove()) {
            gameOver = true;
            showGameOverScreen(false);
        }
    }
}

function canMove() {
    // Check for any empty cells
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] === 0) {
                return true;
            }
        }
    }

    // Check for any horizontal or vertical mergeable tiles
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if ((x < rows - 1 && board[x][y] === board[x + 1][y]) || 
                (y < cols - 1 && board[x][y] === board[x][y + 1])) {
                return true;
            }
        }
    }
    return false;
}

function compareArrays(a, b) {
    for (let x = 0; x < a.length; x++) {
        for (let y = 0; y < a[x].length; y++) {
            if (a[x][y] != b[x][y]) {
                return false;
            }
        }
    }
    return true;
}

document.addEventListener('keydown', e => {
    if (gameOver) return;

    temp = board.map(row => row.slice());
    switch (e.key) {
        case 'ArrowLeft':
            moveLeft();
            break;
        case 'ArrowRight':
            moveRight();
            break;
        case 'ArrowUp':
            moveUp();
            break;
        case 'ArrowDown':
            moveDown();
            break;
        default:
            return;
    }

    if (compareArrays(board, temp)) {
        return;
    }
    updateGrid();
    setTimeout(() => {
        generateTile();
        updateGrid(); 
        checkGameStatus(); 
    }, 100);
    document.getElementById("play-again-button").addEventListener("click", () => initializeBoard());
});

function showGameOverScreen(won) {
    const gameOverScreen = document.getElementById("game-over-screen");
    const gameOverMessage = document.getElementById("game-over-message");

    gameOverMessage.textContent = won ? `You Won! Score: ${score}` : "Game Over!";
    gameOverScreen.style.display = "flex";
    if (won) {
        endGame2048(score);
    }
}

function hideGameOverScreen() {
    const gameOverScreen = document.getElementById("game-over-screen");
    gameOverScreen.style.display = "none";
}

function endGame2048(finalScore) {
    updateScore('2048', finalScore); 
}

initializeBoard();

window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = ''; 
});