import React, { useState, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { Box, Container, CssBaseline, ThemeProvider, createTheme, Alert, Snackbar } from '@mui/material';
import VoiceRecognition from './components/VoiceRecognition/VoiceRecognition';
import GameBoard from './components/GameBoard/GameBoard';
import PlayerDashboard from './components/PlayerDashboard/PlayerDashboard';
import PlayerManagement from './components/PlayerManagement/PlayerManagement';
import { Property } from './types/gameTypes';
import { executeCommand } from './utils/voiceCommandParser';
import { initializeProperties } from './store/gameSlice';
import { THEME_COLORS } from './theme/colors';

// Complete Monopoly properties data
const monopolyProperties: Property[] = [
  // Brown properties
  { id: 1, name: 'Mediterranean Avenue', price: 60, rent: 2, owner: null, position: 1, color: THEME_COLORS.cards },
  { id: 3, name: 'Baltic Avenue', price: 60, rent: 4, owner: null, position: 3, color: THEME_COLORS.cards },

  // Light blue properties
  { id: 6, name: 'Oriental Avenue', price: 100, rent: 6, owner: null, position: 6, color: THEME_COLORS.cards },
  { id: 8, name: 'Vermont Avenue', price: 100, rent: 6, owner: null, position: 8, color: THEME_COLORS.cards },
  { id: 9, name: 'Connecticut Avenue', price: 120, rent: 8, owner: null, position: 9, color: THEME_COLORS.cards },

  // Pink properties
  { id: 11, name: 'St. Charles Place', price: 140, rent: 10, owner: null, position: 11, color: THEME_COLORS.cards },
  { id: 13, name: 'States Avenue', price: 140, rent: 10, owner: null, position: 13, color: THEME_COLORS.cards },
  { id: 14, name: 'Virginia Avenue', price: 160, rent: 12, owner: null, position: 14, color: THEME_COLORS.cards },

  // Orange properties
  { id: 16, name: 'St. James Place', price: 180, rent: 14, owner: null, position: 16, color: THEME_COLORS.cards },
  { id: 18, name: 'Tennessee Avenue', price: 180, rent: 14, owner: null, position: 18, color: THEME_COLORS.cards },
  { id: 19, name: 'New York Avenue', price: 200, rent: 16, owner: null, position: 19, color: THEME_COLORS.cards },

  // Red properties
  { id: 21, name: 'Kentucky Avenue', price: 220, rent: 18, owner: null, position: 21, color: THEME_COLORS.cards },
  { id: 23, name: 'Indiana Avenue', price: 220, rent: 18, owner: null, position: 23, color: THEME_COLORS.cards },
  { id: 24, name: 'Illinois Avenue', price: 240, rent: 20, owner: null, position: 24, color: THEME_COLORS.cards },

  // Yellow properties
  { id: 26, name: 'Atlantic Avenue', price: 260, rent: 22, owner: null, position: 26, color: THEME_COLORS.cards },
  { id: 27, name: 'Ventnor Avenue', price: 260, rent: 22, owner: null, position: 27, color: THEME_COLORS.cards },
  { id: 29, name: 'Marvin Gardens', price: 280, rent: 24, owner: null, position: 29, color: THEME_COLORS.cards },

  // Green properties
  { id: 31, name: 'Pacific Avenue', price: 300, rent: 26, owner: null, position: 31, color: THEME_COLORS.cards },
  { id: 32, name: 'North Carolina Avenue', price: 300, rent: 26, owner: null, position: 32, color: THEME_COLORS.cards },
  { id: 34, name: 'Pennsylvania Avenue', price: 320, rent: 28, owner: null, position: 34, color: THEME_COLORS.cards },

  // Dark blue properties
  { id: 37, name: 'Park Place', price: 350, rent: 35, owner: null, position: 37, color: THEME_COLORS.cards },
  { id: 39, name: 'Boardwalk', price: 400, rent: 50, owner: null, position: 39, color: THEME_COLORS.cards },

  // Railroads
  { id: 5, name: 'Reading Railroad', price: 200, rent: 25, owner: null, position: 5, color: THEME_COLORS.spcl_cards },
  { id: 15, name: 'Pennsylvania Railroad', price: 200, rent: 25, owner: null, position: 15, color: THEME_COLORS.spcl_cards },
  { id: 25, name: 'B&O Railroad', price: 200, rent: 25, owner: null, position: 25, color: THEME_COLORS.spcl_cards },
  { id: 35, name: 'Short Line Railroad', price: 200, rent: 25, owner: null, position: 35, color: THEME_COLORS.spcl_cards },

  // Utilities
  { id: 12, name: 'Electric Company', price: 150, rent: 0, owner: null, position: 12, color: THEME_COLORS.spcl_cards },
  { id: 28, name: 'Water Works', price: 150, rent: 0, owner: null, position: 28, color: THEME_COLORS.spcl_cards },
];

const theme = createTheme({
  palette: {
    primary: {
      main: THEME_COLORS.cards,// Teal (#028391) 
    },
    secondary: {
      main: THEME_COLORS.spcl_cards,// Orange (#FEAE6F)
    },
    background: {
      default: THEME_COLORS.background, // Navy (#01204E)
      paper: '#FFFFFF',
    },
    text: {
      primary: THEME_COLORS.text, // Black (#000000)
      secondary: THEME_COLORS.card_text, // Beige (#F6DCAC)
    },
  },
});

// Separate component for game content
const GameContent: React.FC = () => {
  const dispatch = useDispatch();
  const [notification, setNotification] = useState<string>('');
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    dispatch(initializeProperties(monopolyProperties));
  }, [dispatch]);

  const handleVoiceCommand = (command: string) => {
    console.log('Received command:', command);
    const result = executeCommand(command);
    setNotification(result);
    setShowNotification(true);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        overflow: 'hidden',
        bgcolor: '#f5f5f5'
      }}>
        {/* Left Column - Game Board */}
        <Box sx={{
          width: '75%',
          height: '100vh',
          display: 'flex',
          bgcolor: 'white',
          borderRadius: 2,
          boxShadow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          p: 0.2,
          boxSizing: 'border-box'
        }}>
          <GameBoard />
        </Box>

        {/* Right Column - Controls and Info */}
        <Box sx={{
          width: '25%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          p: 2,
          gap: 2,
          overflow: 'auto',
          bgcolor: THEME_COLORS.cards,
          borderRadius: 2,
          boxShadow: 1,
          borderLeft: 1,
          borderColor: 'divider',
          boxSizing: 'border-box'
        }}>
          <Box sx={{ flex: '0 0 auto' }}>
            <VoiceRecognition 
              onCommand={handleVoiceCommand} 
              notification={notification}
              showNotification={showNotification}
              onCloseNotification={handleCloseNotification}
            />
          </Box>

          <Box sx={{ flex: '0 0 auto' }}>
            <PlayerManagement />
          </Box>

          <Box sx={{ flex: '1 1 auto', overflow: 'auto', minHeight: 0 }}>
            <PlayerDashboard />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

// Main App component
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GameContent />
    </Provider>
  );
};

export default App;

