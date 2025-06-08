import { useState, useEffect } from 'react';
import { useGameState } from './useGameState';

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  exp: number;
  gold: number;
  image: string;
}

const enemies: Enemy[] = [
  {
    id: 'slime',
    name: 'スライム',
    hp: 30,
    maxHp: 30,
    attack: 8,
    defense: 2,
    exp: 10,
    gold: 15,
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'goblin',
    name: 'ゴブリン',
    hp: 50,
    maxHp: 50,
    attack: 12,
    defense: 4,
    exp: 20,
    gold: 25,
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
  {
    id: 'orc',
    name: 'オーク',
    hp: 80,
    maxHp: 80,
    attack: 18,
    defense: 8,
    exp: 35,
    gold: 40,
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200',
  },
];

export function useBattleSystem() {
  const { gameState, updateGameState } = useGameState();
  const [currentEnemy, setCurrentEnemy] = useState<Enemy | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);

  useEffect(() => {
    if (gameState.inBattle && !currentEnemy) {
      startBattle();
    }
  }, [gameState.inBattle]);

  const startBattle = () => {
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    const enemy = { ...randomEnemy };
    setCurrentEnemy(enemy);
    setBattleLog([`${enemy.name}が現れた！`]);
  };

  const performAttack = () => {
    if (!currentEnemy) return;

    // Player attacks enemy
    const playerDamage = Math.max(1, gameState.attack - currentEnemy.defense + Math.floor(Math.random() * 10) - 5);
    const newEnemyHp = Math.max(0, currentEnemy.hp - playerDamage);
    
    setCurrentEnemy(prev => prev ? { ...prev, hp: newEnemyHp } : null);
    setBattleLog(prev => [...prev, `${playerDamage}のダメージを与えた！`]);

    if (newEnemyHp <= 0) {
      // Enemy defeated
      const expGained = currentEnemy.exp;
      const goldGained = currentEnemy.gold;
      
      setBattleLog(prev => [...prev, `${currentEnemy.name}を倒した！`, `${expGained}の経験値を得た！`, `${goldGained}ゴールドを手に入れた！`]);
      
      updateGameState({
        exp: gameState.exp + expGained,
        gold: gameState.gold + goldGained,
        inBattle: false,
      });
      
      setCurrentEnemy(null);
      return;
    }

    // Enemy attacks player
    setTimeout(() => {
      const enemyDamage = Math.max(1, currentEnemy.attack - gameState.defense + Math.floor(Math.random() * 8) - 4);
      const newPlayerHp = Math.max(0, gameState.hp - enemyDamage);
      
      setBattleLog(prev => [...prev, `${currentEnemy.name}の攻撃！ ${enemyDamage}のダメージを受けた！`]);
      
      if (newPlayerHp <= 0) {
        // Player defeated
        setBattleLog(prev => [...prev, '戦闘に敗北した...']);
        updateGameState({
          hp: 1,
          inBattle: false,
        });
        setCurrentEnemy(null);
      } else {
        updateGameState({ hp: newPlayerHp });
      }
    }, 1000);
  };

  const useSkill = (skillId: string) => {
    if (!currentEnemy) return;

    switch (skillId) {
      case 'fireball':
        if (gameState.mp >= 10) {
          const damage = Math.floor(gameState.attack * 1.5);
          const newEnemyHp = Math.max(0, currentEnemy.hp - damage);
          
          setCurrentEnemy(prev => prev ? { ...prev, hp: newEnemyHp } : null);
          setBattleLog(prev => [...prev, `火球を放った！ ${damage}のダメージ！`]);
          updateGameState({ mp: gameState.mp - 10 });
          
          if (newEnemyHp <= 0) {
            setBattleLog(prev => [...prev, `${currentEnemy.name}を倒した！`]);
            updateGameState({
              exp: gameState.exp + currentEnemy.exp,
              gold: gameState.gold + currentEnemy.gold,
              inBattle: false,
            });
            setCurrentEnemy(null);
          }
        } else {
          setBattleLog(prev => [...prev, 'MPが足りない！']);
        }
        break;
      
      case 'heal':
        if (gameState.mp >= 8) {
          const healAmount = 30;
          const newHp = Math.min(gameState.maxHp, gameState.hp + healAmount);
          
          setBattleLog(prev => [...prev, `回復魔法を使った！ ${healAmount}回復した！`]);
          updateGameState({ 
            hp: newHp,
            mp: gameState.mp - 8 
          });
        } else {
          setBattleLog(prev => [...prev, 'MPが足りない！']);
        }
        break;
    }
  };

  const useItem = (itemId: string) => {
    switch (itemId) {
      case 'potion':
        const healAmount = 50;
        const newHp = Math.min(gameState.maxHp, gameState.hp + healAmount);
        
        setBattleLog(prev => [...prev, `ポーションを使った！ ${healAmount}回復した！`]);
        updateGameState({ hp: newHp });
        break;
    }
  };

  const endBattle = () => {
    updateGameState({ inBattle: false });
    setCurrentEnemy(null);
    setBattleLog([]);
  };

  return {
    currentEnemy,
    battleLog,
    performAttack,
    useSkill,
    useItem,
    endBattle,
  };
}