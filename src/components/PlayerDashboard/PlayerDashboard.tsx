import React from 'react';
import { Box, Paper, Typography, List, ListItem, Divider, Avatar, Chip, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

const PlayerDashboard: React.FC = () => {
  const players = useSelector((state: RootState) => state.game.players);
  const transactions = useSelector((state: RootState) => state.game.transactions);

  if (players.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 2, m: 2 }}>
        <Typography variant="h6">No players in the game</Typography>
      </Paper>
    );
  }

  return (
    // Update the Box component at the beginning of the return statement:
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 2,
      width: '100%',
      overflow: 'visible' // Allow content to be scrollable in parent container
    }}>
      <Typography variant="h6">Player Dashboard</Typography>
    
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr', lg: '1fr 1fr 1fr' }, gap: 2 }}>
        {players.map(player => {
          const playerTransactions = transactions.filter(
            t => t.from === player.id || t.to === player.id
          );

          return (
            <Box key={player.id}>
              <Paper elevation={3} sx={{ p: 2, height: '100%', borderLeft: `5px solid ${player.color || '#ccc'}` }}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar 
                    sx={{ 
                      bgcolor: player.color || '#ccc', 
                      mr: 2,
                      width: 48,
                      height: 48,
                      fontSize: '1.5rem'
                    }}
                  >
                    {player.tokenIcon || player.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">{player.name}</Typography>
                    <Chip 
                      label={`$${player.money}`} 
                      color="success" 
                      variant="outlined" 
                      size="small"
                    />
                  </Box>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2">
                  Position: {player.position} 
                  {player.position === 0 && ' (GO)'}
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Properties:</Typography>
                {player.properties.length > 0 ? (
                  <Box display="flex" flexWrap="wrap" gap={0.5}>
                    {player.properties.map(property => (
                      <Chip 
                        key={property.id}
                        label={property.name}
                        size="small"
                        sx={{ 
                          bgcolor: property.color + '20', 
                          borderLeft: `3px solid ${property.color}`,
                          borderRadius: '4px'
                        }}
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">No properties owned</Typography>
                )}
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Recent Transactions:</Typography>
                {playerTransactions.length > 0 ? (
                  <List dense sx={{ bgcolor: '#f5f5f5', borderRadius: 1 }}>
                    {playerTransactions.slice(0, 3).map(transaction => (
                      <ListItem key={transaction.id}>
                        <Typography variant="body2">
                          {transaction.from === player.id ? '➖' : '➕'} ${transaction.amount} 
                          ({transaction.type})
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="text.secondary">No recent transactions</Typography>
                )}
              </Paper>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default PlayerDashboard;