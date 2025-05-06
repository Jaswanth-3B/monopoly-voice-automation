// src/types/gameTypes.ts
export interface Player {
  id: number;
  name: string;
  money: number;
  position: number;
  properties: Property[];
  cards: Card[];
  token?: string;      // Token identifier (car, ship, etc.)
  tokenIcon?: string;  // Emoji or icon representation
  color?: string;      // Player color
}

export interface Property {
  id: number;
  name: string;
  price: number;
  rent: number;
  owner: number | null;
  position: number;
  color?: string;
}

export interface Transaction {
  id: number;
  from: number;
  to: number;
  amount: number;
  timestamp: Date;
  type: 'RENT' | 'PURCHASE' | 'CHANCE' | 'TAX';
}

export interface Card {
  id: number;
  type: 'CHANCE' | 'COMMUNITY_CHEST';
  description: string;
}

export interface GameState {
  players: Player[];
  properties: Property[];
  transactions: Transaction[];
  cards: Card[];
}