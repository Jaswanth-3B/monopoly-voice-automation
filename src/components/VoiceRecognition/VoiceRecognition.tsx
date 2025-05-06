import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
  Box, Button, Typography, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, List, ListItem, ListItemText, Tooltip,
  TextField, Tab, Tabs, FormControl, InputLabel, Select, MenuItem,
  SelectChangeEvent, Grid, FormHelperText
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import HelpIcon from '@mui/icons-material/Help';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface VoiceRecognitionProps {
  onCommand: (command: string) => void;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({ onCommand }) => {
  const [correctedText, setCorrectedText] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [tabValue, setTabValue] = useState<number>(0);

  // Form state
  const [operationType, setOperationType] = useState<string>('');
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [targetPlayer, setTargetPlayer] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [property, setProperty] = useState<string>('');
  const [position, setPosition] = useState<string>('');

  // Get players from Redux store
  const players = useSelector((state: RootState) => state.game.players);

  const {
    transcript,
    resetTranscript,
    browserSupportsSpeechRecognition,
    listening
  } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setCorrectedText(transcript);
    }
  }, [transcript]);

  if (!browserSupportsSpeechRecognition) {
    return <Typography>Browser doesn't support speech recognition.</Typography>;
  }

  const handleStartListening = () => {
    resetTranscript();
    setCorrectedText('');
    SpeechRecognition.startListening();
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCorrectedText(e.target.value);
  };

  const handleCommand = () => {
    if (correctedText) {
      onCommand(correctedText);
      resetTranscript();
      setCorrectedText('');
      setIsEditing(false);
    }
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle form submission
  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let command = '';
  
    // Extract player ID from selectedPlayer (format is "Player {name}")
    const selectedPlayerName = selectedPlayer.replace('Player ', '');
    const player = players.find(p => p.name === selectedPlayerName);
    
    if (!player) {
      return; // Don't submit if player not found
    }
  
    switch (operationType) {
      case 'move':
        if (position) {
          command = `Player ${player.id} moves to position ${position}`;
        } else if (property) {
          command = `Move player ${player.id} to ${property}`;
        }
        break;
      case 'pay':
        if (targetPlayer === 'bank') {
          command = `Player ${player.id} pays ${amount} to bank`;
        } else {
          const targetPlayerName = targetPlayer.replace('Player ', '');
          const targetPlayerObj = players.find(p => p.name === targetPlayerName);
          if (targetPlayerObj) {
            command = `Player ${player.id} pays ${amount} to player ${targetPlayerObj.id}`;
          }
        }
        break;
      case 'collect':
        if (targetPlayer === 'bank') {
          command = `Player ${player.id} collects ${amount} from bank`;
        } else {
          const targetPlayerName = targetPlayer.replace('Player ', '');
          const targetPlayerObj = players.find(p => p.name === targetPlayerName);
          if (targetPlayerObj) {
            command = `Player ${player.id} collects ${amount} from player ${targetPlayerObj.id}`;
          }
        }
        break;
      case 'buy':
        command = `Player ${player.id} buys ${property}`;
        break;
    }
  
    if (command) {
      onCommand(command);
      // Reset form
      setOperationType('');
      setSelectedPlayer('');
      setTargetPlayer('');
      setAmount('');
      setProperty('');
      setPosition('');
    }
  };

  // Available commands for help dialog
  const availableCommands = [
    { type: 'MOVE', example: 'Player 1 moves to position 10', description: 'Move a player to a specific position' },
    { type: 'MOVE', example: 'Move player 2 to Go', description: 'Move a player to a named location' },
    { type: 'PAY', example: 'Player 1 pays 200 to player 2', description: 'Make a player pay money to another player' },
    { type: 'PAY', example: 'Player 3 pays 150 to bank', description: 'Make a player pay money to the bank' },
    { type: 'COLLECT', example: 'Player 2 collects 200 from bank', description: 'Player receives money from the bank' },
    { type: 'COLLECT', example: 'Player 1 collects 50 from player 3', description: 'Player receives money from another player' },
    { type: 'BUY', example: 'Player 1 buys Mediterranean Avenue', description: 'Player purchases a property' },
  ];

  // Replace the renderOperationForm function with this updated version
  const renderOperationForm = () => {
    return (
      <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Operation Type</InputLabel>
              <Select
                value={operationType}
                label="Operation Type"
                onChange={(e: SelectChangeEvent) => {
                  setOperationType(e.target.value);
                  setAmount('');
                  setProperty('');
                  setPosition('');
                }}
              >
                <MenuItem value="move">Move Player</MenuItem>
                <MenuItem value="pay">Pay Money</MenuItem>
                <MenuItem value="collect">Collect Money</MenuItem>
                <MenuItem value="buy">Buy Property</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Player</InputLabel>
              <Select
                value={selectedPlayer}
                label="Player"
                onChange={(e: SelectChangeEvent) => setSelectedPlayer(e.target.value)}
              >
                {players.map(player => (
                  <MenuItem key={player.id} value={`Player ${player.name}`}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Conditional fields based on operation type */}
          {operationType === 'move' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Position Number"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  type="number"
                  helperText="Enter a position number (0-39)"
                />
                <TextField
                  fullWidth
                  label="Property Name"
                  value={property}
                  onChange={(e) => setProperty(e.target.value)}
                  helperText="Or enter a property name"
                />
              </Box>
              <FormHelperText>
                Fill either Position Number OR Property Name
              </FormHelperText>
            </Box>
          )}

          {(operationType === 'pay' || operationType === 'collect') && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                required
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
              />
              <FormControl fullWidth required>
                <InputLabel>{operationType === 'pay' ? 'Pay To' : 'Collect From'}</InputLabel>
                <Select
                  value={targetPlayer}
                  label={operationType === 'pay' ? 'Pay To' : 'Collect From'}
                  onChange={(e: SelectChangeEvent) => setTargetPlayer(e.target.value)}
                >
                  <MenuItem value="bank">Bank</MenuItem>
                  {players.map(player => (
                    selectedPlayer !== `Player ${player.name}` && (
                      <MenuItem key={player.id} value={`Player ${player.name}`}>
                        {player.name}
                      </MenuItem>
                    )
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          {operationType === 'buy' && (
            <TextField
              fullWidth
              required
              label="Property Name"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!operationType || !selectedPlayer}
          >
            Execute Operation
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2 }}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Game Operations</Typography>
          <Tooltip title="Show available commands">
            <IconButton onClick={() => setHelpOpen(true)} color="primary">
              <HelpIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <Tabs value={tabValue} onChange={handleTabChange} aria-label="operation methods">
          <Tab label="Quick Form" />
          <Tab label="Voice Command" />
        </Tabs>

        {tabValue === 0 ? (
          renderOperationForm()
        ) : (
          <>
            {isEditing ? (
              <TextField
                fullWidth
                value={correctedText}
                onChange={handleTextChange}
                placeholder="Type or edit your command..."
                variant="outlined"
                multiline
                rows={2}
              />
            ) : (
              <Box
                p={2}
                border={1}
                borderColor="grey.300"
                borderRadius={1}
                minHeight="60px"
                display="flex"
                alignItems="center"
                sx={{ cursor: 'text', position: 'relative' }}
                onClick={toggleEditing}
              >
                <Typography color={correctedText ? 'textPrimary' : 'textSecondary'}>
                  {correctedText || 'Speak something...'}
                </Typography>
                {!correctedText && (
                  <Tooltip title="Click to edit">
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            )}

            <Box display="flex" gap={2} alignItems="center">
              <Tooltip title={listening ? "Listening..." : "Start listening"}>
                <IconButton
                  color={listening ? "error" : "primary"}
                  onClick={handleStartListening}
                  sx={{
                    width: 56,
                    height: 56,
                    border: listening ? '2px solid #f44336' : '2px solid #1976d2',
                    animation: listening ? 'pulse 1.5s infinite' : 'none',
                    '@keyframes pulse': {
                      '0%': { boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)' },
                      '70%': { boxShadow: '0 0 0 10px rgba(244, 67, 54, 0)' },
                      '100%': { boxShadow: '0 0 0 0 rgba(244, 67, 54, 0)' },
                    },
                  }}
                >
                  <MicIcon />
                </IconButton>
              </Tooltip>

              <Button
                variant="outlined"
                onClick={() => {
                  resetTranscript();
                  setCorrectedText('');
                }}
              >
                Reset
              </Button>

              <Button
                variant="contained"
                color="success"
                onClick={handleCommand}
                disabled={!correctedText}
              >
                Execute Command
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Help Dialog */}
      <Dialog open={helpOpen} onClose={() => setHelpOpen(false)} maxWidth="md">
        <DialogTitle>Available Commands</DialogTitle>
        <DialogContent>
          <Typography paragraph>
            Use the following command formats to control the Monopoly game:
          </Typography>
          <List>
            {availableCommands.map((cmd, index) => (
              <ListItem key={index} divider={index < availableCommands.length - 1}>
                <ListItemText
                  primary={cmd.example}
                  secondary={cmd.description}
                  primaryTypographyProps={{ fontWeight: 'bold' }}
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            You can use either the quick form or voice commands to perform these operations.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHelpOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default VoiceRecognition;