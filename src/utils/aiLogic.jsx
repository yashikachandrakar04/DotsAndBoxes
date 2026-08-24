// src/utils/aiLogic.js
import { getAvailableMoves, copyBoard, checkBoxCompletion } from './gameLogic';

export const playAIMove = (board, boardSize, difficulty) => {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) return null;

  // Different strategies based on difficulty
  switch (difficulty) {
    case 'easy':
      return getEasyMove(availableMoves);
    case 'medium':
      return getMediumMove(board, boardSize, availableMoves);
    case 'hard':
      return getHardMove(board, boardSize, availableMoves);
    default:
      return getMediumMove(board, boardSize, availableMoves);
  }
};

// Easy: Random move
const getEasyMove = (availableMoves) => {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Medium: Try to complete boxes, block opponent
const getMediumMove = (board, boardSize, availableMoves) => {
  // 1. Try to complete a box
  const winningMoves = findWinningMoves(board, boardSize, availableMoves);
  if (winningMoves.length > 0) {
    return winningMoves[Math.floor(Math.random() * winningMoves.length)];
  }
  
  // 2. Try to block opponent from completing a box
  const blockingMoves = findBlockingMoves(board, boardSize, availableMoves);
  if (blockingMoves.length > 0) {
    return blockingMoves[Math.floor(Math.random() * blockingMoves.length)];
  }
  
  // 3. Random move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

// Hard: More strategic, prefer moves that create opportunities
const getHardMove = (board, boardSize, availableMoves) => {
  // 1. Try to complete a box
  const winningMoves = findWinningMoves(board, boardSize, availableMoves);
  if (winningMoves.length > 0) {
    return winningMoves[Math.floor(Math.random() * winningMoves.length)];
  }
  
  // 2. Try to block opponent from completing a box
  const blockingMoves = findBlockingMoves(board, boardSize, availableMoves);
  if (blockingMoves.length > 0) {
    return blockingMoves[Math.floor(Math.random() * blockingMoves.length)];
  }
  
  // 3. Look for strategic moves (center preference, chain creation)
  const strategicMoves = findStrategicMoves(board, boardSize, availableMoves);
  if (strategicMoves.length > 0) {
    return strategicMoves[Math.floor(Math.random() * strategicMoves.length)];
  }
  
  // 4. Random move
  return availableMoves[Math.floor(Math.random() * availableMoves.length)];
};

const findWinningMoves = (board, boardSize, availableMoves) => {
  const winningMoves = [];
  
  for (const move of availableMoves) {
    const testBoard = copyBoard(board);
    const { type, row, col } = move;
    
    if (type === 'horizontal') {
      const lineIndex = testBoard.horizontalLines.findIndex(
        l => l.row === row && l.col === col
      );
      if (lineIndex !== -1) {
        testBoard.horizontalLines[lineIndex].occupied = true;
        testBoard.horizontalLines[lineIndex].player = 2;
      }
    } else {
      const lineIndex = testBoard.verticalLines.findIndex(
        l => l.row === row && l.col === col
      );
      if (lineIndex !== -1) {
        testBoard.verticalLines[lineIndex].occupied = true;
        testBoard.verticalLines[lineIndex].player = 2;
      }
    }
    
    const completedBoxes = checkBoxCompletion(testBoard, boardSize, row, col, type);
    if (completedBoxes.length > 0) {
      winningMoves.push(move);
    }
  }
  
  return winningMoves;
};

const findBlockingMoves = (board, boardSize, availableMoves) => {
  const blockingMoves = [];
  
  for (const move of availableMoves) {
    const testBoard = copyBoard(board);
    const { type, row, col } = move;
    
    // Simulate opponent making this move
    if (type === 'horizontal') {
      const lineIndex = testBoard.horizontalLines.findIndex(
        l => l.row === row && l.col === col
      );
      if (lineIndex !== -1) {
        testBoard.horizontalLines[lineIndex].occupied = true;
        testBoard.horizontalLines[lineIndex].player = 1;
      }
    } else {
      const lineIndex = testBoard.verticalLines.findIndex(
        l => l.row === row && l.col === col
      );
      if (lineIndex !== -1) {
        testBoard.verticalLines[lineIndex].occupied = true;
        testBoard.verticalLines[lineIndex].player = 1;
      }
    }
    
    const completedBoxes = checkBoxCompletion(testBoard, boardSize, row, col, type);
    if (completedBoxes.length > 0) {
      blockingMoves.push(move);
    }
  }
  
  return blockingMoves;
};

const findStrategicMoves = (board, boardSize, availableMoves) => {
  const strategicMoves = [];
  
  for (const move of availableMoves) {
    let score = 0;
    const { row, col } = move;
    
    // Center preference (higher for moves closer to center)
    const centerDistance = Math.abs(row - boardSize/2) + Math.abs(col - boardSize/2);
    score += (boardSize - centerDistance) * 2;
    
    // Check adjacent lines
    const adjacentLines = countAdjacentLines(board, move, boardSize);
    score += adjacentLines * 3;
    
    // Check if move creates a box next turn opportunity
    const futureOpportunity = checkFutureOpportunity(board, boardSize, move);
    score += futureOpportunity * 5;
    
    if (score > 0) {
      strategicMoves.push({ ...move, score });
    }
  }
  
  // Sort by score descending
  strategicMoves.sort((a, b) => b.score - a.score);
  
  // Return top 50% of strategic moves
  const topMoves = strategicMoves.slice(0, Math.ceil(strategicMoves.length / 2));
  return topMoves;
};

const countAdjacentLines = (board, move, boardSize) => {
  const { type, row, col } = move;
  let count = 0;
  
  if (type === 'horizontal') {
    // Check vertical lines at ends
    const leftLine = board.verticalLines.find(l => l.row === row && l.col === col - 1);
    const rightLine = board.verticalLines.find(l => l.row === row && l.col === col);
    if (leftLine?.occupied) count++;
    if (rightLine?.occupied) count++;
    
    // Check horizontal lines above and below
    const aboveLine = board.horizontalLines.find(l => l.row === row - 1 && l.col === col);
    const belowLine = board.horizontalLines.find(l => l.row === row + 1 && l.col === col);
    if (aboveLine?.occupied) count++;
    if (belowLine?.occupied) count++;
  } else {
    // Check horizontal lines at ends
    const aboveLine = board.horizontalLines.find(l => l.row === row && l.col === col);
    const belowLine = board.horizontalLines.find(l => l.row === row + 1 && l.col === col);
    if (aboveLine?.occupied) count++;
    if (belowLine?.occupied) count++;
    
    // Check vertical lines left and right
    const leftLine = board.verticalLines.find(l => l.row === row && l.col === col - 1);
    const rightLine = board.verticalLines.find(l => l.row === row && l.col === col);
    if (leftLine?.occupied) count++;
    if (rightLine?.occupied) count++;
  }
  
  return count;
};

const checkFutureOpportunity = (board, boardSize, move) => {
  const { type, row, col } = move;
  let opportunities = 0;
  
  // Simulate the move
  const testBoard = copyBoard(board);
  if (type === 'horizontal') {
    const lineIndex = testBoard.horizontalLines.findIndex(
      l => l.row === row && l.col === col
    );
    if (lineIndex !== -1) {
      testBoard.horizontalLines[lineIndex].occupied = true;
      testBoard.horizontalLines[lineIndex].player = 2;
    }
  } else {
    const lineIndex = testBoard.verticalLines.findIndex(
      l => l.row === row && l.col === col
    );
    if (lineIndex !== -1) {
      testBoard.verticalLines[lineIndex].occupied = true;
      testBoard.verticalLines[lineIndex].player = 2;
    }
  }
  
  // Check if this move creates a situation where AI can complete a box next turn
  const remainingMoves = getAvailableMoves(testBoard);
  for (const nextMove of remainingMoves) {
    const { type: nextType, row: nextRow, col: nextCol } = nextMove;
    const completed = checkBoxCompletion(testBoard, boardSize, nextRow, nextCol, nextType);
    if (completed.length > 0) {
      opportunities++;
    }
  }
  
  return opportunities;
};