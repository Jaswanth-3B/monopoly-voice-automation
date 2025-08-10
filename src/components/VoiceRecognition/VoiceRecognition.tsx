import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import {
  Box, Button, Typography, Paper, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, List, ListItem, ListItemText, Tooltip,
  TextField, Tab, Tabs, FormControl, InputLabel, Select, MenuItem,
  SelectChangeEvent, Collapse, Alert
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import HelpIcon from '@mui/icons-material/Help';
import EditIcon from '@mui/icons-material/Edit';
import RestartAltIcon from '@mui/icons-material/RestartAlt'; // <-- 1. IMPORT THE NEW ICON
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface VoiceRecognitionProps {
  onCommand: (command: string) => void;
  notification: string;
  showNotification: boolean;
  onCloseNotification: () => void;
}

const VoiceRecognition: React.FC<VoiceRecognitionProps> = ({
  onCommand,
  notification,
  showNotification,
  onCloseNotification
}) => {
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
  
  // 2. ADD THE RESET FUNCTION
  const handleResetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? All saved data will be lost.')) {
      localStorage.removeItem('monopolyGameState');
      window.location.reload();
    }
  };

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

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let command = '';

    const player = players.find(p => p.name === selectedPlayer);
    if (!player) return;

    switch (operationType) {
      case 'move':
        if (position) {
          command = `Player ${player.name} moves to position ${position}`;
        } else if (property) {
          command = `Move player ${player.name} to ${property}`;
        }
        break;
      case 'pay':
        if (targetPlayer) {
          command = `Player ${player.name} pays ${amount} to ${targetPlayer}`;
        }
        break;
      case 'collect':
        if (targetPlayer) {
            command = `Player ${player.name} collects ${amount} from ${targetPlayer}`;
        }
        break;
      case 'buy':
        command = `Player ${player.name} buys ${property}`;
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

  const availableCommands = [
    { type: 'MOVE', example: 'Player Alice moves to position 10', description: 'Move a player to a specific position' },
    { type: 'MOVE', example: 'Move player Bob to Go', description: 'Move a player to a named location' },
    { type: 'PAY', example: 'Player Alice pays 200 to player Bob', description: 'Make a player pay money to another player' },
    { type: 'PAY', example: 'Player Charlie pays 150 to bank', description: 'Make a player pay money to the bank' },
    { type: 'COLLECT', example: 'Player Bob collects 200 from bank', description: 'Player receives money from the bank' },
    { type: 'COLLECT', example: 'Player Alice collects 50 from player Charlie', description: 'Player receives money from another player' },
    { type: 'BUY', example: 'Player Alice buys Boardwalk', description: 'Player purchases a property' },
  ];

  const renderOperationForm = () => {
    return (
      <Box component="form" onSubmit={handleFormSubmit} sx={{ mt: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
           <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
            <FormControl fullWidth required size="small">
              <InputLabel sx={{ fontSize: '0.75rem' }}>Operation Type</InputLabel>
              <Select
                value={operationType}
                label="Operation Type"
                onChange={(e: SelectChangeEvent) => {
                  setOperationType(e.target.value);
                  setAmount('');
                  setProperty('');
                  setPosition('');
                }}
                sx={{
                  fontSize: '0.75rem',
                  height: '2.2rem',
                  '& .MuiSelect-select': {
                    py: 0.5
                  }
                }}
              >
                <MenuItem value="move" sx={{ fontSize: '0.75rem' }}>Move Player</MenuItem>
                <MenuItem value="pay" sx={{ fontSize: '0.75rem' }}>Pay Money</MenuItem>
                <MenuItem value="collect" sx={{ fontSize: '0.75rem' }}>Collect Money</MenuItem>
                <MenuItem value="buy" sx={{ fontSize: '0.75rem' }}>Buy Property</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required size="small">
              <InputLabel sx={{ fontSize: '0.75rem' }}>Player</InputLabel>
              <Select
                value={selectedPlayer}
                label="Player"
                onChange={(e: SelectChangeEvent) => setSelectedPlayer(e.target.value)}
                sx={{
                  fontSize: '0.75rem',
                  height: '2.2rem',
                  '& .MuiSelect-select': {
                    py: 0.5
                  }
                }}
              >
                {players.map(player => (
                  <MenuItem key={player.id} value={player.name} sx={{ fontSize: '0.75rem' }}>
                    {player.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {operationType === 'move' && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                size="small"
                label="Position Number"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                type="number"
                InputProps={{
                  inputProps: { min: 0, max: 39 },
                  sx: {
                    fontSize: '0.75rem',
                    height: '2.2rem'
                  }
                }}
                InputLabelProps={{
                  sx: { fontSize: '0.75rem' },
                  shrink: true
                }}
              />
              <TextField
                fullWidth
                size="small"
                label="Property Name"
                value={property}
                onChange={(e) => setProperty(e.target.value)}
                InputProps={{
                  sx: {
                    fontSize: '0.75rem',
                    height: '2.2rem'
                  }
                }}
                InputLabelProps={{
                  sx: { fontSize: '0.75rem' },
                  shrink: true
                }}
              />
            </Box>
          )}

          {(operationType === 'pay' || operationType === 'collect') && (
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
              <TextField
                fullWidth
                required
                size="small"
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                InputProps={{
                  inputProps: { min: 1 },
                  sx: {
                    fontSize: '0.75rem',
                    height: '2.2rem'
                  }
                }}
                InputLabelProps={{
                  sx: { fontSize: '0.75rem' },
                  shrink: true
                }}
              />
              <FormControl fullWidth required size="small">
                <InputLabel sx={{ fontSize: '0.75rem' }}>
                  {operationType === 'pay' ? 'Pay To' : 'Collect From'}
                </InputLabel>
                <Select
                  value={targetPlayer}
                  label={operationType === 'pay' ? 'Pay To' : 'Collect From'}
                  onChange={(e: SelectChangeEvent) => setTargetPlayer(e.target.value)}
                  sx={{
                    fontSize: '0.75rem',
                    height: '2.2rem',
                    '& .MuiSelect-select': {
                      py: 0.5
                    }
                  }}
                >
                  <MenuItem value="bank" sx={{ fontSize: '0.75rem' }}>Bank</MenuItem>
                  {players.map(player => (
                    selectedPlayer !== player.name && (
                      <MenuItem key={player.id} value={player.name} sx={{ fontSize: '0.75rem' }}>
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
              size="small"
              label="Property Name"
              value={property}
              onChange={(e) => setProperty(e.target.value)}
              InputProps={{
                sx: {
                  fontSize: '0.75rem',
                  height: '2.2rem'
                }
              }}
              InputLabelProps={{
                sx: { fontSize: '0.75rem' },
                shrink: true
              }}
            />
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!operationType || !selectedPlayer}
            sx={{
              fontSize: '0.75rem',
              height: '2.2rem',
              mt: 1
            }}
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
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 0.5
        }}>
          <Typography variant="h6" sx={{ fontSize: '0.85rem' }}>
            Game Operations
          </Typography>
          <Box>
            {/* 3. ADD THE NEW ICON BUTTON HERE */}
            <Tooltip title="Reset Game">
              <IconButton size="small" onClick={handleResetGame}>
                <RestartAltIcon sx={{ fontSize: '0.85rem' }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="View available commands">
              <IconButton size="small" onClick={() => setHelpOpen(true)}>
                <HelpIcon sx={{ fontSize: '0.75rem' }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Box sx={{ mb: 0.5 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              minHeight: 24,
              '& .MuiTab-root': {
                minHeight: 24,
                padding: '2px 8px',
                fontSize: '0.7rem'
              }
            }}
          >
            <Tab label="QUICK FORM" />
            <Tab label="VOICE COMMAND" />
          </Tabs>
        </Box>

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

        <Collapse in={showNotification}>
          <Alert
            onClose={onCloseNotification}
            severity="info"
            sx={{
              mt: 2,
              fontSize: '0.85rem',
              '& .MuiAlert-message': {
                fontSize: '0.85rem'
              }
            }}
          >
            {notification}
          </Alert>
        </Collapse>
      </Box>

      <Dialog
        open={helpOpen}
        onClose={() => setHelpOpen(false)}
        maxWidth="sm"
        fullWidth
      >
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