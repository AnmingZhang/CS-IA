const rows = 4;
const cols = 4;
let board = [];
let score = 0;
let gameOver = false;

const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');

//initialize variables
function initializeBoard() {
    hideGameOverScreen();
    score = 0;
    gameOver = false;
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    generateTile();
    generateTile();
    updateGrid();
}

//randomly generate tiles
function generateTile() {
    //check for empty tiles
    let emptyCells = [];
    for (let x = 0; x < rows; x++) {
        for (let y = 0; y < cols; y++) {
            if (board[x][y] === 0) emptyCells.push({ x, y });
        }
    }
    //generate tile at random index with a random value
    if (emptyCells.length > 0) {
        const { x, y } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        //randomly generate 2 (75%) or 4 (25%)
        board[x][y] = Math.random() < 0.75 ? 2 : 4;
    }
}

//display the numbers in the grid and the score
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

//slide all elements in a row to the left and combine equal elements
function slide(row) {
    row = row.filter(val => val);
    for (let i = 0; i < row.length - 1; i++) {
        //combine equal elements
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

//rotate the board to account for all directions
function rotateClockwise(board) {
    return board[0].map((_, index) => board.map(row => row[index]).reverse());
}
//rotate back to original orientation once shifted
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

//check if won or lost
function checkGameStatus() {
    if (board.flat().includes(2048)) {
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

//check for available moves
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

//used to prevent generation if an arrow key is pressed and no change occurs
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

//listen for key presses
document.addEventListener('keydown', e => {
    if (gameOver) return;

    temp = board.map(row => row.slice());
    switch (e.key) {
        case 'ArrowLeft':
        case 'a':
            moveLeft();
            break;
        case 'ArrowRight':
        case 'd':
            moveRight();
            break;
        case 'ArrowUp':
        case 'w':
            moveUp();
            break;
        case 'ArrowDown':
        case 's':
            moveDown();
            break;
        default:
            return;
    }

    if (compareArrays(board, temp)) {
        return;
    }
    updateGrid();
    //slight delay to make it clear which tile just generated
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

//update score to homepage
function endGame2048(finalScore) {
    updateScore('2048', finalScore); 
}

//ask user if they are sure they want to exit
window.addEventListener("beforeunload", function (event) {
    event.preventDefault();
    event.returnValue = ''; 
});

initializeBoard();