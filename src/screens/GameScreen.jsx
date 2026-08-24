import React, { useState, useEffect, useRef } from 'react';
import {useGame} from '../context/GameContext';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { useGame } from '../context/GameContext';
import Board from '../components/Board';
import { playAIMove } from '../utils/aiLogic';

const GameScreen = ({ route, navigation }) => {
  const { boardSize, difficulty, gameMode } = route.params;
  const { updateStats } = useGame();
  
  const [board, setBoard] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 for player, 2 for AI or friend
  const [scores, setScores] = useState({ player1: 0, player2: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [moves, setMoves] = useState([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const aiTimeoutRef = useRef(null);

  useEffect(() => {
    initializeBoard();
    return () => {
      if (aiTimeoutRef.current) {
        clearTimeout(aiTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (gameMode === 'ai' && currentPlayer === 2 && !gameOver && !isProcessing) {
      handleAIMove();
    }
  }, [currentPlayer, gameOver, isProcessing]);

  const initializeBoard = () => {
    const newBoard = {
      dots: [],
      horizontalLines: [],
      verticalLines: [],
      boxes: [],
    };

    // Create dots
    for (let i = 0; i <= boardSize; i++) {
      for (let j = 0; j <= boardSize; j++) {
        newBoard.dots.push({ row: i, col: j, x: j, y: i });
      }
    }

    // Create horizontal lines
    for (let i = 0; i <= boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        newBoard.horizontalLines.push({
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
        newBoard.verticalLines.push({
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
        newBoard.boxes.push({
          row: i,
          col: j,
          completed: false,
          player: null,
        });
      }
    }

    setBoard(newBoard);
  };

  const handleLineClick = (lineType, row, col) => {
    if (gameOver || isProcessing || (gameMode === 'ai' && currentPlayer !== 1)) {
      return;
    }

    setIsProcessing(true);
    const result = makeMove(lineType, row, col, currentPlayer);
    
    if (result) {
      setMoves([...moves, { lineType, row, col, player: currentPlayer }]);
      const { boxCompleted, playerScored } = result;
      
      if (!boxCompleted) {
        switchPlayer();
      } else {
        // Player gets another turn
        setCurrentPlayer(currentPlayer);
        if (gameMode === 'ai' && currentPlayer === 2) {
          handleAIMove();
        }
      }
    }
    
    setIsProcessing(false);
  };

  const makeMove = (lineType, row, col, player) => {
    let lines = lineType === 'horizontal' 
      ? board.horizontalLines 
      : board.verticalLines;
    
    const lineIndex = lines.findIndex(
      l => l.row === row && l.col === col && !l.occupied
    );
    
    if (lineIndex === -1) return null;

    const newBoard = { ...board };
    const line = { ...lines[lineIndex], occupied: true, player };
    
    if (lineType === 'horizontal') {
      newBoard.horizontalLines[lineIndex] = line;
    } else {
      newBoard.verticalLines[lineIndex] = line;
    }

    // Check for completed boxes
    const completedBoxes = checkCompletedBoxes(newBoard, row, col, lineType, player);
    
    setBoard(newBoard);
    updateScores(completedBoxes, player);

    if (completedBoxes.length > 0) {
      return { boxCompleted: true, playerScored: player };
    }

    return { boxCompleted: false };
  };

  const checkCompletedBoxes = (board, row, col, lineType, player) => {
    const completedBoxes = [];
    const boxes = board.boxes;

    const boxIndices = [];
    if (lineType === 'horizontal') {
      // Check boxes above and below the horizontal line
      if (row > 0) boxIndices.push((row - 1) * boardSize + col);
      if (row < boardSize) boxIndices.push(row * boardSize + col);
    } else {
      // Check boxes left and right of the vertical line
      if (col > 0) boxIndices.push(row * boardSize + (col - 1));
      if (col < boardSize) boxIndices.push(row * boardSize + col);
    }

    for (const index of boxIndices) {
      const box = boxes[index];
      if (box.completed) continue;

      const { row: boxRow, col: boxCol } = box;
      
      // Check all four sides of the box
      const topLine = board.horizontalLines.find(
        l => l.row === boxRow && l.col === boxCol && l.occupied
      );
      const bottomLine = board.horizontalLines.find(
        l => l.row === boxRow + 1 && l.col === boxCol && l.occupied
      );
      const leftLine = board.verticalLines.find(
        l => l.row === boxRow && l.col === boxCol && l.occupied
      );
      const rightLine = board.verticalLines.find(
        l => l.row === boxRow && l.col === boxCol + 1 && l.occupied
      );

      if (topLine && bottomLine && leftLine && rightLine) {
        const newBox = { ...box, completed: true, player };
        boxes[index] = newBox;
        completedBoxes.push(newBox);
      }
    }

    return completedBoxes;
  };

  const updateScores = (completedBoxes, player) => {
    const newScores = { ...scores };
    const count = completedBoxes.length;
    
    if (player === 1) {
      newScores.player1 += count;
    } else {
      newScores.player2 += count;
    }
    
    setScores(newScores);
    
    // Check if game is over
    const totalBoxes = boardSize * boardSize;
    const completedTotal = newScores.player1 + newScores.player2;
    
    if (completedTotal === totalBoxes) {
      setGameOver(true);
      determineWinner(newScores);
    }
  };

  const determineWinner = (finalScores) => {
    let result = '';
    if (finalScores.player1 > finalScores.player2) {
      result = 'win';
      Alert.alert('🎉 Game Over!', `Player 1 wins!\nScore: ${finalScores.player1} - ${finalScores.player2}`);
    } else if (finalScores.player2 > finalScores.player1) {
      if (gameMode === 'ai') {
        result = 'loss';
        Alert.alert('😔 Game Over!', `AI wins!\nScore: ${finalScores.player1} - ${finalScores.player2}`);
      } else {
        result = 'loss';
        Alert.alert('😔 Game Over!', `Player 2 wins!\nScore: ${finalScores.player1} - ${finalScores.player2}`);
      }
    } else {
      result = 'draw';
      Alert.alert('🤝 Game Over!', `It's a draw!\nScore: ${finalScores.player1} - ${finalScores.player2}`);
    }
    
    if (gameMode === 'ai') {
      updateStats(result);
    }
  };

  const switchPlayer = () => {
    const nextPlayer = currentPlayer === 1 ? 2 : 1;
    setCurrentPlayer(nextPlayer);
  };

  const handleAIMove = async () => {
    if (gameOver || isProcessing) return;
    
    setIsAIThinking(true);
    aiTimeoutRef.current = setTimeout(() => {
      const aiMove = playAIMove(board, boardSize, difficulty);
      if (aiMove) {
        const result = makeMove(aiMove.type, aiMove.row, aiMove.col, 2);
        if (result) {
          setMoves([...moves, { ...aiMove, player: 2 }]);
          if (!result.boxCompleted) {
            switchPlayer();
          }
        }
      }
      setIsAIThinking(false);
    }, 500);
  };

  const resetGame = () => {
    initializeBoard();
    setCurrentPlayer(1);
    setScores({ player1: 0, player2: 0 });
    setGameOver(false);
    setMoves([]);
    setIsProcessing(false);
    setIsAIThinking(false);
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
  };

  const goHome = () => {
    if (aiTimeoutRef.current) {
      clearTimeout(aiTimeoutRef.current);
    }
    navigation.goBack();
  };

  if (!board) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.scoreContainer}>
          <View style={[styles.scoreBox, styles.player1Score]}>
            <Text style={styles.scoreLabel}>
              {gameMode === 'ai' ? 'You' : 'Player 1'}
            </Text>
            <Text style={styles.scoreValue}>{scores.player1}</Text>
          </View>
          <Text style={styles.scoreDivider}>VS</Text>
          <View style={[styles.scoreBox, styles.player2Score]}>
            <Text style={styles.scoreLabel}>
              {gameMode === 'ai' ? 'AI' : 'Player 2'}
            </Text>
            <Text style={styles.scoreValue}>{scores.player2}</Text>
          </View>
        </View>
        <View style={styles.turnIndicator}>
          <Text style={styles.turnText}>
            {gameOver ? 'Game Over' : 
              isAIThinking ? 'AI Thinking...' :
              `Turn: ${currentPlayer === 1 ? 'Player 1' : 'Player 2'}`}
          </Text>
          <View style={[
            styles.turnDot,
            { backgroundColor: currentPlayer === 1 ? '#3498db' : '#e74c3c' }
          ]} />
        </View>
      </View>

      <Board
        board={board}
        boardSize={boardSize}
        onLineClick={handleLineClick}
        currentPlayer={currentPlayer}
      />

      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={resetGame}>
          <Text style={styles.controlButtonText}>🔄 New Game</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.controlButton, styles.homeButton]} onPress={goHome}>
          <Text style={styles.controlButtonText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    padding: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  scoreBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  player1Score: {
    backgroundColor: 'rgba(52, 152, 219, 0.3)',
  },
  player2Score: {
    backgroundColor: 'rgba(231, 76, 60, 0.3)',
  },
  scoreLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  scoreValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  scoreDivider: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  turnIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  turnText: {
    color: '#ecf0f1',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  turnDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  controlButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#3498db',
    borderRadius: 10,
    minWidth: 120,
    alignItems: 'center',
  },
  homeButton: {
    backgroundColor: '#e74c3c',
  },
  controlButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GameScreen;