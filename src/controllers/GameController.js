const calculateGameResult = (game) => {
  const { size, moves } = game;

  const checkWin = (row, col, player) => {
    const directions = [
      [1, 0], // Horizontal
      [0, 1], // Vertical
      [1, 1], // Diagonal (top-left to bottom-right)
      [1, -1], // Diagonal (top-right to bottom-left)
    ];

    for (const [dx, dy] of directions) {
      let count = 1;
      let x = row + dx;
      let y = col + dy;

      while (
        x >= 0 &&
        x < size &&
        y >= 0 &&
        y < size &&
        moves.some((move) => move.row === x && move.col === y && move.player === player)
      ) {
        count++;
        x += dx;
        y += dy;
      }

      x = row - dx;
      y = col - dy;

      while (
        x >= 0 &&
        x < size &&
        y >= 0 &&
        y < size &&
        moves.some((move) => move.row === x && move.col === y && move.player === player)
      ) {
        count++;
        x -= dx;
        y -= dy;
      }

      if (count >= 5) {
        return player; // Return the winning player's value
      }
    }

    return null; // No winning condition found
  };

  let result = 'In Progress';


  const isDraw = () => {
    const totalMoves = size * size;
    return moves.length === totalMoves;
  };

  for (const move of moves) {
    const moveResult = checkWin(move.row, move.col, move.player);

    if (moveResult !== null) {
      result = moveResult === 1 ? 'Black' : 'White';
    }
  }

  if (isDraw()) {
    result = 'Draw';
  }

  return result;
};

module.exports = calculateGameResult;
