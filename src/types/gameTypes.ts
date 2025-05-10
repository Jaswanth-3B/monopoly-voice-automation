// src/types/gameTypes.ts
export interface Player {
  id: string;
  name: string;
  color: string;
  tokenIcon?: string;
  position: number;
  previousPosition?: number;
  money: number;
  properties: string[];
}

export interface Property {
  id: number;
  name: string;
  price: number;
  rent: number;
  owner: string | null;
  position: number;
  color?: string;
}

export interface Transaction {
  id: number;
  from: string;
  to: string;
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

export interface AnimationState {
  isAnimating: boolean;
  path: number[];
  currentPathIndex?: number;
}