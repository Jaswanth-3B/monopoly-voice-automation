import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Property } from '../../types/gameTypes';

// Complete set of Monopoly properties
const BOARD_SIZE = 11; // 11x11 grid for the board

interface GameBoardProps {
    properties: Property[];
}

const GameBoard: React.FC = () => {
    const players = useSelector((state: RootState) => state.game.players);
    const properties = useSelector((state: RootState) => state.game.properties);

    // Helper function to get property at a specific position
    const getPropertyAtPosition = (position: number) => {
        return properties.find(p => p.position === position);
    };

    // Helper function to get players at a specific position
    const getPlayersAtPosition = (position: number) => {
        return players.filter(p => p.position === position);
    };

    // Render a board cell
    const renderBoardCell = (position: number) => {
        const property = getPropertyAtPosition(position);
        const playersHere = getPlayersAtPosition(position);

        // Special cells (corners, chance, community chest, etc.)
        let cellContent;
        let cellColor = 'white';
        let cellLabel = '';

        if (position === 0) {
            cellLabel = 'GO';
            cellColor = '#E6F7FF';
        } else if (position === 10) {
            cellLabel = 'JAIL';
            cellColor = '#FFEBEE';
        } else if (position === 20) {
            cellLabel = 'FREE PARKING';
            cellColor = '#FFF8E1';
        } else if (position === 30) {
            cellLabel = 'GO TO JAIL';
            cellColor = '#FFEBEE';
        } else if ([2, 17, 33].includes(position)) {
            cellLabel = 'COMMUNITY CHEST';
            cellColor = '#E8F5E9';
        } else if ([7, 22, 36].includes(position)) {
            cellLabel = 'CHANCE';
            cellColor = '#FFF3E0';
        } else if (position === 4) {
            cellLabel = 'INCOME TAX';
            cellColor = '#FFEBEE';
        } else if (position === 38) {
            cellLabel = 'LUXURY TAX';
            cellColor = '#FFEBEE';
        } else if (property) {
            cellLabel = property.name;
            cellColor = property.color || 'white';
        }

        return (
            // In the renderBoardCell function, update the Paper component's sx prop:
            <Paper
                elevation={3}
                sx={{
                    p: 1,
                    height: '100%', // Changed from fixed 80px to responsive
                    width: '100%',
                    backgroundColor: property?.owner !== undefined && property?.owner !== null ? `${cellColor}80` : cellColor,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: property?.owner !== undefined && property?.owner !== null ? `2px solid ${players.find(p => p.id === property.owner)?.color || '#ccc'}` : 'none',
                    fontSize: { xs: '0.6rem', sm: '0.7rem' }, // Responsive font size
                    overflow: 'hidden'
                }}
            >
                <Typography variant="caption" noWrap sx={{ fontSize: '0.7rem' }}>
                    {cellLabel}
                </Typography>

                {property && (
                    <Typography variant="caption" sx={{ fontSize: '0.7rem' }}>
                        ${property.price}
                    </Typography>
                )}

                {playersHere.length > 0 && (
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.5,
                        maxWidth: '100%',
                        justifyContent: 'center'
                    }}>
                        {playersHere.map(player => (
                            <Avatar
                                key={player.id}
                                sx={{
                                    width: 24,
                                    height: 24,
                                    bgcolor: player.color || '#ccc',
                                    fontSize: '0.8rem'
                                }}
                            >
                                {player.tokenIcon || player.name.charAt(0)}
                            </Avatar>
                        ))}
                    </Box>
                )}
            </Paper>
        );
    };

    // Create the board grid
    const renderBoard = () => {
        const board = [];

        // Top row (positions 20-30)
        const topRow = [];
        for (let i = 20; i <= 30; i++) {
            topRow.push(
                <Box key={`cell-${i}`} sx={{ gridColumn: 31 - i, gridRow: 1 }}>
                    {renderBoardCell(i)}
                </Box>
            );
        }

        // Right column (positions 31-39)
        const rightColumn = [];
        for (let i = 31; i <= 39; i++) {
            rightColumn.push(
                <Box key={`cell-${i}`} sx={{ gridColumn: 11, gridRow: i - 29 }}>
                    {renderBoardCell(i)}
                </Box>
            );
        }

        // Bottom row (positions 10-19)
        const bottomRow = [];
        for (let i = 10; i <= 19; i++) {
            bottomRow.push(
                <Box key={`cell-${i}`} sx={{ gridColumn: i - 9, gridRow: 11 }}>
                    {renderBoardCell(i)}
                </Box>
            );
        }

        // Left column (positions 0-9)
        const leftColumn = [];
        for (let i = 0; i <= 9; i++) {
            leftColumn.push(
                <Box key={`cell-${i}`} sx={{ gridColumn: 1, gridRow: 11 - i }}>
                    {renderBoardCell(i)}
                </Box>
            );
        }

        return [...topRow, ...rightColumn, ...bottomRow, ...leftColumn];
    };
    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Typography variant="h6" gutterBottom>Game Board</Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
                    gap: 0.5,
                    p: 2,
                    backgroundColor: '#e1f5fe',
                    borderRadius: 2,
                    aspectRatio: '1/1',
                    width: '100%',
                    maxWidth: 'min(700px, 90vh)', // Responsive sizing based on viewport height
                    maxHeight: 'min(700px, 90vh)', // Ensure it's not too large
                    boxSizing: 'border-box'
                }}
            >
                {renderBoard()}

                {/* Center area for game logo or info */}
                <Box
                    sx={{
                        gridColumn: '2 / 11',
                        gridRow: '2 / 11',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        p: 2
                    }}
                >
                    <Typography variant="h4" align="center" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        MONOPOLY
                        <Typography variant="subtitle1" align="center">
                            Voice Automation
                        </Typography>
                    </Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default GameBoard;