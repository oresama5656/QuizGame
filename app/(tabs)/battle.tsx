import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    // 現在の場所に応じて背景を設定（inBattleチェックを削除）
    const backgroundIndex = getBattleBackgroundIndex(gameState.currentLocation);
    setBattleBackground(BATTLE_BACKGROUNDS[backgroundIndex]);

    // 敵の情報をセット（共通の敵データ関数を使用）
    setCurrentEnemy(getRandomEnemyForLocation(gameState.currentLocation));
  }, [gameState.currentLocation, gameState.inBattle]); // inBattleを依存配列に追加

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
        '�� 戦闘勝利！', 
        `敵を討伐しました！\n\n💫 経験値: +${expGained}\n💰 ゴールド: +${goldGained}`,
        [
          { 
            text: '再挑戦する', 
            onPress: () => {
              // マップページに一度戻ってすぐに再戦闘開始
              router.replace('/map');
            } 
          },
          { 
            text: 'マップに戻る', 
            onPress: () => router.replace('/map'),
            style: 'cancel'
          }
        ]
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

  // 戦闘画面が表示されたときに強制的に戦闘状態にする
  // これにより、マップから直接アクセスした場合にのみ戦闘が始まる
  if (!gameState.inBattle) {
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