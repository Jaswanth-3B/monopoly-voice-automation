import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import GameBoard from '../components/GameBoard/GameBoard';
import PlayerDashboard from '../components/PlayerDashboard/PlayerDashboard';
import PlayerManagement from '../components/PlayerManagement/PlayerManagement';
import VoiceRecognition from '../components/VoiceRecognition/VoiceRecognition';
import { initializeProperties } from '../store/gameSlice';
import { THEME_COLORS } from '../theme/colors';
import { monopolyProperties } from '../data/monopolyProperties';

const GameContent: React.FC = () => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    dispatch(initializeProperties(monopolyProperties));
  }, [dispatch]);

  const handleVoiceCommand = (command: string) => {
    console.log('Received command:', command);
    // Execute command logic here
    setNotification(`Command received: ${command}`);
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <View style={styles.container}>
      {/* Left Column - Game Board */}
      <View style={styles.boardContainer}>
        <GameBoard />
      </View>

      {/* Right Column - Controls and Info */}
      <View style={styles.controlsContainer}>
        <View style={styles.voiceContainer}>
          <VoiceRecognition 
            onCommand={handleVoiceCommand} 
            notification={notification}
            showNotification={showNotification}
            onCloseNotification={handleCloseNotification}
          />
        </View>

        <View style={styles.playerManagementContainer}>
          <PlayerManagement />
        </View>

        <View style={styles.playerDashboardContainer}>
          <PlayerDashboard />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: THEME_COLORS.background,
  },
  boardContainer: {
    flex: 3,
    backgroundColor: 'white',
    borderRadius: 8,
    margin: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.cards,
    borderRadius: 8,
    margin: 4,
    padding: 8,
    gap: 8,
  },
  voiceContainer: {
    marginBottom: 8,
  },
  playerManagementContainer: {
    marginBottom: 8,
  },
  playerDashboardContainer: {
    flex: 1,
  },
});

export default GameContent;