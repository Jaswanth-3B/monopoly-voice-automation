import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box, Typography, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Avatar, Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { addPlayer } from '../../store/gameSlice';

// Token icons and colors
const playerTokens = [
    { id: 'car', icon: '🚗', color: '#FF5722' },
    { id: 'ship', icon: '🚢', color: '#2196F3' },
    { id: 'hat', icon: '🎩', color: '#9C27B0' },
    { id: 'dog', icon: '🐕', color: '#795548' },
    { id: 'iron', icon: '👞', color: '#607D8B' },
    { id: 'thimble', icon: '🧵', color: '#00BCD4' },
    { id: 'wheelbarrow', icon: '🛒', color: '#4CAF50' },
    { id: 'cannon', icon: '💰', color: '#FFC107' },
];

const PlayerManagement: React.FC = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [selectedToken, setSelectedToken] = useState(playerTokens[0]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleAddPlayer = () => {
        if (playerName.trim()) {
            dispatch(addPlayer({
                id: Date.now(),
                name: playerName,
                money: 1500,
                position: 0,
                properties: [],
                cards: [],
                token: selectedToken.id,
                tokenIcon: selectedToken.icon,
                color: selectedToken.color
            }));
            setPlayerName('');
            handleClose();
        }
    };

    return (
        <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Players</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpen}
                >
                    Add Player
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Add New Player</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Player Name"
                        fullWidth
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        sx={{ mb: 2 }}
                    />

                    <Typography variant="subtitle1" gutterBottom>Select Token:</Typography>
                    
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1 }}>
                      {playerTokens.map((token) => (
                        <Box key={token.id}>
                          <IconButton
                            onClick={() => setSelectedToken(token)}
                            sx={{
                              bgcolor: selectedToken.id === token.id ? token.color + '40' : 'transparent',
                              border: selectedToken.id === token.id ? `2px solid ${token.color}` : 'none',
                              fontSize: '1.5rem'
                            }}
                          >
                            {token.icon}
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleAddPlayer} variant="contained">
                        Add Player
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PlayerManagement;