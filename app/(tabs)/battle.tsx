import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';
import QuizBattleScreen from '@/app/components/QuizBattleScreen';
import { QUIZ_DATA } from '@/app/data/quizData';

export default function BattleScreen() {
  const { gameState, updateGameState } = useGameState();
  const [currentEnemy, setCurrentEnemy] = useState({
    id: 'slime',
    name: 'スライム',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 30,
    maxHp: 30,
  });

  useEffect(() => {
    if (!gameState.inBattle) {
      router.replace('/map');
      return;
    }
  }, [gameState.inBattle]);

  const handleBattleComplete = (victory: boolean) => {
    if (victory) {
      // 勝利時の処理
      const expGained = 200;
      const goldGained = 100;
      
      updateGameState({ 
        inBattle: false,
        exp: gameState.exp + expGained,
        gold: gameState.gold + goldGained
      });
      
      Alert.alert(
        '戦闘勝利！', 
        `10体の敵を倒しました！\n経験値: +${expGained}\nゴールド: +${goldGained}`,
        [{ text: 'OK', onPress: () => router.replace('/map') }]
      );
    } else {
      // 敗北時の処理
      updateGameState({ inBattle: false });
      Alert.alert(
        '戦闘敗北...', 
        'HPが危険な状態になりました。',
        [{ text: 'OK', onPress: () => router.replace('/map') }]
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
  },
});