import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {
    Box, Typography, Button, TextField, Dialog, DialogTitle,
    DialogContent, DialogActions, IconButton, Avatar, Grid
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { addPlayer } from '../../store/gameSlice';
import { THEME_COLORS } from '../../theme/colors';

// Token icons and colors
// Update the player tokens array with new colors
const playerTokens = [
    { id: 'car', icon: '🚗', color: THEME_COLORS.text },
    { id: 'ship', icon: '🚢', color: THEME_COLORS.text },
    { id: 'hat', icon: '🎩', color: THEME_COLORS.card_text },
    { id: 'dog', icon: '🐕', color: THEME_COLORS.text },
    { id: 'iron', icon: '👞', color: THEME_COLORS.card_text },
    { id: 'thimble', icon: '🧵', color: THEME_COLORS.text },
    { id: 'wheelbarrow', icon: '🛒', color: THEME_COLORS.card_text },
    { id: 'cannon', icon: '💰', color: THEME_COLORS.text },
];

const PlayerManagement: React.FC = () => {
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [playerName, setPlayerName] = useState('');
    const [selectedToken, setSelectedToken] = useState(playerTokens[0]);
    const [error, setError] = useState('');

    const handleOpen = () => {
        setOpen(true);
        setError('');
        setPlayerName('');
    };

    const handleClose = () => {
        setOpen(false);
        setError('');
        setPlayerName('');
    };

    const handleAddPlayer = () => {
        if (!playerName.trim()) {
            setError('Player name is required');
            return;
        }

        dispatch(addPlayer({
            name: playerName,
            money: 1500,
            position: 0,
            token: selectedToken.id,
            tokenIcon: selectedToken.icon,
            color: selectedToken.color
        }));
        handleClose();
    };

    return (
        <Box sx={{ mb: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ fontSize: '0.85rem' }}>Players</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon sx={{ fontSize: '0.85rem' }} />}
                    onClick={handleOpen}
                    sx={{
                        fontSize: '0.75rem',
                        py: 0.5,
                        px: 1
                    }}
                >
                    ADD PLAYER
                </Button>
            </Box>

            <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
                <DialogTitle sx={{
                    fontSize: '1.1rem',
                    py: 1.5,
                    borderBottom: 1,
                    borderColor: 'divider'
                }}>
                    Add New Player
                </DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        label="Player Name"
                        fullWidth
                        value={playerName}
                        onChange={(e) => {
                            setPlayerName(e.target.value);
                            setError('');
                        }}
                        error={!!error}
                        // helperText={error || 'Enter the player\'s name'}
                        sx={{
                            mb: 2,
                            '& .MuiInputLabel-root': {
                                fontSize: '0.875rem'
                            },
                            '& .MuiInputBase-input': {
                                fontSize: '0.875rem',
                                py: 2
                            },
                            '& .MuiFormHelperText-root': {
                                fontSize: '0.75rem',
                                mt: 0.5
                            }
                        }}
                    />

                    <Typography variant="subtitle1" sx={{
                        fontSize: '0.875rem',
                        mb: 1,
                        fontWeight: 500
                    }}>
                        Select Token:
                    </Typography>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: 1,
                        mb: 1
                    }}>
                        {playerTokens.map((token) => (
                            <Box key={token.id}>
                                <IconButton
                                    onClick={() => setSelectedToken(token)}
                                    sx={{
                                        bgcolor: selectedToken.id === token.id ? token.color + '40' : 'transparent',
                                        border: selectedToken.id === token.id ? `2px solid ${token.color}` : '1px solid #e0e0e0',
                                        fontSize: '1.2rem',
                                        p: 1.5,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            bgcolor: token.color + '20',
                                            transform: 'scale(1.05)'
                                        }
                                    }}
                                >
                                    {token.icon}
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, pt: 1, borderTop: 1, borderColor: 'divider' }}>
                    <Button
                        onClick={handleClose}
                        sx={{
                            fontSize: '0.875rem',
                            px: 2
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddPlayer}
                        variant="contained"
                        disabled={!playerName.trim()}
                        sx={{
                            fontSize: '0.875rem',
                            px: 3
                        }}
                    >
                        Add Player
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PlayerManagement;