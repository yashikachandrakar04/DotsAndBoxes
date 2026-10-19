import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [gameStats, setGameStats] = useState({
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    draws: 0,
  });

  const [settings, setSettings] = useState({
    boardSize: 6,
    difficulty: 'medium',
    soundEnabled: true,
  });

  const updateStats = async (result) => {
    const newStats = { ...gameStats };
    newStats.gamesPlayed += 1;
    
    if (result === 'win') newStats.wins += 1;
    else if (result === 'loss') newStats.losses += 1;
    else if (result === 'draw') newStats.draws += 1;
    
    setGameStats(newStats);
    await AsyncStorage.setItem('gameStats', JSON.stringify(newStats));
  };

  const loadStats = async () => {
    try {
      const stats = await AsyncStorage.getItem('gameStats');
      if (stats) {
        setGameStats(JSON.parse(stats));
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameStats,
        updateStats,
        loadStats,
        settings,
        setSettings,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};