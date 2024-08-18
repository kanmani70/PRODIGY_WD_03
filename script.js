const board = document.getElementById('board');
const status = document.getElementById('status');
const aiButton = document.getElementById('aiButton');
const resetButton = document.getElementById('resetButton');

let cells = [];
let boardState = Array(9).fill(null);
let isXNext = true;
let isPlayingWithAI = false;

function createBoard() {
    board.innerHTML = '';
    cells = [];
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleClick(i));
        board.appendChild(cell);
        cells.push(cell);
    }
    updateStatus();
}

function updateStatus() {
    if (checkWinner('X')) {
        status.textContent = 'Player X wins!';
        return;
    }
    if (checkWinner('O')) {
        status.textContent = 'Player O wins!';
        return;
    }
    if (boardState.every(cell => cell)) {
        status.textContent = 'It\'s a draw!';
        return;
    }
    status.textContent = `Player ${isXNext ? 'X' : 'O'}'s turn`;
}

function handleClick(index) {
    if (boardState[index] || checkWinner('X') || checkWinner('O')) return;

    boardState[index] = isXNext ? 'X' : 'O';
    cells[index].textContent = boardState[index];
    isXNext = !isXNext;
    updateStatus();

    if (isPlayingWithAI && !isXNext) {
        setTimeout(() => aiMove(), 500);
    }
}

function aiMove() {
    const move = minimax(boardState, 'O').index;
    boardState[move] = 'O';
    cells[move].textContent = 'O';
    isXNext = !isXNext;
    updateStatus();
}

function minimax(board, player) {
    const availableMoves = board.map((value, index) => value === null ? index : null).filter(value => value !== null);
    
    // Base case: check for terminal states
    if (checkWinner('X')) return { score: -10 };
    if (checkWinner('O')) return { score: 10 };
    if (availableMoves.length === 0) return { score: 0 };

    let bestMove = null;
    let bestScore = player === 'O' ? -Infinity : Infinity;

    for (const move of availableMoves) {
        board[move] = player;
        const result = minimax(board, player === 'O' ? 'X' : 'O');
        board[move] = null;

        const score = result.score;
        if ((player === 'O' && score > bestScore) || (player === 'X' && score < bestScore)) {
            bestScore = score;
            bestMove = move;
        }
    }

    return { index: bestMove, score: bestScore };
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]  // Diagonals
    ];
    return winPatterns.some(pattern => pattern.every(index => boardState[index] === player));
}

function resetGame() {
    boardState.fill(null);
    isXNext = true;
    createBoard();
}

createBoard();

aiButton.addEventListener('click', () => {
    isPlayingWithAI = true;
    resetGame();
});

resetButton.addEventListener('click', resetGame);
