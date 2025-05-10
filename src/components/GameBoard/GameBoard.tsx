import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Property, AnimationState } from '../../types/gameTypes';
import { THEME_COLORS } from '../../theme/colors';

// Complete set of Monopoly properties
const BOARD_SIZE = 11; // 11x11 grid for the board

// Animation keyframes for player movement
const bounceAnimation = {
    '@keyframes bounce': {
        '0%': {
            transform: 'translateY(0) scale(1)',
        },
        '50%': {
            transform: 'translateY(-10px) scale(1.1)',
        },
        '100%': {
            transform: 'translateY(0) scale(1)',
        },
    },
};

// Paper texture styles
const paperTexture = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paperFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.4' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paperFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.15,
    pointerEvents: 'none',
    zIndex: 1,
    mixBlendMode: 'multiply',
};

// Enhanced noise texture styles
const noiseTexture = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.2,
    pointerEvents: 'none',
    zIndex: 2,
    mixBlendMode: 'overlay',
};

// Vignette effect
const vignetteEffect = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
    pointerEvents: 'none',
    zIndex: 3,
};

// Generate random animation parameters for each card
const getRandomAnimationParams = () => {
    const delay = Math.random() * 2;
    const duration = 3 + Math.random() * 2; // Random duration between 3-5s
    const xOffset = (Math.random() - 0.5) * 4; // Random X movement
    const yOffset = (Math.random() - 0.5) * 4; // Random Y movement
    const rotation = (Math.random() - 0.5) * 2; // Random rotation
    return { delay, duration, xOffset, yOffset, rotation };
};

// Tiny5 font styles
const tiny5FontStyle = {
    fontFamily: '"Tiny5", sans-serif',
    letterSpacing: '0.05em',
};

const GameBoard: React.FC = () => {
    const players = useSelector((state: RootState) => state.game.players);
    const properties = useSelector((state: RootState) => state.game.properties);
    const [animatingPlayers, setAnimatingPlayers] = useState<{ [key: string]: AnimationState }>({});

    // Helper function to get property at a specific position
    const getPropertyAtPosition = (position: number) => {
        return properties.find(p => p.position === position);
    };

    // Helper function to get players at a specific position
    const getPlayersAtPosition = (position: number) => {
        return players.filter(p => p.position === position);
    };

    // Watch for player position changes and trigger animations
    useEffect(() => {
        players.forEach(player => {
            if (player.position !== undefined) {
                const currentPosition = player.position;
                const previousPosition = player.previousPosition || 0;

                // Calculate the path the player should take
                let path: number[] = [];
                if (currentPosition > previousPosition) {
                    // Moving forward
                    for (let i = previousPosition; i <= currentPosition; i++) {
                        path.push(i);
                    }
                } else if (currentPosition < previousPosition) {
                    // Moving backward or wrapping around
                    for (let i = previousPosition; i < 40; i++) {
                        path.push(i);
                    }
                    for (let i = 0; i <= currentPosition; i++) {
                        path.push(i);
                    }
                }

                // Start the animation sequence
                setAnimatingPlayers(prev => ({
                    ...prev,
                    [player.id]: { isAnimating: true, path }
                }));

                // Animate through each position in the path
                path.forEach((pos, index) => {
                    setTimeout(() => {
                        setAnimatingPlayers(prev => ({
                            ...prev,
                            [player.id]: {
                                ...prev[player.id],
                                currentPathIndex: index
                            }
                        }));
                    }, index * 300); // 300ms between each position
                });

                // Clear animation state after the entire path is complete
                setTimeout(() => {
                    setAnimatingPlayers(prev => ({
                        ...prev,
                        [player.id]: { isAnimating: false, path: [] }
                    }));
                }, path.length * 300);
            }
        });
    }, [players]);

    // Update the cell rendering
    const renderBoardCell = (position: number) => {
        const property = getPropertyAtPosition(position);
        const playersHere = getPlayersAtPosition(position);
        const { delay, duration, xOffset, yOffset, rotation } = getRandomAnimationParams();

        let cellColor = property?.color || '#f5f5f5';

        // Special cells (corners, chance, community chest, etc.)
        let cellContent;
        let cellLabel = '';
        let cellTextColor = undefined;

        if (position === 0) {
            cellLabel = 'GO';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if (position === 10) {
            cellLabel = 'JAIL';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if (position === 20) {
            cellLabel = 'FREE PARKING';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if (position === 30) {
            cellLabel = 'GO TO JAIL';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if ([2, 17, 33].includes(position)) {
            cellLabel = 'COMMUNITY CHEST';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if ([7, 22, 36].includes(position)) {
            cellLabel = 'CHANCE';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if (position === 4) {
            cellLabel = 'INCOME TAX';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if (position === 38) {
            cellLabel = 'LUXURY TAX';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = THEME_COLORS.card_text;
        } else if ([5, 15, 25, 35].includes(position)) {
            // Railroad cards
            cellLabel = property?.name || '';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = '#E0E0E0'; // Light grey for railroads
        } else if ([12, 28].includes(position)) {
            // Utility cards
            cellLabel = property?.name || '';
            cellColor = THEME_COLORS.spcl_cards;
            cellTextColor = '#E0E0E0'; // Light grey for utilities
        } else if (property) {
            cellLabel = property.name;
        }

        return (
            <Paper
                elevation={2}
                sx={{
                    p: 0.5,
                    height: '100%',
                    width: '100%',
                    backgroundColor: property?.owner ? `${cellColor}80` : cellColor,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    position: 'relative',
                    border: property?.owner ? `2px solid ${players.find(p => p.id === property.owner)?.color || '#ccc'}` : 'none',
                    fontSize: '0.7rem',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease-in-out',
                    transform: 'translate(0, 0) rotate(0deg)',
                    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
                    '&:hover': {
                        transform: `translate(${xOffset}px, -4px) rotate(${rotation}deg)`,
                        boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                        zIndex: 2,
                        '&::before': {
                            opacity: 0.1,
                        },
                    },
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease-in-out',
                        pointerEvents: 'none',
                    },
                    backdropFilter: 'blur(1px)',
                }}
            >
                <Typography
                    variant="caption"
                    sx={{
                        fontSize: '0.85rem',
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        mb: 0.5,
                        whiteSpace: 'normal',
                        color: cellTextColor,
                        ...(position === 10 || position === 20 || position === 30 || position === 0 ? tiny5FontStyle : {}),
                    }}
                >
                    {cellLabel}
                </Typography>

                {property && (
                    <Typography
                        variant="caption"
                        sx={{
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            lineHeight: 1.2,
                            color: cellTextColor,
                            ...(position === 10 || position === 20 || position === 30 || position === 0 ? tiny5FontStyle : {}),
                        }}
                    >
                        ${property.price}
                    </Typography>
                )}

                {playersHere.length > 0 && (
                    <Box sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 0.25,
                        p: 0.25,
                        maxWidth: '100%',
                        justifyContent: 'flex-end'
                    }}>
                        {playersHere.map(player => {
                            const isAnimating = animatingPlayers[player.id]?.isAnimating;
                            const currentPathIndex = animatingPlayers[player.id]?.currentPathIndex;
                            const isCurrentPosition = currentPathIndex !== undefined &&
                                animatingPlayers[player.id]?.path[currentPathIndex] === position;

                            return (
                                <Avatar
                                    key={player.id}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        bgcolor: player.color || '#ccc',
                                        fontSize: '1rem',
                                        border: '2px solid #fff',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 'bold',
                                        transition: 'all 0.3s ease-in-out',
                                        animation: isCurrentPosition ? 'bounce 0.3s ease-in-out' : 'none',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            transition: 'transform 0.2s'
                                        }
                                    }}
                                >
                                    {player.tokenIcon || player.name.charAt(0)}
                                </Avatar>
                            );
                        })}
                    </Box>
                )}
            </Paper>
        );
    };

    // Helper function to get the spiral position for a grid cell
    const getSpiralPosition = (row: number, col: number): number | null => {
        // Return null for center cells
        if (row > 0 && row < BOARD_SIZE - 1 && col > 0 && col < BOARD_SIZE - 1) {
            return null;
        }

        // Start from GO (bottom-left corner) and move clockwise
        if (row === BOARD_SIZE - 1) {
            // Bottom row (left to right: 0-10)
            return col;
        } else if (col === BOARD_SIZE - 1) {
            // Right column (bottom to top: 11-19)
            return 10 + (BOARD_SIZE - 1 - row);
        } else if (row === 0) {
            // Top row (right to left: 20-30)
            return 20 + (BOARD_SIZE - 1 - col);
        } else { // col === 0
            // Left column (top to bottom: 31-39)
            return 30 + row;
        }
    };

    return (
        <Box sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: 1,
            bgcolor: THEME_COLORS.background,
            position: 'relative',
            '&::before': {
                content: '""',
                ...paperTexture,
            },
            '&::after': {
                content: '""',
                ...noiseTexture,
            },
            ...bounceAnimation,
            '@keyframes float': {
                '0%': {
                    transform: 'translate(0, 0) rotate(0deg)',
                },
                '25%': {
                    transform: 'translate(2px, -2px) rotate(0.5deg)',
                },
                '50%': {
                    transform: 'translate(0, -3px) rotate(0deg)',
                },
                '75%': {
                    transform: 'translate(-2px, -2px) rotate(-0.5deg)',
                },
                '100%': {
                    transform: 'translate(0, 0) rotate(0deg)',
                },
            },
        }}>
            <Box
                sx={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    display: 'grid',
                    gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
                    gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
                    p: 1,
                    backgroundColor: THEME_COLORS.background,
                    borderRadius: 1,
                    boxSizing: 'border-box',
                    position: 'relative',
                    '&::after': {
                        content: '""',
                        ...vignetteEffect,
                    },
                }}
            >
                {Array.from({ length: BOARD_SIZE * BOARD_SIZE }).map((_, index) => {
                    const row = Math.floor(index / BOARD_SIZE);
                    const col = index % BOARD_SIZE;
                    const position = getSpiralPosition(row, col);
                    const isOuterCell = row === 0 || row === BOARD_SIZE - 1 || col === 0 || col === BOARD_SIZE - 1;

                    if (position !== null) {
                        return (
                            <Box key={index} sx={{
                                width: '100%',
                                height: '100%',
                                p: isOuterCell ? 0.25 : 0
                            }}>
                                {renderBoardCell(position)}
                            </Box>
                        );
                    }

                    // For inner cells, create a single merged background with centered logo
                    if (row === 1 && col === 1) {
                        return (
                            <Box key={index} sx={{
                                width: '100%',
                                height: '100%',
                                bgcolor: THEME_COLORS.background,
                                gridColumn: '2 / -2',
                                gridRow: '2 / -2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative',
                            }}>
                                <Typography
                                    variant="h1"
                                    sx={{
                                        fontSize: { xs: '8rem', sm: '8rem', md: '8rem' },
                                        fontWeight: 'bold',
                                        color: THEME_COLORS.card_text,
                                        textAlign: 'center',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                                        ...tiny5FontStyle,
                                    }}
                                >
                                    Monopoly
                                    <br />
                                    Automata
                                </Typography>
                            </Box>
                        );
                    }

                    // Skip rendering other inner cells as they're covered by the merged cell
                    if (row > 0 && row < BOARD_SIZE - 1 && col > 0 && col < BOARD_SIZE - 1) {
                        return null;
                    }

                    return (
                        <Box key={index} sx={{
                            width: '100%',
                            height: '100%',
                            bgcolor: THEME_COLORS.background
                        }} />
                    );
                })}
            </Box>
        </Box>
    );
};

export default GameBoard;