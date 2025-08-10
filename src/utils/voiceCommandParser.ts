// src/utils/voiceCommandParser.ts
import { store } from '../store/store';
import { addTransaction, updatePlayerMoney, updatePlayerPosition, updatePropertyOwner } from '../store/gameSlice';
import { Player } from '../types/gameTypes';

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

// Helper function to find a player by name. Case-insensitive.
const findPlayerByName = (name: string, players: Player[]): Player | undefined => {
  const trimmedName = name.trim().toLowerCase();
  // Find player by full name (e.g., "Alice")
  const player = players.find(p => p.name.toLowerCase() === trimmedName);
  if (player) {
    return player;
  }
  // Also handle "1", "2" if the user refers to them by ID/number
  if (/^\d+$/.test(trimmedName)) {
    return players.find(p => p.id === trimmedName);
  }
  return undefined;
};

export const parseVoiceCommand = (command: string): ParsedCommand => {
  const lowerCommand = command.toLowerCase();
  const state = store.getState();
  const { players, properties } = state.game;

  // Move command: "Player Alice moves to position 10" or "Move player Bob to Go"
  if (lowerCommand.includes('move')) {
    const playerMatch = lowerCommand.match(/(?:player|move player)\s+(.*?)\s+(?:moves to|to)/i);
    if (playerMatch) {
      const playerName = playerMatch[1].trim();
      const player = findPlayerByName(playerName, players);

      if (!player) {
        return { type: 'UNKNOWN', error: `Player "${playerName}" not found` };
      }

      const positionMatch = lowerCommand.match(/position\s*(\d+)/i) || lowerCommand.match(/to\s*(\d+)/i);
      const propertyMatch = lowerCommand.match(/to\s+([a-zA-Z\s&]+)(?:$|\s)/i);

      if (positionMatch) {
        const position = parseInt(positionMatch[1], 10);
        if (position < 0 || position > 39) {
          return { type: 'UNKNOWN', error: `Invalid position: ${position}. Must be 0-39.` };
        }
        return { type: 'MOVE', playerId: player.id, position };
      } else if (propertyMatch) {
        const propertyName = propertyMatch[1].trim();
        const property = properties.find(p => p.name.toLowerCase() === propertyName.toLowerCase());
        if (property) {
          return { type: 'MOVE', playerId: player.id, position: property.position };
        }
        return { type: 'UNKNOWN', error: `Property "${propertyName}" not found` };
      }
    }
  }

  // Payment command: "Player Alice pays 200 to player Bob" or "Player Charlie pays 150 to bank"
  if (lowerCommand.includes('pay')) {
    const paymentMatch = lowerCommand.match(/player\s+(.*?)\s+pays\s+(\d+)\s+to\s+(.*)/i);
    if (paymentMatch) {
        const fromPlayerName = paymentMatch[1].trim();
        const amount = parseInt(paymentMatch[2], 10);
        const targetName = paymentMatch[3].trim().replace(/^player\s+/, '');

        const fromPlayer = findPlayerByName(fromPlayerName, players);
        if (!fromPlayer) return { type: 'UNKNOWN', error: `Player "${fromPlayerName}" not found` };

        if (targetName.toLowerCase() === 'bank') {
            return { type: 'PAY', playerId: fromPlayer.id, amount, targetId: 'bank' };
        }

        const toPlayer = findPlayerByName(targetName, players);
        if (!toPlayer) return { type: 'UNKNOWN', error: `Target Player "${targetName}" not found` };

        return { type: 'PAY', playerId: fromPlayer.id, amount, targetId: toPlayer.id };
    }
  }

  // Collection command: "Player Bob collects 200 from bank" or "Player Alice collects 50 from player Charlie"
  if (lowerCommand.includes('collect')) {
      const collectionMatch = lowerCommand.match(/player\s+(.*?)\s+collects\s+(\d+)\s+from\s+(.*)/i);
      if (collectionMatch) {
          const toPlayerName = collectionMatch[1].trim();
          const amount = parseInt(collectionMatch[2], 10);
          const sourceName = collectionMatch[3].trim().replace(/^player\s+/, '');

          const toPlayer = findPlayerByName(toPlayerName, players);
          if (!toPlayer) return { type: 'UNKNOWN', error: `Player "${toPlayerName}" not found` };
          
          if (sourceName.toLowerCase() === 'bank') {
              return { type: 'COLLECT', playerId: toPlayer.id, amount, targetId: 'bank' };
          }

          const fromPlayer = findPlayerByName(sourceName, players);
          if (!fromPlayer) return { type: 'UNKNOWN', error: `Source Player "${sourceName}" not found` };

          return { type: 'COLLECT', playerId: toPlayer.id, amount, targetId: fromPlayer.id };
      }
  }


  // Buy property command: "Player Alice buys Boardwalk"
  if (lowerCommand.includes('buy')) {
    const buyMatch = lowerCommand.match(/player\s+(.*?)\s+buys\s+(.*)/i);
    if (buyMatch) {
      const playerName = buyMatch[1].trim();
      const propertyName = buyMatch[2].trim();
      
      const player = findPlayerByName(playerName, players);
      if (!player) return { type: 'UNKNOWN', error: `Player "${playerName}" not found` };

      const property = properties.find(p => p.name.toLowerCase() === propertyName.toLowerCase());
      if (property) {
        return { type: 'BUY', playerId: player.id, propertyId: property.id };
      }
      return { type: 'UNKNOWN', error: `Property "${propertyName}" not found` };
    }
  }

  return { type: 'UNKNOWN', error: 'Command not recognized. Try "Player [Name] [action]..."' };
};

export const executeCommand = (command: string): string => {
  const parsedCommand = parseVoiceCommand(command);

  if (parsedCommand.type === 'UNKNOWN') {
    return parsedCommand.error || 'Unknown command';
  }

  const dispatch = store.dispatch;
  const state = store.getState();

  switch (parsedCommand.type) {
    case 'MOVE':
      if (parsedCommand.playerId && parsedCommand.position !== undefined) {
        dispatch(updatePlayerPosition({
          playerId: parsedCommand.playerId,
          position: parsedCommand.position
        }));
        const player = state.game.players.find(p => p.id === parsedCommand.playerId);
        return `Player ${player?.name || parsedCommand.playerId} moved to position ${parsedCommand.position}`;
      }
      break;

    case 'PAY':
       if (parsedCommand.playerId && parsedCommand.amount && parsedCommand.targetId) {
        const fromPlayer = state.game.players.find(p => p.id === parsedCommand.playerId);
        if (!fromPlayer) break;

        dispatch(updatePlayerMoney({ playerId: fromPlayer.id, amount: -parsedCommand.amount }));
        
        if (parsedCommand.targetId === 'bank') {
          return `Player ${fromPlayer.name} paid $${parsedCommand.amount} to the bank`;
        }
        
        const toPlayer = state.game.players.find(p => p.id === parsedCommand.targetId);
        if (toPlayer) {
          dispatch(updatePlayerMoney({ playerId: toPlayer.id, amount: parsedCommand.amount }));
          dispatch(addTransaction({
            id: Date.now(),
            from: fromPlayer.id,
            to: toPlayer.id,
            amount: parsedCommand.amount,
            timestamp: new Date(),
            type: 'RENT'
          }));
          return `Player ${fromPlayer.name} paid $${parsedCommand.amount} to Player ${toPlayer.name}`;
        }
      }
      break;

    case 'COLLECT':
      if (parsedCommand.playerId && parsedCommand.amount && parsedCommand.targetId) {
        const toPlayer = state.game.players.find(p => p.id === parsedCommand.playerId);
        if(!toPlayer) break;

        dispatch(updatePlayerMoney({ playerId: toPlayer.id, amount: parsedCommand.amount }));

        if (parsedCommand.targetId === 'bank') {
            return `Player ${toPlayer.name} collected $${parsedCommand.amount} from the bank`;
        }

        const fromPlayer = state.game.players.find(p => p.id === parsedCommand.targetId);
        if(fromPlayer) {
            dispatch(updatePlayerMoney({ playerId: fromPlayer.id, amount: -parsedCommand.amount }));
            dispatch(addTransaction({
                id: Date.now(),
                from: fromPlayer.id,
                to: toPlayer.id,
                amount: parsedCommand.amount,
                timestamp: new Date(),
                type: 'RENT'
            }));
            return `Player ${toPlayer.name} collected $${parsedCommand.amount} from Player ${fromPlayer.name}`;
        }
      }
      break;

    case 'BUY':
      if (parsedCommand.playerId && parsedCommand.propertyId) {
        const player = state.game.players.find(p => p.id === parsedCommand.playerId);
        const property = state.game.properties.find(p => p.id === parsedCommand.propertyId);

        if (player && property && !property.owner) {
          if (player.money < property.price) {
            return `Player ${player.name} does not have enough money to buy ${property.name}`;
          }
          dispatch(updatePlayerMoney({ playerId: player.id, amount: -property.price }));
          dispatch(updatePropertyOwner({ propertyId: property.id, ownerId: player.id }));
          dispatch(addTransaction({
            id: Date.now(),
            from: player.id,
            to: 'bank',
            amount: property.price,
            timestamp: new Date(),
            type: 'PURCHASE'
          }));
          return `Player ${player.name} bought ${property.name} for $${property.price}`;
        } else if (property?.owner) {
          return `${property.name} is already owned.`;
        }
      }
      break;
      
    default:
      return `Command not recognized: ${command}`;
  }

  return `Error processing command: ${command}`;
};