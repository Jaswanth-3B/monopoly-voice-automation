// src/store/gameSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Player, Property, Transaction, Card, GameState } from '../types/gameTypes';

const initialState: GameState = {
  players: [],
  properties: [],
  transactions: [],
  cards: []
};

export interface AddPlayerPayload {
  name: string;
  money: number;
  position: number;
  token: string;
  tokenIcon: string;
  color: string;
}

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    addPlayer: (state, action: PayloadAction<AddPlayerPayload>) => {
      const newPlayer = {
        id: String(Date.now()), // Use a timestamp for a unique ID
        name: action.payload.name, // Use the name from the form
        money: action.payload.money,
        position: action.payload.position,
        properties: [],
        cards: [],
        token: action.payload.token,
        tokenIcon: action.payload.tokenIcon,
        color: action.payload.color
      };
      state.players.push(newPlayer);
    },
    updatePlayerMoney(state, action: PayloadAction<{ playerId: string; amount: number }>) {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.money += action.payload.amount;
      }
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.push(action.payload);
    },
    updatePlayerPosition(state, action: PayloadAction<{ playerId: string; position: number }>) {
      const player = state.players.find(p => p.id === action.payload.playerId);
      if (player) {
        player.position = action.payload.position;
      }
    },
    updatePropertyOwner(state, action: PayloadAction<{ propertyId: number; ownerId: string }>) {
      const property = state.properties.find(p => p.id === action.payload.propertyId);
      if (property) {
        property.owner = action.payload.ownerId;
        // Also update the player's properties array
        const player = state.players.find(p => p.id === action.payload.ownerId);
        if (player) {
          player.properties.push(String(property.id));
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