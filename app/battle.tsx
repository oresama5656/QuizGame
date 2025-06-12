import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';
import QuizBattleScreen from '@/app/components/QuizBattleScreen';
import { getRandomEnemyForLocation, Enemy } from '@/app/data/enemyData';
import { getRandomQuizzes } from '@/app/quizData/loader';

// マップの各エリアに対応するクイズカテゴリの定義
const locationToCategory: { [location: string]: string } = {
  village: 'tounyou',    // 村エリア → 糖尿病クイズ（安全地帯なので実際には使われない）
  forest: 'tounyou',     // 森エリア → 糖尿病クイズ
  mountain: 'tounyou',   // 山エリア → 糖尿病クイズ（暫定）
  desert: 'kouketsuban', // 砂漠エリア → 抗血小板薬クイズ
  castle: 'kouketsuban', // 城エリア → 抗血小板薬クイズ（暫定）
  town: 'tounyou',       // 町エリア → 糖尿病クイズ（安全地帯なので実際には使われない）
  // 将来的に他のエリアとカテゴリを追加可能
};

// クイズの難易度設定（各エリアごとの問題数）
const locationToDifficulty: { [location: string]: number } = {
  village: 1,   // 村エリア → 1問（安全地帯なので実際には使われない）
  forest: 3,    // 森エリア → 3問
  mountain: 4,  // 山エリア → 4問
  desert: 4,    // 砂漠エリア → 4問
  castle: 5,    // 城エリア → 5問
  town: 1,      // 町エリア → 1問（安全地帯なので実際には使われない）
  // 将来的に他のエリアの難易度を追加可能
};

// battleスト（差し替え可能）
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
  const [quizData, setQuizData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // 勝敗結果を保持するRef
  const victoryRef = useRef<boolean | null>(null);
  // アラートが表示されたかどうかを追跡
  const alertShownRef = useRef(false);
  const battleCompleteHandledRef = useRef(false);

  // コンポーネントがマウントされたときに実行
  useEffect(() => {
    console.log('バトル画面マウント: 初期化処理');
    
    // 初期化処理
    alertShownRef.current = false;
    battleCompleteHandledRef.current = false;
    victoryRef.current = null;
    
    // battleInProgressが既にfalseになっていたら強制的にtrueに設定
    if (!gameState.battleInProgress) {
      console.log('バトル画面マウント: battleInProgressをtrueに強制設定');
      updateGameState({
        battleInProgress: true,
        _nonce: Date.now()
      });
    }
    
    // 現在のロケーションに基づいてクイズデータを読み込む
    loadQuizData();
    
    return () => {
      console.log('バトル画面アンマウント');
    };
  }, []);

  useEffect(() => {
    // 現在の場所に応じて背景を設定
    const backgroundIndex = getBattleBackgroundIndex(gameState.currentLocation);
    setBattleBackground(BATTLE_BACKGROUNDS[backgroundIndex]);

    // 敵の情報をセット
    setCurrentEnemy(getRandomEnemyForLocation(gameState.currentLocation));
    
    // 現在のロケーションに基づいてクイズデータを読み込む
    loadQuizData();
  }, [gameState.currentLocation]);

  // 現在のロケーションに基づいてクイズデータを読み込む
  const loadQuizData = () => {
    const location = gameState.currentLocation;
    if (!location) {
      setError('現在地が設定されていません');
      Alert.alert('エラー', '現在地が設定されていません。マップに戻ります。', [
        { text: 'OK', onPress: () => router.replace('/(tabs)/map') }
      ]);
      return;
    }

    const category = locationToCategory[location];
    if (!category) {
      setError(`エリア "${location}" に対応するクイズカテゴリがありません`);
      Alert.alert('エラー', `エリア "${location}" に対応するクイズカテゴリがありません。マップに戻ります。`, [
        { text: 'OK', onPress: () => router.replace('/(tabs)/map') }
      ]);
      return;
    }

    try {
      // 難易度（問題数）を取得
      const questionCount = locationToDifficulty[location] || 3; // デフォルトは3問
      
      // クイズデータを読み込む
      const selectedQuizzes = getRandomQuizzes(category, questionCount);
      
      // 新しいQuizData形式に変換
      const formattedQuizzes = selectedQuizzes.map(quiz => ({
        productName: quiz.question,
        genericName: quiz.correctAnswer,
        options: quiz.options
      }));
      
      setQuizData(formattedQuizzes);
      setError(null);
      console.log(`${location} エリア用の ${category} クイズを ${questionCount} 問読み込みました`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました';
      setError(errorMessage);
      Alert.alert('クイズデータ読み込みエラー', errorMessage, [
        { text: 'マップに戻る', onPress: () => router.replace('/(tabs)/map') }
      ]);
    }
  };

  const getBattleBackgroundIndex = (location: string): number => {
    switch (location) {
      case 'village':
        return 0; // 村は森の背景を使用
      case 'forest':
        return 0; // 森
      case 'mountain':
        return 1; // 山
      case 'desert':
        return 2; // 砂漠
      case 'castle':
        return 4; // 城
      case 'town':
        return 0; // 町は森の背景を使用
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
    
    console.log('戦闘完了:', victory ? '勝利' : '敗北');
    
    if (victory) {
      // 勝利時の処理
      updateGameState({
        battleInProgress: false,
        currentLocation: '',
        exp: gameState.exp + 600,
        gold: gameState.gold + 300,
        _nonce: Date.now(),
      });
      
      // アラートなしで直接マップ画面に戻る
      router.replace('/(tabs)/map');
    } else {
      // 敗北時の処理
      updateGameState({
        battleInProgress: false,
        currentLocation: '',
        hp: Math.max(1, gameState.hp),
        _nonce: Date.now(),
      });
      
      // アラートなしで直接マップ画面に戻る
      router.replace('/(tabs)/map');
    }
  };

  // エラーがある場合はエラーメッセージを表示
  if (error) {
    return (
      <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.errorText}>エラー: {error}</Text>
          <TouchableOpacity 
            style={styles.returnButton}
            onPress={() => router.replace('/(tabs)/map')}
          >
            <Text style={styles.returnButtonText}>マップに戻る</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    );
  }

  // クイズデータがロードされていない場合はローディング表示
  if (quizData.length === 0) {
    return (
      <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.loadingText}>クイズデータを読み込み中...</Text>
        </View>
      </LinearGradient>
    );
  }

  // 戦闘画面のメインコンテンツを表示
  return (
    <LinearGradient colors={['#2c1810', '#4a2c1a']} style={styles.container}>
      <View style={styles.contentContainer}>
        <QuizBattleScreen
          quizData={quizData}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff6b6b',
    textAlign: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  returnButton: {
    backgroundColor: '#ffd700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  returnButtonText: {
    color: '#2c1810',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 