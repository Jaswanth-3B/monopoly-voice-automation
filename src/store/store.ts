// src/store/store.ts
import { configureStore, Reducer, UnknownAction } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';
import { GameState } from '../types/gameTypes'; // Import GameState type

// Define the shape of our entire Redux state
export interface RootState {
  game: GameState;
}

// Function to load the state from localStorage
const loadState = (): RootState | undefined => {
  try {
    const serializedState = localStorage.getItem('monopolyGameState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState) as RootState; // Explicitly cast to our RootState type
  } catch (err) {
    console.error("Could not load state from localStorage", err);
    return undefined;
  }
};

// Function to save the state to localStorage
const saveState = (state: RootState) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('monopolyGameState', serializedState);
  } catch (err) {
    console.error("Could not save state to localStorage", err);
  }
};

const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    game: gameReducer as Reducer<GameState, UnknownAction>, // Asserting the type here helps TypeScript
  },
  preloadedState,
});

store.subscribe(() => {
  saveState(store.getState());
});

export type AppDispatch = typeof store.dispatch;