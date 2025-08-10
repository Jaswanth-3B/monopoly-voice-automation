// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from './gameSlice';

// Function to load the state from localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('monopolyGameState');
    if (serializedState === null) {
      return undefined; // No state saved, so Redux will use the initial state from the reducers
    }
    return JSON.parse(serializedState);
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
    game: gameReducer
  },
  preloadedState // This will initialize the store with the saved state if it exists
});

// Subscribe to store updates to save the state on every change
// For performance, you could wrap this in a debounce function from lodash
store.subscribe(() => {
  saveState(store.getState());
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;