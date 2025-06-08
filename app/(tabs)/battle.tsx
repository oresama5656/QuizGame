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
      const expGained = 300;
      const goldGained = 150;
      
      // 先にゲーム状態を更新
      updateGameState({ 
        inBattle: false,
        exp: gameState.exp + expGained,
        gold: gameState.gold + goldGained
      });
      
      // 戦闘進行中フラグを解除
      setBattleInProgress(false);
      
      // Alertを表示
      Alert.alert(
        '🎉 戦闘勝利！', 
        `敵を討伐しました！\n\n💫 経験値: +${expGained}\n💰 ゴールド: +${goldGained}`,
        [
          { 
            text: 'マップに戻る', 
            onPress: () => {
              router.replace('/map');
            }
          }
        ],
        { cancelable: false } // Androidでバックボタンでの閉じるを防止
      );
    } else {
      // 敗北時の処理
      // 先にゲーム状態を更新
      updateGameState({ inBattle: false });
      
      // 戦闘進行中フラグを解除
      setBattleInProgress(false);
      
      Alert.alert(
        '💀 戦闘敗北...', 
        'HPが危険な状態になりました。\n体力を回復してから再挑戦しましょう。',
        [{ 
          text: 'マップに戻る', 
          onPress: () => {
            router.replace('/map');
          } 
        }],
        { cancelable: false }
      );
    }
  };

  // battleInProgressがfalseの場合のみ、「戦闘はありません」画面を表示
  if (!gameState.inBattle && !battleInProgress) {
    return (
      <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
        <View style={styles.noBattleContainer}>
          <Text style={styles.noBattleText}>戦闘はありません</Text>
          <TouchableOpacity 
            style={styles.returnButton}
            onPress={() => router.replace('/map')}
          >
            <Text style={styles.returnButtonText}>マップに戻る</Text>
          </TouchableOpacity>
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
    marginBottom: 20,
  },
  returnButton: {
    backgroundColor: '#3949ab',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  returnButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});