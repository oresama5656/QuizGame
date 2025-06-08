import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';
import QuizBattleScreen from '@/app/components/QuizBattleScreen';
import { QUIZ_DATA } from '@/app/data/quizData';

// 戦闘背景画像のリスト（差し替え可能）
const BATTLE_BACKGROUNDS = [
  'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800', // 森
  'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800', // 山
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800', // 砂漠
  'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800', // 洞窟
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800', // 城
];

export default function BattleScreen() {
  const { gameState, updateGameState } = useGameState();
  const [currentEnemy, setCurrentEnemy] = useState({
    id: 'slime',
    name: 'スライム',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 60,
    maxHp: 60,
  });
  const [battleBackground, setBattleBackground] = useState(BATTLE_BACKGROUNDS[0]);

  useEffect(() => {
    if (!gameState.inBattle) {
      router.replace('/map');
      return;
    }

    // 現在の場所に応じて背景を設定
    const backgroundIndex = getBattleBackgroundIndex(gameState.currentLocation);
    setBattleBackground(BATTLE_BACKGROUNDS[backgroundIndex]);
  }, [gameState.inBattle, gameState.currentLocation]);

  const getBattleBackgroundIndex = (location: string): number => {
    switch (location) {
      case 'forest':
        return 0; // 森
      case 'mountain':
        return 1; // 山
      case 'desert':
        return 2; // 砂漠
      case 'castle':
        return 4; // 城
      default:
        return 0; // デフォルトは森
    }
  };

  const handleBattleComplete = (victory: boolean) => {
    if (victory) {
      // 勝利時の処理
      const expGained = 300;
      const goldGained = 150;
      
      updateGameState({ 
        inBattle: false,
        exp: gameState.exp + expGained,
        gold: gameState.gold + goldGained
      });
      
      Alert.alert(
        '🎉 戦闘勝利！', 
        `10体の敵を討伐しました！\n\n💫 経験値: +${expGained}\n💰 ゴールド: +${goldGained}`,
        [{ text: 'マップに戻る', onPress: () => router.replace('/map') }]
      );
    } else {
      // 敗北時の処理
      updateGameState({ inBattle: false });
      Alert.alert(
        '💀 戦闘敗北...', 
        'HPが危険な状態になりました。\n体力を回復してから再挑戦しましょう。',
        [{ text: 'マップに戻る', onPress: () => router.replace('/map') }]
      );
    }
  };

  if (!gameState.inBattle) {
    return (
      <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
        <View style={styles.noBattleContainer}>
          <Text style={styles.noBattleText}>戦闘はありません</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <QuizBattleScreen
      quizData={QUIZ_DATA}
      enemy={currentEnemy}
      onBattleComplete={handleBattleComplete}
      backgroundImage={battleBackground}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  noBattleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBattleText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
});