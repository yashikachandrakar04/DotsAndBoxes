import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

const Line = ({ 
  type, // 'horizontal' or 'vertical'
  row, 
  col, 
  size, 
  occupied, 
  player, 
  onPress,
  isActive,
}) => {
  const isHorizontal = type === 'horizontal';
  
  const getLineColor = () => {
    if (!occupied) return '#bdc3c7';
    return player === 1 ? '#3498db' : '#e74c3c';
  };

  const getLineWidth = () => {
    return occupied ? 4 : 2;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: isHorizontal ? size : 30,
          height: isHorizontal ? 30 : size,
          left: isHorizontal ? 0 : -15,
          top: isHorizontal ? -15 : 0,
        },
        isActive && styles.active,
      ]}
      onPress={() => onPress && onPress(type, row, col)}
      disabled={!onPress || occupied}
    >
      <View
        style={[
          styles.line,
          {
            backgroundColor: getLineColor(),
            width: isHorizontal ? size : getLineWidth(),
            height: isHorizontal ? getLineWidth() : size,
            borderRadius: getLineWidth() / 2,
          },
        ]}
      />
      {!occupied && (
        <View style={styles.hoverArea} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    position: 'absolute',
  },
  hoverArea: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  active: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
    borderRadius: 5,
  },
});

export default Line;