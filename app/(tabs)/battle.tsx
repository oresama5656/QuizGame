import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';
import QuizBattleScreen from '@/app/components/QuizBattleScreen';
import { QUIZ_DATA } from '@/app/data/quizData';
import { getRandomEnemyForLocation, Enemy } from '@/app/data/enemyData';

// battleスト（差し替え可能）
const BATTLE_BACKGROUNDS = [
  'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800', // 森
  'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=800', // 山
  'https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg?auto=compress&cs=tinysrgb&w=800', // 砂漠
  'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800', // 洞窟
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=800', // 城
];

// フォールバックコンポーネント
const Fallback = () => (
  <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
    <View style={styles.contentContainer}>
      <Text style={styles.loadingText}>戦闘終了中...</Text>
    </View>
  </LinearGradient>
);

export default function BattleScreen() {
  const { gameState, updateGameState } = useGameState();
  const [currentEnemy, setCurrentEnemy] = useState<Enemy>(getRandomEnemyForLocation('forest'));
  const [battleBackground, setBattleBackground] = useState(BATTLE_BACKGROUNDS[0]);
  const [battleInProgress, setBattleInProgress] = useState(true);
  
  // 勝敗結果を保持するRef
  const victoryRef = useRef<boolean | null>(null);
  // アラートが表示されたかどうかを追跡
  const alertShownRef = useRef(false);
  const battleCompleteHandledRef = useRef(false);

  useEffect(() => {
    // コンポーネントがマウントされたときにリセット
    alertShownRef.current = false;
    battleCompleteHandledRef.current = false;
    victoryRef.current = null;
    
    // ゲームステートが更新されたときに戦闘状態を同期
    if (gameState.inBattle) {
      setBattleInProgress(true);
    }
  }, [gameState.inBattle]);

  // 戦闘終了時の処理を一本化
  useEffect(() => {
    if (!battleInProgress) {
      const victory = victoryRef.current;

      if (victory) {
        // 勝利時の処理
        updateGameState({
          inBattle: false,
          currentLocation: '',
          exp: gameState.exp + 600,
          gold: gameState.gold + 300,
          _nonce: Date.now(),
        });
        Alert.alert('🎉 戦闘勝利！', '600EXP / 300G を獲得', [{ text: 'OK' }], { cancelable: false });
      } else {
        // 敗北時の処理
        updateGameState({
          inBattle: false,
          currentLocation: '',
          hp: Math.max(1, gameState.hp),
          _nonce: Date.now(),
        });
        Alert.alert('💀 戦闘敗北…', 'HP を回復して再挑戦しましょう', [{ text: 'OK' }], { cancelable: false });
      }

      // マップ画面に遷移
      router.replace('/map');
    }
  }, [battleInProgress]);

  useEffect(() => {
    // 現在の場所に応じて背景を設定
    const backgroundIndex = getBattleBackgroundIndex(gameState.currentLocation);
    setBattleBackground(BATTLE_BACKGROUNDS[backgroundIndex]);

    // 敵の情報をセット
    setCurrentEnemy(getRandomEnemyForLocation(gameState.currentLocation));
  }, [gameState.currentLocation, gameState.inBattle]);

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
    // 既に処理済みの場合は早期リターン
    if (battleCompleteHandledRef.current) {
      return;
    }
    
    // 処理済みフラグを設定
    battleCompleteHandledRef.current = true;
    
    // 勝敗結果を保持
    victoryRef.current = victory;
    
    // 戦闘進行中フラグを解除するだけ
    setBattleInProgress(false);
  };

  // 戦闘が終了している場合はフォールバックコンポーネントを表示
  if (!battleInProgress) {
    return <Fallback />;
  }

  // 戦闘画面のメインコンテンツを表示
  return (
    <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
      <View style={styles.contentContainer}>
        <QuizBattleScreen
          quizData={QUIZ_DATA}
          enemy={currentEnemy}
          onBattleComplete={handleBattleComplete}
          backgroundImage={battleBackground}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
});