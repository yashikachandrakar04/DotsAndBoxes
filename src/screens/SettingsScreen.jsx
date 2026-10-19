import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGame } from '../context/GameContext';

const SettingsScreen = ({ navigation }) => {
  const { settings, setSettings } = useGame();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    setSettings(newSettings);
    AsyncStorage.setItem('settings', JSON.stringify(newSettings));
  };

  const resetStats = async () => {
    Alert.alert(
      'Reset Statistics',
      'Are you sure you want to reset all your game statistics?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            const resetStats = {
              gamesPlayed: 0,
              wins: 0,
              losses: 0,
              draws: 0,
            };
            await AsyncStorage.setItem('gameStats', JSON.stringify(resetStats));
            Alert.alert('Success', 'Statistics have been reset!');
          },
        },
      ]
    );
  };

  const clearData = async () => {
    Alert.alert(
      'Clear All Data',
      'This will reset all settings and statistics. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.clear();
            Alert.alert('Success', 'All data has been cleared!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚙️ Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Game Settings</Text>
        
        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Text style={styles.settingDesc}>Enable game sounds</Text>
          </View>
          <Switch
            value={localSettings.soundEnabled}
            onValueChange={(value) => handleSettingChange('soundEnabled', value)}
            trackColor={{ false: '#767577', true: '#3498db' }}
            thumbColor={localSettings.soundEnabled ? '#f4f3f4' : '#f4f3f4'}
          />
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Default Board Size</Text>
            <Text style={styles.settingDesc}>Preferred board size</Text>
          </View>
          <View style={styles.sizeSelector}>
            {[6, 8, 10].map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.sizeButton,
                  localSettings.boardSize === size && styles.selectedSize,
                ]}
                onPress={() => handleSettingChange('boardSize', size)}
              >
                <Text style={[
                  styles.sizeText,
                  localSettings.boardSize === size && styles.selectedSizeText,
                ]}>
                  {size}×{size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.settingItem}>
          <View>
            <Text style={styles.settingLabel}>Default Difficulty</Text>
            <Text style={styles.settingDesc}>AI difficulty level</Text>
          </View>
          <View style={styles.difficultySelector}>
            {['easy', 'medium', 'hard'].map((diff) => (
              <TouchableOpacity
                key={diff}
                style={[
                  styles.difficultyButton,
                  localSettings.difficulty === diff && styles.selectedDifficulty,
                ]}
                onPress={() => handleSettingChange('difficulty', diff)}
              >
                <Text style={[
                  styles.difficultyText,
                  localSettings.difficulty === diff && styles.selectedDifficultyText,
                ]}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        
        <TouchableOpacity style={styles.actionButton} onPress={resetStats}>
          <Text style={styles.actionButtonText}>📊 Reset Statistics</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, styles.dangerButton]}
          onPress={clearData}
        >
          <Text style={styles.actionButtonText}>🗑️ Clear All Data</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <View style={styles.aboutContainer}>
          <Text style={styles.aboutText}>Dots & Boxes Game</Text>
          <Text style={styles.aboutText}>Version 1.0.0</Text>
          <Text style={styles.aboutText}>Made with ❤️ using React Native</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back to Home</Text>
      </TouchableOpacity>
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
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  section: {
    margin: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  settingDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  sizeSelector: {
    flexDirection: 'row',
    gap: 5,
  },
  sizeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    marginLeft: 5,
  },
  selectedSize: {
    backgroundColor: '#3498db',
  },
  sizeText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  selectedSizeText: {
    color: '#fff',
  },
  difficultySelector: {
    flexDirection: 'row',
    gap: 5,
  },
  difficultyButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    marginLeft: 5,
  },
  selectedDifficulty: {
    backgroundColor: '#e67e22',
  },
  difficultyText: {
    fontSize: 14,
    color: '#2c3e50',
  },
  selectedDifficultyText: {
    color: '#fff',
  },
  actionButton: {
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  dangerButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  aboutContainer: {
    alignItems: 'center',
    padding: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginVertical: 2,
  },
  backButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#2c3e50',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;