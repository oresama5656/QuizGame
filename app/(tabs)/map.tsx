import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Lock, CircleCheck as CheckCircle, Star, Sword, Crown } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';
import { router, useFocusEffect } from 'expo-router';

export default function MapScreen() {
  const { gameState, updateGameState } = useGameState();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // 画面がフォーカスされるたびに実行
  useFocusEffect(
    useCallback(() => {
      console.log('マップ画面フォーカス');
      
      // バトル画面から戻ってきた場合のみ、battleInProgressをリセット
      // この処理は不要になったので削除
      
      return () => {
        console.log('マップ画面フォーカス解除');
      };
    }, [])
  );

  const locations = [
    {
      id: 'village',
      name: '薬学アカデミー',
      description: '薬剤師のための学習拠点。ここで休息して体力を回復できます。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 1,
      unlocked: true,
      completed: true,
      type: 'safe',
      enemies: [],
      rewards: ['基本装備', '50G'],
    },
    {
      id: 'forest',
      name: '糖尿病治療薬の森',
      description: '糖尿病治療薬に関する知識を試す初級エリア。DPP-4阻害薬やSGLT2阻害薬などの問題が出題されます。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 1,
      unlocked: true,
      completed: false,
      type: 'dungeon',
      enemies: ['メトホルミン', 'グリメピリド', 'シタグリプチン'],
      rewards: ['糖尿病治療薬の知識', '100G', '経験値200'],
    },
    {
      id: 'mountain',
      name: '糖尿病治療薬の高地',
      description: '糖尿病治療薬に関する応用問題が出題される中級エリア。作用機序や副作用について詳しく学べます。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 2,
      // unlocked: gameState.level >= 2,
      unlocked: true, // デバッグ用
      completed: false,
      type: 'dungeon',
      enemies: ['インスリン製剤', 'SGLT2阻害薬', 'GLP-1受容体作動薬'],
      rewards: ['糖尿病治療の応用知識', '300G', '経験値500'],
    },
    {
      id: 'desert',
      name: '抗血小板薬の砂漠',
      description: '抗血小板薬に関する知識を試す中級エリア。アスピリンやクロピドグレルなどの問題が出題されます。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 8,
      // unlocked: gameState.level >= 8,
      unlocked: true, // デバッグ用
      completed: false,
      type: 'dungeon',
      enemies: ['アスピリン', 'クロピドグレル', 'プラスグレル'],
      rewards: ['抗血小板薬の知識', '500G', '経験値800'],
    },
    {
      id: 'castle',
      name: '抗血小板薬の要塞',
      description: '抗血小板薬に関する高度な問題が出題される上級エリア。作用機序や相互作用について詳しく学べます。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 15,
      // unlocked: gameState.level >= 15,
      unlocked: true, // デバッグ用
      completed: false,
      type: 'boss',
      enemies: ['チクロピジン', 'シロスタゾール', '抗血小板薬マスター'],
      rewards: ['抗血小板薬の応用知識', '2000G', '経験値2000'],
    },
    {
      id: 'town',
      name: '薬学図書館',
      description: '様々な薬学書が集まる知識の宝庫。ここで新しい薬剤の情報を得ることができます。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 3,
      // unlocked: gameState.level >= 3,
      unlocked: true, // デバッグ用
      completed: false,
      type: 'safe',
      enemies: [],
      rewards: ['薬学知識', '参考書', '情報収集'],
    },
  ];

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(null);  // 一度選択をリセット
    setTimeout(() => {
      setSelectedLocation(locationId);  // 次フレームで再セット
    }, 0);
  };

  const handleExplore = (location: any) => {
    if (location.type === 'dungeon' || location.type === 'boss') {
      // まず確実にbattleInProgressをtrueに設定
      console.log('探索開始: battleInProgressをtrueに設定');
      
      updateGameState({ 
        battleInProgress: true,
        currentLocation: location.id,
        hp: gameState.maxHp,
        mp: gameState.maxMp,
        _nonce: Date.now()  // 常に新しいオブジェクト参照を渡す
      });
      
      // 更新後の状態を確認
      console.log('battleInProgress設定後:', true);
      
      // ルートディレクトリのバトル画面に遷移
      router.replace({
        pathname: '/battle',
        params: { _: Date.now() }  // 毎回違うURLでBattleScreenをマウント
      });
    } else if (location.type === 'safe') {
      Alert.alert(
        '安全地帯', 
        `${location.name}は安全な場所です。休息すると全回復します。`,
        [
          {
            text: '休息する',
            onPress: () => {
              updateGameState({
                hp: gameState.maxHp,
                mp: gameState.maxMp,
                _nonce: Date.now()  // 常に新しいオブジェクト参照を渡す
              });
              Alert.alert('回復完了', 'HPとMPが全回復しました！');
            }
          },
          {
            text: 'キャンセル',
            style: 'cancel'
          }
        ]
      );
    }
  };

  const getLocationIcon = (type: string, completed: boolean) => {
    if (completed) {
      return <CheckCircle size={24} color="#4caf50" />;
    }
    switch (type) {
      case 'safe':
        return <MapPin size={24} color="#2196f3" />;
      case 'dungeon':
        return <Sword size={24} color="#ff9800" />;
      case 'boss':
        return <Crown size={24} color="#d32f2f" />;
      default:
        return <MapPin size={24} color="#9e9e9e" />;
    }
  };

  const selectedLoc = locations.find(loc => loc.id === selectedLocation);

  return (
    <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>薬学クイズマップ</Text>
        <View style={styles.playerInfo}>
          <Text style={styles.playerLevel}>Lv.{gameState.level}</Text>
        </View>
      </View>

      <ScrollView style={styles.mapContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.locationsGrid}>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.locationCard,
                !location.unlocked && styles.lockedLocation,
                location.id === selectedLocation && styles.selectedLocation,
              ]}
              onPress={() => handleLocationSelect(location.id)}
              disabled={!location.unlocked}
            >
              <Image source={{ uri: location.image }} style={styles.locationImage} />
              <View style={styles.locationOverlay}>
                <View style={styles.locationHeader}>
                  {getLocationIcon(location.type, location.completed)}
                  {!location.unlocked && (
                    <Lock size={20} color="#9e9e9e" style={styles.lockIcon} />
                  )}
                </View>
                <Text style={[
                  styles.locationName,
                  !location.unlocked && styles.lockedText,
                ]}>
                  {location.name}
                </Text>
                <Text style={styles.locationLevel}>
                  推奨レベル: {location.level}
                </Text>
                {location.completed && (
                  <View style={styles.completedBadge}>
                    <Star size={16} color="#ffd700" />
                    <Text style={styles.completedText}>クリア済み</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Location Details */}
      {selectedLoc && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsTitle}>{selectedLoc.name}</Text>
          <Text style={styles.detailsDescription}>{selectedLoc.description}</Text>
          
          {selectedLoc.enemies.length > 0 && (
            <View style={styles.enemiesContainer}>
              <Text style={styles.enemiesTitle}>出現モンスター:</Text>
              <View style={styles.enemiesList}>
                {selectedLoc.enemies.map((enemy, index) => (
                  <Text key={index} style={styles.enemyText}>{enemy}</Text>
                ))}
              </View>
            </View>
          )}

          <View style={styles.rewardsContainer}>
            <Text style={styles.rewardsTitle}>報酬:</Text>
            <View style={styles.rewardsList}>
              {selectedLoc.rewards.map((reward, index) => (
                <Text key={index} style={styles.rewardText}>{reward}</Text>
              ))}
            </View>
          </View>

          <View style={styles.actionsContainer}>
            {selectedLoc.type === 'safe' ? (
              <TouchableOpacity 
                style={styles.visitButton}
                onPress={() => {
                  // 安全地帯でも現在地を設定する
                  updateGameState({
                    currentLocation: selectedLoc.id,
                    _nonce: Date.now()
                  });
                  handleExplore(selectedLoc);
                }}
              >
                <Text style={styles.visitButtonText}>訪問する</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.exploreButton,
                  gameState.level < selectedLoc.level && styles.disabledButton,
                ]}
                onPress={() => handleExplore(selectedLoc)}
                // disabled={gameState.level < selectedLoc.level} // デバッグ用
                disabled={false} // デバッグ用
              >
                <Text style={styles.exploreButtonText}>
                  {selectedLoc.type === 'boss' ? '挑戦する' : '探索する'}
                </Text>
              </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  playerInfo: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  playerLevel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  mapContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  locationCard: {
    width: '48%',
    height: 120,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  lockedLocation: {
    opacity: 0.5,
  },
  selectedLocation: {
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  locationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  locationOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 10,
    justifyContent: 'space-between',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  lockIcon: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  locationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e3f2fd',
    textAlign: 'center',
  },
  lockedText: {
    color: '#9e9e9e',
  },
  locationLevel: {
    fontSize: 12,
    color: '#ffd700',
    textAlign: 'center',
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  completedText: {
    fontSize: 10,
    color: '#ffd700',
    marginLeft: 5,
  },
  detailsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    maxHeight: 300,
  },
  detailsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 10,
  },
  detailsDescription: {
    fontSize: 14,
    color: '#e3f2fd',
    lineHeight: 20,
    marginBottom: 15,
  },
  enemiesContainer: {
    marginBottom: 15,
  },
  enemiesTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 5,
  },
  enemiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  enemyText: {
    fontSize: 12,
    color: '#e3f2fd',
    backgroundColor: 'rgba(211, 47, 47, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  rewardsContainer: {
    marginBottom: 15,
  },
  rewardsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 5,
  },
  rewardsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  rewardText: {
    fontSize: 12,
    color: '#e3f2fd',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 5,
    marginBottom: 5,
  },
  actionsContainer: {
    alignItems: 'center',
  },
  exploreButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  visitButton: {
    backgroundColor: '#2196f3',
    borderRadius: 10,
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  disabledButton: {
    backgroundColor: '#9e9e9e',
    opacity: 0.5,
  },
  exploreButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  visitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});