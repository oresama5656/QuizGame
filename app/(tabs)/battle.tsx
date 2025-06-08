import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sword, Shield, Heart, Zap } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';
import { useBattleSystem } from '@/hooks/useBattleSystem';

export default function BattleScreen() {
  const { gameState, updateGameState } = useGameState();
  const { currentEnemy, battleLog, performAttack, useSkill, useItem, endBattle } = useBattleSystem();
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [animationValue] = useState(new Animated.Value(0));

  useEffect(() => {
    if (gameState.inBattle) {
      startBattleAnimation();
    }
  }, [gameState.inBattle]);

  const startBattleAnimation = () => {
    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const handleAttack = () => {
    performAttack();
    setActionMenuVisible(false);
  };

  const handleSkill = (skillId: string) => {
    useSkill(skillId);
    setActionMenuVisible(false);
  };

  const handleItem = (itemId: string) => {
    useItem(itemId);
    setActionMenuVisible(false);
  };

  if (!gameState.inBattle || !currentEnemy) {
    return (
      <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
        <View style={styles.noBattleContainer}>
          <Text style={styles.noBattleText}>戦闘はありません</Text>
          <Text style={styles.noBattleSubtext}>物語タブから戦闘を開始してください</Text>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
      <View style={styles.battleArea}>
        {/* Enemy Section */}
        <Animated.View
          style={[
            styles.enemySection,
            {
              opacity: animationValue,
              transform: [
                {
                  translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <Image source={{ uri: currentEnemy.image }} style={styles.enemyImage} />
          <Text style={styles.enemyName}>{currentEnemy.name}</Text>
          <View style={styles.enemyStats}>
            <View style={styles.hpBar}>
              <View
                style={[
                  styles.hpFill,
                  {
                    width: `${(currentEnemy.hp / currentEnemy.maxHp) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.hpText}>
              {currentEnemy.hp}/{currentEnemy.maxHp}
            </Text>
          </View>
        </Animated.View>

        {/* Player Section */}
        <Animated.View
          style={[
            styles.playerSection,
            {
              opacity: animationValue,
              transform: [
                {
                  translateY: animationValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [50, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.playerStats}>
            <Text style={styles.playerName}>勇者</Text>
            <View style={styles.playerStatRow}>
              <Heart size={16} color="#d32f2f" />
              <Text style={styles.statText}>
                {gameState.hp}/{gameState.maxHp}
              </Text>
            </View>
            <View style={styles.playerStatRow}>
              <Zap size={16} color="#ffd700" />
              <Text style={styles.statText}>
                {gameState.mp}/{gameState.maxMp}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Battle Log */}
        <View style={styles.battleLogContainer}>
          <Text style={styles.battleLogTitle}>戦闘ログ</Text>
          {battleLog.slice(-3).map((log, index) => (
            <Text key={index} style={styles.battleLogText}>
              {log}
            </Text>
          ))}
        </View>

        {/* Action Menu */}
        <View style={styles.actionMenu}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setActionMenuVisible(!actionMenuVisible)}
          >
            <Text style={styles.actionButtonText}>行動</Text>
          </TouchableOpacity>

          {actionMenuVisible && (
            <View style={styles.actionOptions}>
              <TouchableOpacity style={styles.actionOption} onPress={handleAttack}>
                <Sword size={20} color="#d32f2f" />
                <Text style={styles.actionOptionText}>攻撃</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionOption}
                onPress={() => handleSkill('fireball')}
              >
                <Zap size={20} color="#ff9800" />
                <Text style={styles.actionOptionText}>火球</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionOption}
                onPress={() => handleSkill('heal')}
              >
                <Heart size={20} color="#4caf50" />
                <Text style={styles.actionOptionText}>回復</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionOption}
                onPress={() => handleItem('potion')}
              >
                <Shield size={20} color="#2196f3" />
                <Text style={styles.actionOptionText}>ポーション</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </LinearGradient>
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
    paddingHorizontal: 20,
  },
  noBattleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 10,
  },
  noBattleSubtext: {
    fontSize: 16,
    color: '#e3f2fd',
    textAlign: 'center',
  },
  battleArea: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  enemySection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  enemyImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 10,
  },
  enemyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#d32f2f',
    marginBottom: 10,
  },
  enemyStats: {
    alignItems: 'center',
  },
  hpBar: {
    width: 200,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  hpFill: {
    height: '100%',
    backgroundColor: '#d32f2f',
  },
  hpText: {
    fontSize: 14,
    color: '#e3f2fd',
    marginTop: 5,
  },
  playerSection: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  playerStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  playerStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#e3f2fd',
    marginLeft: 5,
  },
  battleLogContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 80,
  },
  battleLogTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 10,
  },
  battleLogText: {
    fontSize: 14,
    color: '#e3f2fd',
    marginBottom: 5,
  },
  actionMenu: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
  },
  actionButton: {
    backgroundColor: '#ffd700',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  actionOptions: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderRadius: 10,
    marginTop: 10,
    overflow: 'hidden',
  },
  actionOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionOptionText: {
    fontSize: 16,
    color: '#e3f2fd',
    marginLeft: 10,
  },
});