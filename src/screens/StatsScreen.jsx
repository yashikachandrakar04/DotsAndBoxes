import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useGame } from '../context/GameContext';

const StatsScreen = ({ navigation }) => {
  const { gameStats } = useGame();

  const stats = [
    { label: 'Games Played', value: gameStats.gamesPlayed, icon: '🎮' },
    { label: 'Wins', value: gameStats.wins, icon: '🏆' },
    { label: 'Losses', value: gameStats.losses, icon: '💔' },
    { label: 'Draws', value: gameStats.draws, icon: '🤝' },
  ];

  const winRate = gameStats.gamesPlayed > 0
    ? ((gameStats.wins / gameStats.gamesPlayed) * 100).toFixed(1)
    : 0;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 Game Statistics</Text>
      </View>

      <View style={styles.winRateContainer}>
        <Text style={styles.winRateLabel}>Win Rate</Text>
        <Text style={styles.winRateValue}>{winRate}%</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${Math.min(winRate, 100)}%` },
            ]}
          />
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={styles.statIcon}>{stat.icon}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.achievementsContainer}>
        <Text style={styles.sectionTitle}>🏅 Achievements</Text>
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>🎯</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>First Win</Text>
            <Text style={styles.achievementDesc}>
              {gameStats.wins > 0 ? '✅ Unlocked' : '🔒 Play and win your first game'}
            </Text>
          </View>
        </View>
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>⭐</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>10 Wins</Text>
            <Text style={styles.achievementDesc}>
              {gameStats.wins >= 10 ? '✅ Unlocked' : `🔒 ${10 - gameStats.wins} wins remaining`}
            </Text>
          </View>
        </View>
        <View style={styles.achievement}>
          <Text style={styles.achievementIcon}>👑</Text>
          <View style={styles.achievementInfo}>
            <Text style={styles.achievementTitle}>Master Player</Text>
            <Text style={styles.achievementDesc}>
              {gameStats.wins >= 50 ? '✅ Unlocked' : `🔒 ${50 - gameStats.wins} wins remaining`}
            </Text>
          </View>
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
  winRateContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  winRateLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  winRateValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
    marginVertical: 5,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#27ae60',
    borderRadius: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIcon: {
    fontSize: 30,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginVertical: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  achievementsContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  achievementIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  achievementDesc: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  backButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#3498db',
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatsScreen;