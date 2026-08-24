// src/utils/gameLogic.js

export const initializeBoard = (boardSize) => {
  const board = {
    dots: [],
    horizontalLines: [],
    verticalLines: [],
    boxes: [],
    moves: [],
  };

  // Create dots
  for (let i = 0; i <= boardSize; i++) {
    for (let j = 0; j <= boardSize; j++) {
      board.dots.push({ row: i, col: j });
    }
  }

  // Create horizontal lines
  for (let i = 0; i <= boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      board.horizontalLines.push({
        row: i,
        col: j,
        occupied: false,
        player: null,
      });
    }
  }

  // Create vertical lines
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j <= boardSize; j++) {
      board.verticalLines.push({
        row: i,
        col: j,
        occupied: false,
        player: null,
      });
    }
  }

  // Create boxes
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      board.boxes.push({
        row: i,
        col: j,
        completed: false,
        player: null,
      });
    }
  }

  return board;
};

export const getLineIndex = (lines, row, col) => {
  return lines.findIndex(line => line.row === row && line.col === col);
};

export const isLineOccupied = (lines, row, col) => {
  const line = lines.find(l => l.row === row && l.col === col);
  return line ? line.occupied : false;
};

export const getAdjacentBoxes = (board, boardSize, row, col, lineType) => {
  const adjacentBoxes = [];
  
  if (lineType === 'horizontal') {
    // Check boxes above and below
    if (row > 0) {
      adjacentBoxes.push(board.boxes.find(b => b.row === row - 1 && b.col === col));
    }
    if (row < boardSize) {
      adjacentBoxes.push(board.boxes.find(b => b.row === row && b.col === col));
    }
  } else {
    // Check boxes left and right
    if (col > 0) {
      adjacentBoxes.push(board.boxes.find(b => b.row === row && b.col === col - 1));
    }
    if (col < boardSize) {
      adjacentBoxes.push(board.boxes.find(b => b.row === row && b.col === col));
    }
  }
  
  return adjacentBoxes.filter(box => box && !box.completed);
};

export const checkBoxCompletion = (board, boardSize, row, col, lineType) => {
  const completedBoxes = [];
  const adjacentBoxes = getAdjacentBoxes(board, boardSize, row, col, lineType);
  
  for (const box of adjacentBoxes) {
    if (!box) continue;
    
    const { row: boxRow, col: boxCol } = box;
    
    // Check all four sides
    const topLine = board.horizontalLines.find(
      l => l.row === boxRow && l.col === boxCol
    );
    const bottomLine = board.horizontalLines.find(
      l => l.row === boxRow + 1 && l.col === boxCol
    );
    const leftLine = board.verticalLines.find(
      l => l.row === boxRow && l.col === boxCol
    );
    const rightLine = board.verticalLines.find(
      l => l.row === boxRow && l.col === boxCol + 1
    );
    
    if (topLine?.occupied && bottomLine?.occupied && 
        leftLine?.occupied && rightLine?.occupied) {
      completedBoxes.push(box);
    }
  }
  
  return completedBoxes;
};

export const getAvailableMoves = (board) => {
  const moves = [];
  
  board.horizontalLines.forEach((line, index) => {
    if (!line.occupied) {
      moves.push({
        type: 'horizontal',
        row: line.row,
        col: line.col,
        index: index,
      });
    }
  });
  
  board.verticalLines.forEach((line, index) => {
    if (!line.occupied) {
      moves.push({
        type: 'vertical',
        row: line.row,
        col: line.col,
        index: index,
      });
    }
  });
  
  return moves;
};

export const isGameOver = (board, boardSize) => {
  const totalBoxes = boardSize * boardSize;
  const completedBoxes = board.boxes.filter(box => box.completed).length;
  return completedBoxes === totalBoxes;
};

export const getScores = (board) => {
  const player1Boxes = board.boxes.filter(box => box.completed && box.player === 1);
  const player2Boxes = board.boxes.filter(box => box.completed && box.player === 2);
  return {
    player1: player1Boxes.length,
    player2: player2Boxes.length,
  };
};

export const getWinner = (board) => {
  const scores = getScores(board);
  if (scores.player1 > scores.player2) return 1;
  if (scores.player2 > scores.player1) return 2;
  return 0; // Draw
};

export const copyBoard = (board) => {
  return {
    dots: [...board.dots],
    horizontalLines: board.horizontalLines.map(line => ({ ...line })),
    verticalLines: board.verticalLines.map(line => ({ ...line })),
    boxes: board.boxes.map(box => ({ ...box })),
    moves: [...board.moves],
  };
};