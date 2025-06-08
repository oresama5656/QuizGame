import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Play } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';

export default function StoryScreen() {
  const { gameState, updateGameState } = useGameState();
  const [currentScene, setCurrentScene] = useState(0);

  const storyScenes = [
    {
      title: '運命の始まり',
      text: '古い伝説によると、この世界は光と闇の永遠の戦いの舞台である。君は選ばれし者として、世界の平和を取り戻す使命を負っている。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400',
      choices: [
        { text: '冒険を始める', action: () => setCurrentScene(1) },
        { text: 'もう一度聞く', action: () => setCurrentScene(0) }
      ]
    },
    {
      title: '最初の村',
      text: '平和な村に到着した。村人たちは心配そうな表情を浮かべている。最近、モンスターが頻繁に現れるようになったらしい。',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400',
      choices: [
        { text: '村人と話す', action: () => setCurrentScene(2) },
        { text: '訓練場に向かう', action: () => setCurrentScene(3) }
      ]
    },
    {
      title: '村人の話',
      text: '村長が語る：「古い遺跡から邪悪な力が漏れ出している。誰かがその力を止めなければ、この世界は闇に包まれてしまうだろう。」',
      image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=400',
      choices: [
        { text: '遺跡について詳しく聞く', action: () => setCurrentScene(4) },
        { text: '冒険の準備をする', action: () => setCurrentScene(5) }
      ]
    }
  ];

  const scene = storyScenes[currentScene] || storyScenes[0];

  const handleStartBattle = () => {
    updateGameState({ inBattle: true });
  };

  return (
    <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>龍の伝説</Text>
          <Text style={styles.subtitle}>第一章</Text>
        </View>

        <View style={styles.sceneContainer}>
          <Image source={{ uri: scene.image }} style={styles.sceneImage} />
          <View style={styles.storyContent}>
            <Text style={styles.sceneTitle}>{scene.title}</Text>
            <Text style={styles.storyText}>{scene.text}</Text>
          </View>
        </View>

        <View style={styles.choicesContainer}>
          {scene.choices.map((choice, index) => (
            <TouchableOpacity
              key={index}
              style={styles.choiceButton}
              onPress={choice.action}
            >
              <Text style={styles.choiceText}>{choice.text}</Text>
              <ChevronRight size={20} color="#ffd700" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>レベル</Text>
            <Text style={styles.statValue}>{gameState.level}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>HP</Text>
            <Text style={styles.statValue}>{gameState.hp}/{gameState.maxHp}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>経験値</Text>
            <Text style={styles.statValue}>{gameState.exp}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.battleButton} onPress={handleStartBattle}>
          <Play size={24} color="#fff" />
          <Text style={styles.battleButtonText}>戦闘開始</Text>
        </TouchableOpacity>
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
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffd700',
    textShadowColor: '#000',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#e3f2fd',
    marginTop: 5,
  },
  sceneContainer: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    overflow: 'hidden',
  },
  sceneImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  storyContent: {
    padding: 20,
  },
  sceneTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffd700',
    marginBottom: 10,
  },
  storyText: {
    fontSize: 16,
    color: '#e3f2fd',
    lineHeight: 24,
    textAlign: 'justify',
  },
  choicesContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  choiceButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  choiceText: {
    fontSize: 16,
    color: '#e3f2fd',
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
    padding: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#9e9e9e',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  battleButton: {
    backgroundColor: '#d32f2f',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 10,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  battleButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 10,
  },
});