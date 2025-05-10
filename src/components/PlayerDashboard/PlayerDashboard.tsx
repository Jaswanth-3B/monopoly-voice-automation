import React from 'react';
import { Box, Paper, Typography, List, ListItem, Divider, Avatar, Chip, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { THEME_COLORS } from '../../theme/colors';

const PlayerDashboard: React.FC = () => {
  const players = useSelector((state: RootState) => state.game.players);
  const properties = useSelector((state: RootState) => state.game.properties);
  const transactions = useSelector((state: RootState) => state.game.transactions);

  if (players.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '0.9rem' }}>No players in the game</Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: 2
    }}>
      <Typography variant="h6" sx={{ fontSize: '0.85rem' }}>Player Dashboard</Typography>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 1.5,
        width: '100%'
      }}>
        {players.map(player => {
          const playerTransactions = transactions
            .filter(t => t.from === player.id || t.to === player.id)
            .slice(0, 3);

          return (
            <Paper
              key={player.id}
              elevation={2}
              sx={{
                p: 1.5,
                borderLeft: `4px solid ${player.color || THEME_COLORS.text}`,
                backgroundColor: THEME_COLORS.background,
                minHeight: '200px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box display="flex" alignItems="center" mb={1.5}>
                <Avatar
                  sx={{
                    bgcolor: player.color || '#ccc',
                    mr: 1.5,
                    width: 28,
                    height: 28,
                    fontSize: '0.85rem'
                  }}
                >
                  {player.tokenIcon || player.name.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                    {player.name}
                  </Typography>
                  <Chip
                    label={`$${player.money}`}
                    color="success"
                    variant="outlined"
                    size="small"
                    sx={{ height: 18, fontSize: '0.7rem' }}
                  />
                </Box>
              </Box>

              <Typography variant="body2" sx={{ fontSize: '0.7rem', mb: 1 }}>
                Position: {player.position}
                {player.position === 0 && ' (GO)'}
              </Typography>

              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 0.5 }}>
                Properties:
              </Typography>
              <Box sx={{ mb: 1.5, flex: 1 }}>
                {player.properties.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {player.properties.map(propertyId => {
                      const property = properties.find(p => String(p.id) === propertyId);
                      return property ? (
                        <Chip
                          key={property.id}
                          label={property.name}
                          size="small"
                          sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            bgcolor: property.color + '20',
                            borderLeft: `2px solid ${property.color}`,
                            borderRadius: '3px'
                          }}
                        />
                      ) : null;
                    })}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    No properties owned
                  </Typography>
                )}
              </Box>

              <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', mb: 0.5 }}>
                Recent Transactions:
              </Typography>
              {playerTransactions.length > 0 ? (
                <Box sx={{
                  bgcolor: '#f5f5f5',
                  borderRadius: 1,
                  p: 0.5,
                  fontSize: '0.7rem'
                }}>
                  {playerTransactions.map(transaction => (
                    <Box
                      key={transaction.id}
                      sx={{
                        py: 0.25,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Typography variant="body2" sx={{ fontSize: '0.7rem' }}>
                        {transaction.from === player.id ? '➖' : '➕'}
                        ${transaction.amount} ({transaction.type})
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                  No recent transactions
                </Typography>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
};

export default PlayerDashboard;