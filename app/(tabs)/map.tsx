import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MapPin, Lock, CircleCheck as CheckCircle, Star, Sword, Crown } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';
import { router } from 'expo-router';

export default function MapScreen() {
  const { gameState, updateGameState } = useGameState();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    {
      id: 'village',
      name: '平和な村',
      description: '冒険の始まりの地。優しい村人たちが住んでいる。',
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
      name: '深い森',
      description: '古い樹木が立ち並ぶ神秘的な森。スライムやゴブリンが出現する。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 1,
      unlocked: true,
      completed: false,
      type: 'dungeon',
      enemies: ['スライム', 'ゴブリン', '森の狼'],
      rewards: ['鉄の剣', '100G', '経験値200'],
    },
    {
      id: 'mountain',
      name: '霧の山',
      description: '雲に覆われた険しい山道。強力なモンスターが潜んでいる。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 1,
      unlocked: gameState.level >= 5,
      completed: false,
      type: 'dungeon',
      enemies: ['山賊', '石のゴーレム', '氷の精霊'],
      rewards: ['鋼の剣', '300G', '経験値500'],
    },
    {
      id: 'desert',
      name: '灼熱の砂漠',
      description: '果てしなく続く砂の海。古代の遺跡が眠っている。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 8,
      unlocked: gameState.level >= 8,
      completed: false,
      type: 'dungeon',
      enemies: ['サンドワーム', '砂漠の盗賊', 'ミイラ'],
      rewards: ['魔法の杖', '500G', '経験値800'],
    },
    {
      id: 'castle',
      name: '魔王の城',
      description: '邪悪な力が渦巻く恐ろしい城。最終決戦の舞台。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 15,
      unlocked: gameState.level >= 15,
      completed: false,
      type: 'boss',
      enemies: ['魔王', '闇の騎士', 'ドラゴン'],
      rewards: ['伝説の剣', '2000G', '経験値2000'],
    },
    {
      id: 'town',
      name: '商業都市',
      description: '様々な商人が集まる賑やかな街。アイテムの売買ができる。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
      level: 3,
      unlocked: gameState.level >= 3,
      completed: false,
      type: 'safe',
      enemies: [],
      rewards: ['買い物', '宿屋', '情報収集'],
    },
  ];

  const handleLocationSelect = (location: any) => {
    if (!location.unlocked) return;
    setSelectedLocation(location.id);
  };

  const handleExplore = (location: any) => {
    if (location.type === 'dungeon' || location.type === 'boss') {
      updateGameState({ inBattle: true, currentLocation: location.id });
      router.push('/battle');
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
        <Text style={styles.title}>世界地図</Text>
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
              onPress={() => handleLocationSelect(location)}
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
              <TouchableOpacity style={styles.visitButton}>
                <Text style={styles.visitButtonText}>訪問する</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.exploreButton,
                  gameState.level < selectedLoc.level && styles.disabledButton,
                ]}
                onPress={() => handleExplore(selectedLoc)}
                disabled={gameState.level < selectedLoc.level}
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