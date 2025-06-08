import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { Sword, Zap } from 'lucide-react-native';

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
  backgroundImage?: string;
}

export default function QuizBattleScreen({ 
  quizData, 
  enemy, 
  onBattleComplete,
  backgroundImage = 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=800'
}: QuizBattleScreenProps) {
  const { gameState, updateGameState } = useGameState();
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [enemyCount, setEnemyCount] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(enemy);
  
  // アニメーション用の値
  const [fadeAnim] = useState(new Animated.Value(1));
  const [shakeAnim] = useState(new Animated.Value(0));
  const [attackAnim] = useState(new Animated.Value(0));
  const [damageAnim] = useState(new Animated.Value(0));
  const [slashAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    generateNewQuiz();
  }, []);

  const generateNewQuiz = () => {
    if (quizData.length === 0) return;
    
    const randomQuiz = quizData[Math.floor(Math.random() * quizData.length)];
    setCurrentQuiz(randomQuiz);
    setSelectedAnswer(null);
  };

  const playAttackAnimation = () => {
    // 剣の攻撃エフェクト
    Animated.sequence([
      Animated.timing(attackAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slashAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(attackAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slashAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // 敵の震えエフェクト
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const playDamageAnimation = () => {
    // ダメージ数値の表示アニメーション
    Animated.sequence([
      Animated.timing(damageAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.delay(800),
      Animated.timing(damageAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAnswerSelect = (answer: string) => {
    if (selectedAnswer || !currentQuiz) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuiz.genericName;

    if (correct) {
      // 正解時：攻撃エフェクト
      playAttackAnimation();
      
      setTimeout(() => {
        const damage = Math.floor(Math.random() * 20) + 15; // 15-35のダメージ
        const newEnemyHp = Math.max(0, currentEnemy.hp - damage);
        
        setCurrentEnemy(prev => ({ ...prev, hp: newEnemyHp }));
        playDamageAnimation();
        
        if (newEnemyHp <= 0) {
          // 敵を倒した
          setTimeout(() => {
            Animated.timing(fadeAnim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }).start(() => {
              const newCount = enemyCount + 1;
              setEnemyCount(newCount);
              
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
          }, 1000);
        } else {
          // 敵はまだ生きている
          setTimeout(() => {
            generateNewQuiz();
          }, 1000);
        }
      }, 600);
    } else {
      // 不正解時：プレイヤーがダメージ
      setTimeout(() => {
        const damage = Math.floor(Math.random() * 15) + 10;
        const newHp = Math.max(1, gameState.hp - damage);
        updateGameState({ hp: newHp });
        
        if (newHp <= 1) {
          setTimeout(() => {
            onBattleComplete(false);
          }, 1000);
        } else {
          setTimeout(() => {
            generateNewQuiz();
          }, 1000);
        }
      }, 1000);
    }
  };

  const generateNextEnemy = () => {
    const enemies = [
      {
        id: 'slime',
        name: 'スライム',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
        hp: 60,
        maxHp: 60,
      },
      {
        id: 'goblin',
        name: 'ゴブリン',
        image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
        hp: 80,
        maxHp: 80,
      },
      {
        id: 'orc',
        name: 'オーク',
        image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
        hp: 100,
        maxHp: 100,
      },
      {
        id: 'dragon',
        name: 'ドラゴン',
        image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
        hp: 120,
        maxHp: 120,
      },
    ];
    
    const randomEnemy = enemies[Math.floor(Math.random() * enemies.length)];
    setCurrentEnemy(randomEnemy);
  };

  if (!currentQuiz) {
    return (
      <ImageBackground source={{ uri: backgroundImage }} style={styles.container}>
        <LinearGradient colors={['rgba(44, 24, 16, 0.8)', 'rgba(74, 44, 26, 0.8)']} style={styles.overlay}>
          <Text style={styles.loadingText}>クイズを準備中...</Text>
        </LinearGradient>
      </ImageBackground>
    );
  }

  const attackTransform = {
    transform: [
      {
        scale: attackAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.2],
        }),
      },
      {
        rotate: attackAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  const slashOpacity = slashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const shakeTransform = {
    transform: [
      {
        translateX: shakeAnim,
      },
    ],
  };

  const damageTransform = {
    opacity: damageAnim,
    transform: [
      {
        translateY: damageAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],
        }),
      },
      {
        scale: damageAnim.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0.5, 1.2, 1],
        }),
      },
    ],
  };

  return (
    <ImageBackground source={{ uri: backgroundImage }} style={styles.container}>
      <LinearGradient colors={['rgba(44, 24, 16, 0.7)', 'rgba(74, 44, 26, 0.7)']} style={styles.overlay}>
        {/* 上部ステータス */}
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>討伐数</Text>
            <Text style={styles.statusValue}>{enemyCount}/10</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>HP</Text>
            <View style={styles.hpBar}>
              <View 
                style={[
                  styles.hpFill, 
                  { width: `${(gameState.hp / gameState.maxHp) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.statusValue}>{gameState.hp}/{gameState.maxHp}</Text>
          </View>
        </View>

        {/* 敵キャラクター表示エリア */}
        <View style={styles.enemyArea}>
          <Animated.View style={[styles.enemyContainer, { opacity: fadeAnim }, shakeTransform]}>
            <Image source={{ uri: currentEnemy.image }} style={styles.enemyImage} />
            <Text style={styles.enemyName}>{currentEnemy.name}</Text>
            
            {/* 敵のHPバー */}
            <View style={styles.enemyHpContainer}>
              <View style={styles.enemyHpBar}>
                <View 
                  style={[
                    styles.enemyHpFill, 
                    { width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%` }
                  ]} 
                />
              </View>
              <Text style={styles.enemyHpText}>
                {currentEnemy.hp}/{currentEnemy.maxHp}
              </Text>
            </View>
          </Animated.View>

          {/* 攻撃エフェクト */}
          <Animated.View style={[styles.attackEffect, attackTransform]}>
            <Sword size={60} color="#ffd700" />
          </Animated.View>

          {/* 斬撃エフェクト */}
          <Animated.View style={[styles.slashEffect, { opacity: slashOpacity }]}>
            <Zap size={80} color="#ff4444" />
          </Animated.View>

          {/* ダメージ数値 */}
          <Animated.View style={[styles.damageNumber, damageTransform]}>
            <Text style={styles.damageText}>-25</Text>
          </Animated.View>
        </View>

        {/* 問題文エリア */}
        <View style={styles.questionArea}>
          <View style={styles.questionBox}>
            <Text style={styles.questionTitle}>薬学クイズバトル</Text>
            <Text style={styles.questionText}>
              {currentQuiz.productName}の一般名は？
            </Text>
          </View>
        </View>

        {/* 選択肢エリア */}
        <View style={styles.optionsArea}>
          <View style={styles.optionsGrid}>
            {currentQuiz.options.map((option, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  selectedAnswer === option && styles.selectedOption,
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
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
  },
  statusItem: {
    alignItems: 'center',
  },
  statusLabel: {
    color: '#ffd700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hpBar: {
    width: 100,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginVertical: 5,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  enemyArea: {
    flex: 0.4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    position: 'relative',
  },
  enemyContainer: {
    alignItems: 'center',
  },
  enemyImage: {
    width: 180,
    height: 180,
    borderRadius: 15,
    marginBottom: 10,
    borderWidth: 3,
    borderColor: '#8b4513',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  enemyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: 10,
  },
  enemyHpContainer: {
    alignItems: 'center',
  },
  enemyHpBar: {
    width: 120,
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    marginBottom: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#8b4513',
  },
  enemyHpFill: {
    height: '100%',
    backgroundColor: '#f44336',
  },
  enemyHpText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  attackEffect: {
    position: 'absolute',
    top: '30%',
    left: '60%',
    opacity: 0,
  },
  slashEffect: {
    position: 'absolute',
    top: '25%',
    left: '55%',
  },
  damageNumber: {
    position: 'absolute',
    top: '20%',
    right: '30%',
  },
  damageText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ff4444',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  questionArea: {
    flex: 0.25,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  questionBox: {
    backgroundColor: 'rgba(139, 69, 19, 0.95)',
    borderRadius: 15,
    padding: 20,
    borderWidth: 3,
    borderColor: '#ffd700',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  questionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: '#000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  questionText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  optionsArea: {
    flex: 0.35,
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionButton: {
    backgroundColor: 'rgba(101, 67, 33, 0.95)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8b4513',
    marginVertical: 4,
    width: '48%',  // ボタンの幅を48%に設定して2列に
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  selectedOption: {
    backgroundColor: 'rgba(139, 69, 19, 0.95)',
    borderColor: '#ffd700',
    transform: [{ scale: 0.98 }],
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  optionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffd700',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
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
  loadingText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    marginTop: 100,
    fontWeight: 'bold',
  },
});