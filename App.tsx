import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { GameProvider } from './src/context/GameContext';

const App = () => {
  return (
    <GameProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GameProvider>
  );
};

export default App;
