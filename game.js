const WIN_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],             // diags
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restart);

function handleClick(e) {
  const idx = +e.currentTarget.dataset.index;
  if (gameOver || board[idx]) return;

  board[idx] = currentPlayer;
  e.currentTarget.classList.add(currentPlayer.toLowerCase(), 'taken');

  const winLine = getWinner();
  if (winLine) {
    winLine.forEach(i => cells[i].classList.add('winner-cell'));
    status.textContent = `Победил ${currentPlayer}`;
    status.className = 'status winner';
    gameOver = true;
    return;
  }

  if (board.every(Boolean)) {
    status.textContent = 'Ничья';
    status.className = 'status draw';
    gameOver = true;
    return;
  }

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  status.textContent = `Ход игрока ${currentPlayer}`;
}

function getWinner() {
  for (const [a, b, c] of WIN_CONDITIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return [a, b, c];
    }
  }
  return null;
}

function restart() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach(cell => {
    cell.className = 'cell';
  });
  status.textContent = 'Ход игрока X';
  status.className = 'status';
}
