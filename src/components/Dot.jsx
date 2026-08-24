import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';

const Dot = ({ row, col, size, onPress, isActive }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        isActive && styles.active,
      ]}
      onPress={() => onPress && onPress(row, col)}
      disabled={!onPress}
    >
      <View style={[
        styles.dot,
        {
          width: size * 0.6,
          height: size * 0.6,
          borderRadius: size * 0.3,
        },
        isActive && styles.activeDot,
      ]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  dot: {
    backgroundColor: '#2c3e50',
  },
  active: {
    backgroundColor: 'rgba(52, 152, 219, 0.2)',
  },
  activeDot: {
    backgroundColor: '#3498db',
  },
});

export default Dot;