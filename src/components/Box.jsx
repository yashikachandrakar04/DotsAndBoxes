import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

const Box = ({ row, col, size, completed, player, onPress }) => {
  const getBoxStyle = () => {
    if (!completed) return styles.emptyBox;
    return player === 1 ? styles.player1Box : styles.player2Box;
  };

  const getBoxContent = () => {
    if (!completed) return null;
    return player === 1 ? '●' : '●';
  };

  const getTextColor = () => {
    if (!completed) return 'transparent';
    return player === 1 ? '#3498db' : '#e74c3c';
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        getBoxStyle(),
      ]}
      onPress={() => onPress && onPress(row, col)}
      disabled={!onPress || completed}
    >
      {completed && (
        <Text style={[styles.content, { color: getTextColor() }]}>
          {getBoxContent()}
        </Text>
      )}
      {!completed && (
        <View style={styles.emptyContent} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  emptyBox: {
    backgroundColor: 'rgba(236, 240, 241, 0.3)',
  },
  player1Box: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderColor: 'rgba(52, 152, 219, 0.3)',
  },
  player2Box: {
    backgroundColor: 'rgba(231, 76, 60, 0.2)',
    borderColor: 'rgba(231, 76, 60, 0.3)',
  },
  content: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emptyContent: {
    width: '100%',
    height: '100%',
    backgroundColor: 'transparent',
  },
});

export default Box;
