import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sword, Shield, Heart, Zap, TrendingUp, Award } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';

export default function CharacterScreen() {
  const { gameState, updateGameState } = useGameState();

  const handleLevelUp = () => {
    if (gameState.exp >= gameState.expToNext) {
      updateGameState({
        level: gameState.level + 1,
        exp: gameState.exp - gameState.expToNext,
        expToNext: Math.floor(gameState.expToNext * 1.5),
        maxHp: gameState.maxHp + 10,
        maxMp: gameState.maxMp + 5,
        attack: gameState.attack + 3,
        defense: gameState.defense + 2,
        hp: gameState.maxHp + 10,
        mp: gameState.maxMp + 5,
      });
    }
  };

  const skills = [
    { name: '剣術', level: 3, description: '基本的な剣の技術' },
    { name: '魔法', level: 2, description: '初級魔法の知識' },
    { name: '回復', level: 2, description: '治癒の魔法' },
    { name: '防御', level: 1, description: '盾の扱い' },
  ];

  const achievements = [
    { name: '初めての戦闘', description: '最初の敵を倒した', unlocked: true },
    { name: '冒険者', description: 'レベル5に到達', unlocked: gameState.level >= 5 },
    { name: '勇者', description: 'レベル10に到達', unlocked: gameState.level >= 10 },
    { name: '伝説', description: 'レベル20に到達', unlocked: gameState.level >= 20 },
  ];

  return (
    <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=200' }}
            style={styles.characterImage}
          />
          <Text style={styles.characterName}>勇者</Text>
          <Text style={styles.characterTitle}>選ばれし者</Text>
        </View>

        {/* Basic Stats */}
        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>基本ステータス</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <TrendingUp size={24} color="#ffd700" />
              <Text style={styles.statLabel}>レベル</Text>
              <Text style={styles.statValue}>{gameState.level}</Text>
            </View>
            <View style={styles.statItem}>
              <Heart size={24} color="#d32f2f" />
              <Text style={styles.statLabel}>HP</Text>
              <Text style={styles.statValue}>{gameState.hp}/{gameState.maxHp}</Text>
            </View>
            <View style={styles.statItem}>
              <Zap size={24} color="#2196f3" />
              <Text style={styles.statLabel}>MP</Text>
              <Text style={styles.statValue}>{gameState.mp}/{gameState.maxMp}</Text>
            </View>
            <View style={styles.statItem}>
              <Sword size={24} color="#ff9800" />
              <Text style={styles.statLabel}>攻撃力</Text>
              <Text style={styles.statValue}>{gameState.attack}</Text>
            </View>
            <View style={styles.statItem}>
              <Shield size={24} color="#4caf50" />
              <Text style={styles.statLabel}>防御力</Text>
              <Text style={styles.statValue}>{gameState.defense}</Text>
            </View>
            <View style={styles.statItem}>
              <Award size={24} color="#9c27b0" />
              <Text style={styles.statLabel}>経験値</Text>
              <Text style={styles.statValue}>{gameState.exp}/{gameState.expToNext}</Text>
            </View>
          </View>
        </View>

        {/* Experience Bar */}
        <View style={styles.expContainer}>
          <Text style={styles.expLabel}>次のレベルまで</Text>
          <View style={styles.expBar}>
            <View
              style={[
                styles.expFill,
                { width: `${(gameState.exp / gameState.expToNext) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.expText}>
            {gameState.exp}/{gameState.expToNext}
          </Text>
          {gameState.exp >= gameState.expToNext && (
            <TouchableOpacity style={styles.levelUpButton} onPress={handleLevelUp}>
              <Text style={styles.levelUpText}>レベルアップ！</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Skills */}
        <View style={styles.skillsContainer}>
          <Text style={styles.sectionTitle}>スキル</Text>
          {skills.map((skill, index) => (
            <View key={index} style={styles.skillItem}>
              <View style={styles.skillInfo}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillDescription}>{skill.description}</Text>
              </View>
              <View style={styles.skillLevel}>
                <Text style={styles.skillLevelText}>Lv.{skill.level}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsContainer}>
          <Text style={styles.sectionTitle}>実績</Text>
          {achievements.map((achievement, index) => (
            <View
              key={index}
              style={[
                styles.achievementItem,
                { opacity: achievement.unlocked ? 1 : 0.5 },
              ]}
            >
              <Award
                size={20}
                color={achievement.unlocked ? '#ffd700' : '#9e9e9e'}
              />
              <View style={styles.achievementInfo}>
                <Text
                  style={[
                    styles.achievementName,
                    { color: achievement.unlocked ? '#ffd700' : '#9e9e9e' },
                  ]}
                >
                  {achievement.name}
                </Text>
                <Text style={styles.achievementDescription}>
                  {achievement.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#ffd700',
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 5,
  },
  characterTitle: {
    fontSize: 16,
    color: '#e3f2fd',
    fontStyle: 'italic',
  },
  statsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 15,
  },
  statLabel: {
    fontSize: 12,
    color: '#9e9e9e',
    marginTop: 5,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e3f2fd',
  },
  expContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  expLabel: {
    fontSize: 16,
    color: '#ffd700',
    marginBottom: 10,
  },
  expBar: {
    height: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 10,
  },
  expFill: {
    height: '100%',
    backgroundColor: '#ffd700',
  },
  expText: {
    fontSize: 14,
    color: '#e3f2fd',
    textAlign: 'center',
  },
  levelUpButton: {
    backgroundColor: '#d32f2f',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    alignItems: 'center',
  },
  levelUpText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  skillsContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  skillItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 15,
  },
  skillInfo: {
    flex: 1,
  },
  skillName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e3f2fd',
    marginBottom: 5,
  },
  skillDescription: {
    fontSize: 14,
    color: '#9e9e9e',
  },
  skillLevel: {
    backgroundColor: '#ffd700',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  skillLevelText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  achievementsContainer: {
    marginHorizontal: 20,
    marginBottom: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 20,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 15,
  },
  achievementInfo: {
    flex: 1,
    marginLeft: 15,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#9e9e9e',
  },
});