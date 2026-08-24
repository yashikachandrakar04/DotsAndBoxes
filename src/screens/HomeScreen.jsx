import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useGame } from '../context/GameContext';

const HomeScreen = ({ navigation }) => {
  const { loadStats } = useGame();
  const [selectedBoard, setSelectedBoard] = useState(6);
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [gameMode, setGameMode] = useState('ai'); // 'ai' or 'friend'

  useEffect(() => {
    loadStats();
  }, []);

  const boardSizes = [6, 8, 10, 12];
  const difficulties = ['easy', 'medium', 'hard'];

  const startGame = () => {
    navigation.navigate('Game', {
      boardSize: selectedBoard,
      difficulty: selectedDifficulty,
      gameMode: gameMode,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🎮 Dots & Boxes</Text>
        <Text style={styles.subtitle}>Choose your game settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Mode</Text>
        <View style={styles.modeContainer}>
          <TouchableOpacity
            style={[
              styles.modeButton,
              gameMode === 'ai' && styles.selectedMode,
            ]}
            onPress={() => setGameMode('ai')}
          >
            <Text style={styles.modeText}>🤖 VS AI</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.modeButton,
              gameMode === 'friend' && styles.selectedMode,
            ]}
            onPress={() => setGameMode('friend')}
          >
            <Text style={styles.modeText}>👥 VS Friend</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Board Size</Text>
        <View style={styles.gridContainer}>
          {boardSizes.map((size) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.gridButton,
                selectedBoard === size && styles.selectedGrid,
              ]}
              onPress={() => setSelectedBoard(size)}
            >
              <Text style={styles.gridText}>{size}×{size}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {gameMode === 'ai' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Difficulty</Text>
          <View style={styles.difficultyContainer}>
            {difficulties.map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  selectedDifficulty === diff && styles.selectedDifficulty,
                ]}
                onPress={() => setSelectedDifficulty(diff)}
              >
                <Text style={styles.difficultyText}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.startButton} onPress={startGame}>
        <Text style={styles.startButtonText}>Start Game</Text>
      </TouchableOpacity>

      <View style={styles.bottomButtons}>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('Stats')}
        >
          <Text style={styles.statsButtonText}>📊 Statistics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.statsButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Text style={styles.statsButtonText}>⚙️ Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: '#2c3e50',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#ecf0f1',
    marginTop: 5,
  },
  section: {
    margin: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  modeButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#ecf0f1',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedMode: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  modeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#ecf0f1',
    margin: 5,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedGrid: {
    backgroundColor: '#3498db',
  },
  gridText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  difficultyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  difficultyButton: {
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
  },
  selectedDifficulty: {
    backgroundColor: '#e67e22',
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  startButton: {
    margin: 20,
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#27ae60',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  statsButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    backgroundColor: '#34495e',
    flex: 0.45,
    alignItems: 'center',
  },
  statsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default HomeScreen;