import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface GameState {
  level: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  exp: number;
  expToNext: number;
  attack: number;
  defense: number;
  gold: number;
  battleInProgress: boolean;
  currentLocation: string;
  _nonce?: number;  // 再レンダリングを強制するための一時的な値
}

const initialState: GameState = {
  level: 1,
  hp: 100,
  maxHp: 100,
  mp: 30,
  maxMp: 30,
  exp: 0,
  expToNext: 100,
  attack: 20,
  defense: 10,
  gold: 500,
  battleInProgress: false,
  currentLocation: 'village',
};

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>(initialState);

  // Load game state from storage on mount
  useEffect(() => {
    loadGameState();
  }, []);

  // Save game state whenever it changes
  useEffect(() => {
    saveGameState();
  }, [gameState]);

  const loadGameState = async () => {
    try {
      const saved = await AsyncStorage.getItem('gameState');
      if (saved) {
        const parsedState = JSON.parse(saved);
        setGameState(parsedState);
      }
    } catch (error) {
      console.error('Failed to load game state:', error);
    }
  };

  const saveGameState = async () => {
    try {
      await AsyncStorage.setItem('gameState', JSON.stringify(gameState));
    } catch (error) {
      console.error('Failed to save game state:', error);
    }
  };

  const updateGameState = (updates: Partial<GameState>) => {
    setGameState(prev => ({ ...prev, ...updates }));
  };

  const resetGameState = () => {
    setGameState(initialState);
  };

  return {
    gameState,
    updateGameState,
    resetGameState,
  };
}
