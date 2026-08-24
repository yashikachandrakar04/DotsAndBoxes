import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Dot from './Dot';
import Line from './Line';
import Box from './Box';

const Board = ({ board, boardSize, onLineClick, currentPlayer }) => {
  const screenWidth = Dimensions.get('window').width;
  const boardPadding = 20;
  const maxBoardWidth = Math.min(screenWidth - boardPadding * 2, 400);
  const cellSize = maxBoardWidth / boardSize;
  const dotSize = Math.max(10, cellSize * 0.12);
  
  // Calculate if we need to scale down for larger boards
  const isLargeBoard = boardSize > 8;
  const scaleFactor = isLargeBoard ? 0.8 : 1;
  const scaledCellSize = cellSize * scaleFactor;
  const totalBoardSize = scaledCellSize * boardSize + 20;

  const renderDots = () => {
    return board.dots.map((dot, index) => (
      <Dot
        key={`dot-${index}`}
        row={dot.row}
        col={dot.col}
        size={dotSize}
        isActive={false}
      />
    ));
  };

  const renderHorizontalLines = () => {
    return board.horizontalLines.map((line, index) => (
      <Line
        key={`h-${index}`}
        type="horizontal"
        row={line.row}
        col={line.col}
        size={scaledCellSize}
        occupied={line.occupied}
        player={line.player}
        onPress={onLineClick}
        isActive={!line.occupied && currentPlayer === 1}
      />
    ));
  };

  const renderVerticalLines = () => {
    return board.verticalLines.map((line, index) => (
      <Line
        key={`v-${index}`}
        type="vertical"
        row={line.row}
        col={line.col}
        size={scaledCellSize}
        occupied={line.occupied}
        player={line.player}
        onPress={onLineClick}
        isActive={!line.occupied && currentPlayer === 1}
      />
    ));
  };

  const renderBoxes = () => {
    return board.boxes.map((box, index) => (
      <Box
        key={`box-${index}`}
        row={box.row}
        col={box.col}
        size={scaledCellSize}
        completed={box.completed}
        player={box.player}
      />
    ));
  };

  return (
    <ScrollView 
      style={styles.scrollContainer}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={[styles.container, { padding: boardPadding }]}>
        <View 
          style={[
            styles.boardContainer,
            {
              width: totalBoardSize,
              height: totalBoardSize,
            }
          ]}
        >
          {/* Render boxes first (background layer) */}
          <View style={styles.boxesLayer}>
            {renderBoxes()}
          </View>
          
          {/* Render dots */}
          <View style={styles.dotsLayer}>
            {renderDots()}
          </View>
          
          {/* Render lines on top */}
          <View style={styles.linesLayer}>
            {renderHorizontalLines()}
            {renderVerticalLines()}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 300,
  },
  boardContainer: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  boxesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dotsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  linesLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default Board;