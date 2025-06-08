import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';
import QuizComponent from '@/app/components/QuizComponent';

// 仮のクイズデータ
const QUIZ_DATA = [
  {
    productName: 'アスピリン',
    genericName: 'アセチルサリチル酸',
    options: ['アセチルサリチル酸', 'イブプロフェン', 'アセトアミノフェン', 'ロキソプロフェン']
  },
  {
    productName: 'イブ',
    genericName: 'イブプロフェン',
    options: ['アセチルサリチル酸', 'イブプロフェン', 'アセトアミノフェン', 'ロキソプロフェン']
  },
  {
    productName: 'カロナール',
    genericName: 'アセトアミノフェン',
    options: ['アセチルサリチル酸', 'イブプロフェン', 'アセトアミノフェン', 'ロキソプロフェン']
  },
  {
    productName: 'ロキソニン',
    genericName: 'ロキソプロフェン',
    options: ['アセチルサリチル酸', 'イブプロフェン', 'アセトアミノフェン', 'ロキソプロフェン']
  }
];

export default function BattleScreen() {
  const { gameState, updateGameState } = useGameState();
  const [battleCount, setBattleCount] = useState(0);
  const [currentQuiz, setCurrentQuiz] = useState(QUIZ_DATA[0]);

  useEffect(() => {
    if (!gameState.inBattle) {
      router.replace('/map');
      return;
    }

    // 戦闘開始時にランダムなクイズを設定
    setCurrentQuiz(QUIZ_DATA[Math.floor(Math.random() * QUIZ_DATA.length)]);
  }, [gameState.inBattle]);

  const handleQuizComplete = (isCorrect: boolean) => {
    if (isCorrect) {
      setBattleCount(prev => {
        const newCount = prev + 1;
        if (newCount >= 10) {
          // 10連戦クリア
          updateGameState({ 
            inBattle: false,
            exp: gameState.exp + 100, // 経験値獲得
            gold: gameState.gold + 50  // ゴールド獲得
          });
          Alert.alert('10連戦クリア！', 'おめでとうございます！', [
            { text: 'OK', onPress: () => router.replace('/map') }
          ]);
        } else {
          // 次のクイズを設定
          setCurrentQuiz(QUIZ_DATA[Math.floor(Math.random() * QUIZ_DATA.length)]);
        }
        return newCount;
      });
    } else {
      // 不正解の場合、HPが減少
      const damage = Math.floor(Math.random() * 10) + 5; // 5-15のダメージ
      const newHp = Math.max(1, gameState.hp - damage);
      updateGameState({ hp: newHp });

      if (newHp <= 1) {
        // HPが1になったら戦闘終了
        updateGameState({ inBattle: false });
        Alert.alert('戦闘終了', 'HPが危険な状態になりました。', [
          { text: 'OK', onPress: () => router.replace('/map') }
        ]);
      } else {
        // 次のクイズを設定
        setCurrentQuiz(QUIZ_DATA[Math.floor(Math.random() * QUIZ_DATA.length)]);
      }
    }
  };

  if (!gameState.inBattle) {
    return (
      <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
        <View style={styles.noBattleContainer}>
          <Text style={styles.noBattleText}>戦闘はありません</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>戦闘</Text>
        <Text style={styles.battleCount}>連続正解: {battleCount}/10</Text>
      </View>

      <View style={styles.battleContent}>
        <QuizComponent
          question={currentQuiz.productName}
          options={currentQuiz.options}
          correctAnswer={currentQuiz.genericName}
          onComplete={handleQuizComplete}
        />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  battleCount: {
    fontSize: 18,
    color: '#fff',
  },
  battleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
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