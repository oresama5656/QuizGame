import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';

interface QuizData {
  productName: string;
  genericName: string;
  options: string[];
}

interface Enemy {
  id: string;
  name: string;
  image: string;
  hp: number;
  maxHp: number;
}

interface QuizBattleScreenProps {
  quizData: QuizData[];
  enemy: Enemy;
  onBattleComplete: (victory: boolean) => void;
}

export default function QuizBattleScreen({ quizData, enemy, onBattleComplete }: QuizBattleScreenProps) {
  const { gameState, updateGameState } = useGameState();
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [enemyCount, setEnemyCount] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(enemy);
  const [fadeAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const generateNewQuiz = () => {
    if (quizData.length === 0) return;
    
    const randomQuiz = quizData[Math.floor(Math.random() * quizData.length)];
    setCurrentQuiz(randomQuiz);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || !currentQuiz) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuiz.genericName;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      // 正解時の処理
      setTimeout(() => {
        const newCount = enemyCount + 1;
        setEnemyCount(newCount);
        
        // 敵を倒すアニメーション
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start(() => {
          if (newCount >= 10) {
            // 10体倒してクリア
            onBattleComplete(true);
          } else {
            // 次の敵を生成
            generateNextEnemy();
            generateNewQuiz();
            
            // フェードイン
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }).start();
          }
        });
      }, 1500);
    } else {
      // 不正解時の処理
      const damage = Math.floor(Math.random() * 15) + 10;
      const newHp = Math.max(1, gameState.hp - damage);
      updateGameState({ hp: newHp });
      
      if (newHp <= 1) {
        setTimeout(() => {
          onBattleComplete(false);
        }, 1500);
      } else {
        setTimeout(() => {
          generateNewQuiz();
        }, 1500);
      }
    }
  };

  const generateNextEnemy = () => {
    const enemies = [
      {
        id: 'slime',
        name: 'スライム',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
        hp: 30,
        maxHp: 30,
      },
      {
        id: 'goblin',
        name: 'ゴブリン',
        image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
        hp: 50,
        maxHp: 50,
      },
      {
        id: 'orc',
        name: 'オーク',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
        hp: 80,
        maxHp: 80,
      },
    ];
    
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setCurrentEnemy(randomEnemy);
  };

  if (!currentQuiz) {
    return (
      <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
        <Text style={styles.loadingText}>クイズを準備中...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
      {/* 上部ステータス */}
      <View style={styles.statusBar}>
        <Text style={styles.statusText}>敵を倒した数: {enemyCount}/10</Text>
        <Text style={styles.statusText}>HP: {gameState.hp}/{gameState.maxHp}</Text>
      </View>

      {/* 敵キャラクター表示エリア */}
      <View style={styles.enemyArea}>
        <Animated.View style={[styles.enemyContainer, { opacity: fadeAnim }]}>
          <Image source={{ uri: currentEnemy.image }} style={styles.enemyImage} />
          <Text style={styles.enemyName}>{currentEnemy.name}</Text>
        </Animated.View>
      </View>

      {/* 問題文エリア */}
      <View style={styles.questionArea}>
        <View style={styles.questionBox}>
          <Text style={styles.questionTitle}>黒ウィズクイズ</Text>
          <Text style={styles.questionText}>
            {currentQuiz.productName}の一般名は？
          </Text>
        </View>
      </View>

      {/* 選択肢エリア */}
      <View style={styles.optionsArea}>
        {currentQuiz.options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && (isCorrect ? styles.correctOption : styles.incorrectOption),
              selectedAnswer && selectedAnswer !== option && option === currentQuiz.genericName && styles.correctOption,
            ]}
            onPress={() => handleAnswerSelect(option)}
            disabled={selectedAnswer !== null}
          >
            <View style={styles.optionContent}>
              <View style={styles.optionNumber}>
                <Text style={styles.optionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.optionText}>{option}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 結果表示 */}
      {showResult && (
        <View style={styles.resultOverlay}>
          <View style={styles.resultBox}>
            <Text style={[styles.resultText, isCorrect ? styles.correctText : styles.incorrectText]}>
              {isCorrect ? '正解！' : '不正解...'}
            </Text>
            {isCorrect && (
              <Text style={styles.resultSubText}>敵にダメージを与えた！</Text>
            )}
            {!isCorrect && (
              <Text style={styles.resultSubText}>ダメージを受けた！</Text>
            )}
          </View>
        </View>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 10,
  },
  statusText: {
    color: '#ffd700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  enemyArea: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  enemyContainer: {
    alignItems: 'center',
  },
  enemyImage: {
    width: 200,
    height: 200,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#8b4513',
  },
  enemyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionArea: {
    flex: 0.25,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionBox: {
    backgroundColor: '#8b4513',
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: '#ffd700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 10,
  },
  questionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsArea: {
    flex: 0.35,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-around',
  },
  optionButton: {
    backgroundColor: '#654321',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b4513',
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  correctOption: {
    backgroundColor: '#2e7d32',
    borderColor: '#4caf50',
  },
  incorrectOption: {
    backgroundColor: '#c62828',
    borderColor: '#f44336',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  optionNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  optionNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#8b4513',
  },
  optionText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    flex: 1,
  },
  resultOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultBox: {
    backgroundColor: '#8b4513',
    borderRadius: 20,
    padding: 30,
    borderWidth: 3,
    borderColor: '#ffd700',
    alignItems: 'center',
  },
  resultText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  correctText: {
    color: '#4caf50',
  },
  incorrectText: {
    color: '#f44336',
  },
  resultSubText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
  },
});