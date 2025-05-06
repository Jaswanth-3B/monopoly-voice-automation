// src/store/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, Property, Transaction, Card, GameState } from '../types/gameTypes';

const initialState: GameState = {
  players: [],
  properties: [],
  transactions: [],
  cards: []
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addPlayer(state, action: PayloadAction<Player>) {
      state.players.push(action.payload);
    },
    updatePlayerMoney(state, action: PayloadAction<{ playerId: number; amount: number }>) {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.money += action.payload.amount;
      }
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload);
    },
    updatePlayerPosition(state, action: PayloadAction<{ playerId: number; position: number }>) {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.position = action.payload.position;
      }
    },
    updatePropertyOwner(state, action: PayloadAction<{ propertyId: number; ownerId: number }>) {
      const property = state.properties.find(p => p.id === action.payload.propertyId);
      if (property) {
        property.owner = action.payload.ownerId;
        // Also update the player's properties array
        const player = state.players.find(p => p.id === action.payload.ownerId);
        if (player) {
          player.properties.push(property);
        }
      }
    },
    initializeProperties(state, action: PayloadAction<Property[]>) {
      state.properties = action.payload;
    }
  }
});

export const { 
  addPlayer, 
  updatePlayerMoney, 
  addTransaction, 
  updatePlayerPosition, 
  updatePropertyOwner,
  initializeProperties 
} = gameSlice.actions;

export default gameSlice.reducer;