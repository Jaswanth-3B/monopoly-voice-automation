// src/utils/voiceCommandParser.ts
import { store } from '../store/store';
// Update the import line to include updatePropertyOwner
import { addTransaction, updatePlayerMoney, updatePlayerPosition, updatePropertyOwner } from '../store/gameSlice';

type CommandType = 'MOVE' | 'PAY' | 'COLLECT' | 'BUY' | 'UNKNOWN';

interface ParsedCommand {
  type: CommandType;
  playerId?: string;
  targetId?: string;
  amount?: number;
  position?: number;
  propertyId?: number;
  error?: string;
}

// Update the parseVoiceCommand function to handle case-insensitive property names
export const parseVoiceCommand = (command: string): ParsedCommand => {
  const lowerCommand = command.toLowerCase();
  const state = store.getState();
  
  // Move command: "Player 1 moves to position 10" or "Move player 2 to Go"
  if (lowerCommand.includes('move') || lowerCommand.includes('moves to')) {
    const playerMatch = lowerCommand.match(/player\s*(\d+)/i);
    const positionMatch = lowerCommand.match(/position\s*(\d+)/i) || lowerCommand.match(/to\s*(\d+)/i);
    const propertyMatch = lowerCommand.match(/to\s+([a-zA-Z &]+)(?:$|\s)/i);
    
    if (playerMatch) {
      const playerId = playerMatch[1];
      const player = state.game.players.find(p => p.id === playerId);
      
      if (!player) {
        return {
          type: 'UNKNOWN',
          error: `Player ${playerId} does not exist`
        };
      }
      
      if (positionMatch) {
        const position = parseInt(positionMatch[1]);
        if (position < 0 || position > 39) {
          return {
            type: 'UNKNOWN',
            error: `Invalid position: ${position}. Position must be between 0 and 39.`
          };
        }
        return {
          type: 'MOVE',
          playerId,
          position
        };
      } else if (propertyMatch) {
        const propertyName = propertyMatch[1].trim();
        const property = state.game.properties.find(
          p => p.name.toLowerCase() === propertyName.toLowerCase()
        );
        if (property) {
          return {
            type: 'MOVE',
            playerId,
            position: property.position
          };
        } else {
          return {
            type: 'UNKNOWN',
            error: `Property "${propertyName}" not found`
          };
        }
      }
    } else {
      return {
        type: 'UNKNOWN',
        error: 'No player specified in the command'
      };
    }
  }
  
  // Payment command: "Player 1 pays 200 to player 2" or "Player 3 pays 150 to bank"
  if (lowerCommand.includes('pay') || lowerCommand.includes('pays')) {
    const fromPlayerMatch = lowerCommand.match(/player\s*(\d+)\s*pays/i);
    const amountMatch = lowerCommand.match(/pays\s*(\d+)/i);
    const toPlayerMatch = lowerCommand.match(/to\s*player\s*(\d+)/i);
    
    if (fromPlayerMatch && amountMatch) {
      return {
        type: 'PAY',
        playerId: fromPlayerMatch[1],
        amount: parseInt(amountMatch[1]),
        targetId: toPlayerMatch ? toPlayerMatch[1] : undefined
      };
    }
  }
  
  // Collection command: "Player 2 collects 200 from bank" or "Player 1 collects 50 from player 3"
  if (lowerCommand.includes('collect') || lowerCommand.includes('collects')) {
    const toPlayerMatch = lowerCommand.match(/player\s*(\d+)\s*collects/i);
    const amountMatch = lowerCommand.match(/collects\s*(\d+)/i);
    const fromPlayerMatch = lowerCommand.match(/from\s*player\s*(\d+)/i);
    
    if (toPlayerMatch && amountMatch) {
      return {
        type: 'COLLECT',
        playerId: toPlayerMatch[1],
        amount: parseInt(amountMatch[1]),
        targetId: fromPlayerMatch ? fromPlayerMatch[1] : undefined
      };
    }
  }
  
  // Buy property command: "Player 1 buys Mediterranean Avenue"
  if (lowerCommand.includes('buy') || lowerCommand.includes('buys')) {
    const playerMatch = lowerCommand.match(/player\s*(\d+)/i);
    const propertyMatch = lowerCommand.match(/buys\s+([a-zA-Z &]+)(?:$|\s)/i);
    
    if (playerMatch && propertyMatch) {
      const propertyName = propertyMatch[1].trim();
      const property = store.getState().game.properties.find(
        p => p.name.toLowerCase() === propertyName.toLowerCase()
      );
      
      if (property) {
        return {
          type: 'BUY',
          playerId: playerMatch[1],
          propertyId: property.id
        };
      }
    }
  }
  
  return { type: 'UNKNOWN', error: 'Command not recognized' };
};

// Update the executeCommand function to handle error messages
export const executeCommand = (command: string): string => {
  const parsedCommand = parseVoiceCommand(command);
  
  if (parsedCommand.type === 'UNKNOWN' && parsedCommand.error) {
    return parsedCommand.error;
  }
  
  const dispatch = store.dispatch;
  const state = store.getState();
  
  switch (parsedCommand.type) {
    case 'MOVE':
      if (parsedCommand.playerId && parsedCommand.position !== undefined) {
        const player = state.game.players.find(p => p.id === parsedCommand.playerId);
        // Add position validation (Monopoly board has 40 spaces, 0-39)
        if (player && parsedCommand.position >= 0 && parsedCommand.position <= 39) {
          dispatch(updatePlayerPosition({
            playerId: parsedCommand.playerId,
            position: parsedCommand.position
          }));
          return `Player ${parsedCommand.playerId} moved to position ${parsedCommand.position}`;
        } else if (parsedCommand.position < 0 || parsedCommand.position > 39) {
          return `Invalid position: ${parsedCommand.position}. Position must be between 0 and 39.`;
        }
      }
      break;
      
    case 'PAY':
      if (parsedCommand.playerId && parsedCommand.amount) {
        const player = state.game.players.find(p => p.id === parsedCommand.playerId);
        if (player) {
          dispatch(updatePlayerMoney({
            playerId: parsedCommand.playerId,
            amount: -parsedCommand.amount
          }));
          
          if (parsedCommand.targetId) {
            const targetPlayer = state.game.players.find(p => p.id === parsedCommand.targetId);
            if (targetPlayer) {
              dispatch(updatePlayerMoney({
                playerId: parsedCommand.targetId,
                amount: parsedCommand.amount
              }));
              
              dispatch(addTransaction({
                id: Date.now(),
                from: parsedCommand.playerId,
                to: parsedCommand.targetId,
                amount: parsedCommand.amount,
                timestamp: new Date(),
                type: 'RENT'
              }));
              
              return `Player ${parsedCommand.playerId} paid $${parsedCommand.amount} to Player ${parsedCommand.targetId}`;
            }
          }
          
          return `Player ${parsedCommand.playerId} paid $${parsedCommand.amount} to the bank`;
        }
      }
      break;
      
    case 'COLLECT':
      if (parsedCommand.playerId && parsedCommand.amount) {
        const player = state.game.players.find(p => p.id === parsedCommand.playerId);
        if (player) {
          dispatch(updatePlayerMoney({
            playerId: parsedCommand.playerId,
            amount: parsedCommand.amount
          }));
          
          if (parsedCommand.targetId) {
            const targetPlayer = state.game.players.find(p => p.id === parsedCommand.targetId);
            if (targetPlayer) {
              dispatch(updatePlayerMoney({
                playerId: parsedCommand.targetId,
                amount: -parsedCommand.amount
              }));
              
              dispatch(addTransaction({
                id: Date.now(),
                from: parsedCommand.targetId,
                to: parsedCommand.playerId,
                amount: parsedCommand.amount,
                timestamp: new Date(),
                type: 'RENT'
              }));
              
              return `Player ${parsedCommand.playerId} collected $${parsedCommand.amount} from Player ${parsedCommand.targetId}`;
            }
          }
          
          return `Player ${parsedCommand.playerId} collected $${parsedCommand.amount} from the bank`;
        }
      }
      break;

    case 'BUY':
      if (parsedCommand.playerId && parsedCommand.propertyId) {
        const player = state.game.players.find(p => p.id === parsedCommand.playerId);
        const property = state.game.properties.find(p => p.id === parsedCommand.propertyId);
        
        if (player && property && !property.owner) {
          // Update player money
          dispatch(updatePlayerMoney({
            playerId: parsedCommand.playerId,
            amount: -property.price
          }));
          
          // Update property owner
          dispatch(updatePropertyOwner({
            propertyId: property.id,
            ownerId: player.id
          }));
          
          // Add transaction
          dispatch(addTransaction({
            id: Date.now(),
            from: player.id,
            to: '0', // Bank
            amount: property.price,
            timestamp: new Date(),
            type: 'PURCHASE'
          }));
          
          return `Player ${player.id} bought ${property.name} for $${property.price}`;
        }
      }
      break;
      
    default:
      return `Command not recognized: ${command}`;
  }
  
  return `Error processing command: ${command}`;
};

// Update the ParsedCommand interface
interface ParsedCommand {
  type: CommandType;
  playerId?: string;
  targetId?: string;
  amount?: number;
  position?: number;
  propertyId?: number;
  error?: string;
}