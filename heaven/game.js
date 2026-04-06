const WIN_CONDITIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameOver = false;
let vsAI = false; // X = human, O = AI

const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const btnHuman = document.getElementById('btn-human');
const btnAI = document.getElementById('btn-ai');

cells.forEach(cell => cell.addEventListener('click', handleClick));
restartBtn.addEventListener('click', restart);

// ── Preview mode switcher ────────────────────────────────
document.querySelectorAll('.preview-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.preview-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.body.classList.remove('preview-mobile', 'preview-tv');
    const mode = btn.dataset.preview;
    if (mode !== 'pc') document.body.classList.add(`preview-${mode}`);
  });
});

btnHuman.addEventListener('click', () => {
  vsAI = false;
  btnHuman.classList.add('active');
  btnAI.classList.remove('active');
  restart();
});
btnAI.addEventListener('click', () => {
  vsAI = true;
  btnAI.classList.add('active');
  btnHuman.classList.remove('active');
  restart();
});

function handleClick(e) {
  const idx = +e.currentTarget.dataset.index;
  if (gameOver || board[idx]) return;
  if (vsAI && currentPlayer === 'O') return;

  placeMove(idx, currentPlayer);

  if (!gameOver && vsAI && currentPlayer === 'O') {
    setTimeout(aiMove, 400);
  }
}

function placeMove(idx, player) {
  board[idx] = player;
  cells[idx].classList.add(player.toLowerCase(), 'taken');

  const winLine = getWinner(board);
  if (winLine) {
    winLine.forEach(i => cells[i].classList.add('winner-cell'));
    const label = vsAI && player === 'O' ? 'ИИ победил' : `Победил ${player}`;
    status.textContent = label;
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

  if (vsAI) {
    status.textContent = currentPlayer === 'X' ? 'Ваш ход' : 'ИИ думает...';
  } else {
    status.textContent = `Ход игрока ${currentPlayer}`;
  }
}

function aiMove() {
  if (gameOver) return;
  const idx = bestMove(board);
  placeMove(idx, 'O');
}

// ── Minimax ──────────────────────────────────────────────

function bestMove(b) {
  let best = -Infinity;
  let move = -1;
  for (let i = 0; i < 9; i++) {
    if (!b[i]) {
      b[i] = 'O';
      const score = minimax(b, 0, false);
      b[i] = null;
      if (score > best) { best = score; move = i; }
    }
  }
  return move;
}

function minimax(b, depth, isMaximizing) {
  const win = getWinner(b);
  if (win) return isMaximizing ? -10 + depth : 10 - depth;
  if (b.every(Boolean)) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'O';
        best = Math.max(best, minimax(b, depth + 1, false));
        b[i] = null;
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (!b[i]) {
        b[i] = 'X';
        best = Math.min(best, minimax(b, depth + 1, true));
        b[i] = null;
      }
    }
    return best;
  }
}

function getWinner(b) {
  for (const [a, bb, c] of WIN_CONDITIONS) {
    if (b[a] && b[a] === b[bb] && b[a] === b[c]) return [a, bb, c];
  }
  return null;
}

function restart() {
  board = Array(9).fill(null);
  currentPlayer = 'X';
  gameOver = false;
  cells.forEach(cell => { cell.className = 'cell'; });
  status.textContent = vsAI ? 'Ваш ход' : 'Ход игрока X';
  status.className = 'status';
}
