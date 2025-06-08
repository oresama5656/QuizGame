import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';
import QuizBattleScreen from '@/app/components/QuizBattleScreen';
import { QUIZ_DATA } from '@/app/data/quizData';
import { getRandomEnemyForLocation, Enemy } from '@/app/data/enemyData';

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
  const [currentEnemy, setCurrentEnemy] = useState<Enemy>(getRandomEnemyForLocation('forest'));
  const [battleBackground, setBattleBackground] = useState(BATTLE_BACKGROUNDS[0]);
  const [battleInProgress, setBattleInProgress] = useState(true);
  
  // アラートが表示されたかどうかを追跡
  const alertShownRef = useRef(false);
  const battleCompleteHandledRef = useRef(false);

  useEffect(() => {
    // コンポーネントがマウントされたときにリセット
    alertShownRef.current = false;
    battleCompleteHandledRef.current = false;
    
    // ゲームステートが更新されたときに戦闘状態を同期
    if (gameState.inBattle) {
      setBattleInProgress(true);
    }
  }, [gameState.inBattle]);

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
    
    if (victory) {
      // 勝利時の処理
      const expGained = 600; // 2体分の経験値に増加
      const goldGained = 300; // 2体分の金額に増加
      
      // 現在のゲームステートを維持しながら必要な値だけを更新
      const newExp = gameState.exp + expGained;
      const newGold = gameState.gold + goldGained;
      
      // ゲーム状態を更新
      updateGameState({
        inBattle: false,
        exp: newExp,
        gold: newGold
      });
      
      // 戦闘進行中フラグを解除
      setBattleInProgress(false);
      
      // Alertを表示
      Alert.alert(
        '🎉 戦闘勝利！', 
        `2体の敵を討伐しました！\n\n💫 経験値: +${expGained}\n💰 ゴールド: +${goldGained}`,
        [
          { 
            text: 'マップ選択画面に戻る', 
            onPress: () => {
              router.back();
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      // 敗北時の処理
      // ゲーム状態を更新
      updateGameState({
        inBattle: false,
        hp: Math.max(1, gameState.hp) // HPが0になることを防止
      });
      
      // 戦闘進行中フラグを解除
      setBattleInProgress(false);
      
      Alert.alert(
        '💀 戦闘敗北...', 
        'HPが危険な状態になりました。\n体力を回復してから再挑戦しましょう。',
        [{ 
          text: 'マップ選択画面に戻る', 
          onPress: () => {
            router.back();
          } 
        }],
        { cancelable: false }
      );
    }
  };

  // 戦闘が終了している場合はマップ選択画面に戻る
  if (!gameState.inBattle && !battleInProgress) {
    router.back();
    return null;
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
});