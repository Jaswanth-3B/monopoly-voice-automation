import React, { useState, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { Box, Container, CssBaseline, ThemeProvider, createTheme, Alert, Snackbar, Stack } from '@mui/material';
import VoiceRecognition from './components/VoiceRecognition/VoiceRecognition';
import GameBoard from './components/GameBoard/GameBoard';
import PlayerDashboard from './components/PlayerDashboard/PlayerDashboard';
import PlayerManagement from './components/PlayerManagement/PlayerManagement';
import { Property } from './types/gameTypes';
import { executeCommand } from './utils/voiceCommandParser';
import { initializeProperties } from './store/gameSlice';

// Complete Monopoly properties data
const monopolyProperties: Property[] = [
  // Brown properties
  { id: 1, name: 'Mediterranean Avenue', price: 60, rent: 2, owner: null, position: 1, color: '#955436' },
  { id: 3, name: 'Baltic Avenue', price: 60, rent: 4, owner: null, position: 3, color: '#955436' },

  // Light blue properties
  { id: 6, name: 'Oriental Avenue', price: 100, rent: 6, owner: null, position: 6, color: '#aae0fa' },
  { id: 8, name: 'Vermont Avenue', price: 100, rent: 6, owner: null, position: 8, color: '#aae0fa' },
  { id: 9, name: 'Connecticut Avenue', price: 120, rent: 8, owner: null, position: 9, color: '#aae0fa' },

  // Pink properties
  { id: 11, name: 'St. Charles Place', price: 140, rent: 10, owner: null, position: 11, color: '#d93a96' },
  { id: 13, name: 'States Avenue', price: 140, rent: 10, owner: null, position: 13, color: '#d93a96' },
  { id: 14, name: 'Virginia Avenue', price: 160, rent: 12, owner: null, position: 14, color: '#d93a96' },

  // Orange properties
  { id: 16, name: 'St. James Place', price: 180, rent: 14, owner: null, position: 16, color: '#f7941d' },
  { id: 18, name: 'Tennessee Avenue', price: 180, rent: 14, owner: null, position: 18, color: '#f7941d' },
  { id: 19, name: 'New York Avenue', price: 200, rent: 16, owner: null, position: 19, color: '#f7941d' },

  // Red properties
  { id: 21, name: 'Kentucky Avenue', price: 220, rent: 18, owner: null, position: 21, color: '#ed1b24' },
  { id: 23, name: 'Indiana Avenue', price: 220, rent: 18, owner: null, position: 23, color: '#ed1b24' },
  { id: 24, name: 'Illinois Avenue', price: 240, rent: 20, owner: null, position: 24, color: '#ed1b24' },

  // Yellow properties
  { id: 26, name: 'Atlantic Avenue', price: 260, rent: 22, owner: null, position: 26, color: '#fef200' },
  { id: 27, name: 'Ventnor Avenue', price: 260, rent: 22, owner: null, position: 27, color: '#fef200' },
  { id: 29, name: 'Marvin Gardens', price: 280, rent: 24, owner: null, position: 29, color: '#fef200' },

  // Green properties
  { id: 31, name: 'Pacific Avenue', price: 300, rent: 26, owner: null, position: 31, color: '#1fb25a' },
  { id: 32, name: 'North Carolina Avenue', price: 300, rent: 26, owner: null, position: 32, color: '#1fb25a' },
  { id: 34, name: 'Pennsylvania Avenue', price: 320, rent: 28, owner: null, position: 34, color: '#1fb25a' },

  // Dark blue properties
  { id: 37, name: 'Park Place', price: 350, rent: 35, owner: null, position: 37, color: '#0072bb' },
  { id: 39, name: 'Boardwalk', price: 400, rent: 50, owner: null, position: 39, color: '#0072bb' },

  // Railroads
  { id: 5, name: 'Reading Railroad', price: 200, rent: 25, owner: null, position: 5, color: '#0e0e0e' },
  { id: 15, name: 'Pennsylvania Railroad', price: 200, rent: 25, owner: null, position: 15, color: '#0e0e0e' },
  { id: 25, name: 'B&O Railroad', price: 200, rent: 25, owner: null, position: 25, color: '#0e0e0e' },
  { id: 35, name: 'Short Line Railroad', price: 200, rent: 25, owner: null, position: 35, color: '#0e0e0e' },

  // Utilities
  { id: 12, name: 'Electric Company', price: 150, rent: 0, owner: null, position: 12, color: '#FFC107' },
  { id: 28, name: 'Water Works', price: 150, rent: 0, owner: null, position: 28, color: '#FFC107' },
];

const theme = createTheme();

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
      <Container maxWidth="xl" sx={{ height: '100vh', padding: '16px', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2 }}>
          <VoiceRecognition onCommand={handleVoiceCommand} />
        </Box>
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexGrow: 1,
          height: 'calc(100vh - 120px)',
          overflow: 'hidden'
        }}>
          <Box sx={{
            flex: { xs: '1 1 auto', md: '0 0 auto' },
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: { xs: 'auto', md: '100%' },
            minHeight: { xs: '60vh', md: 'auto' }
          }}>
            <GameBoard />
          </Box>

          <Box sx={{
            flex: { xs: '1 1 auto', md: '0 0 350px' },
            overflow: 'auto',
            ml: { md: 3 },
            mt: { xs: 2, md: 0 },
            height: '100%'
          }}>
            <Stack spacing={3}>
              <PlayerManagement />
              <PlayerDashboard />
            </Stack>
          </Box>
        </Box>
        <Snackbar
          open={showNotification}
          autoHideDuration={6000}
          onClose={handleCloseNotification}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseNotification} severity="info">
            {notification}
          </Alert>
        </Snackbar>
      </Container>
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

