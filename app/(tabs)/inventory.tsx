import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Package, Sword, Shield, Heart, Zap, Plus } from 'lucide-react-native';
import { useGameState } from '@/hooks/useGameState';

export default function InventoryScreen() {
  const { gameState, updateGameState } = useGameState();
  const [selectedTab, setSelectedTab] = useState('all');

  const inventory = [
    {
      id: 'sword1',
      name: '鋼の剣',
      type: 'weapon',
      attack: 25,
      price: 500,
      quantity: 1,
      description: '鋭い刃を持つ鋼製の剣',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      equipped: true,
    },
    {
      id: 'shield1',
      name: '鉄の盾',
      type: 'armor',
      defense: 15,
      price: 300,
      quantity: 1,
      description: '頑丈な鉄製の盾',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      equipped: true,
    },
    {
      id: 'potion1',
      name: '回復ポーション',
      type: 'consumable',
      heal: 50,
      price: 50,
      quantity: 5,
      description: 'HPを50回復する薬',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      equipped: false,
    },
    {
      id: 'mana1',
      name: 'マナポーション',
      type: 'consumable',
      mana: 30,
      price: 40,
      quantity: 3,
      description: 'MPを30回復する薬',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      equipped: false,
    },
    {
      id: 'ring1',
      name: '力の指輪',
      type: 'accessory',
      attack: 10,
      price: 800,
      quantity: 1,
      description: '攻撃力を上げる魔法の指輪',
      image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=100',
      equipped: false,
    },
  ];

  const filteredItems = inventory.filter(item => {
    if (selectedTab === 'all') return true;
    return item.type === selectedTab;
  });

  const handleUseItem = (item: any) => {
    if (item.type === 'consumable') {
      if (item.heal) {
        const newHp = Math.min(gameState.hp + item.heal, gameState.maxHp);
        updateGameState({ hp: newHp });
      }
      if (item.mana) {
        const newMp = Math.min(gameState.mp + item.mana, gameState.maxMp);
        updateGameState({ mp: newMp });
      }
    }
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'weapon':
        return <Sword size={20} color="#d32f2f" />;
      case 'armor':
        return <Shield size={20} color="#4caf50" />;
      case 'consumable':
        return <Heart size={20} color="#e91e63" />;
      case 'accessory':
        return <Zap size={20} color="#ff9800" />;
      default:
        return <Package size={20} color="#9e9e9e" />;
    }
  };

  const tabs = [
    { id: 'all', name: '全て', icon: <Package size={20} color="#ffd700" /> },
    { id: 'weapon', name: '武器', icon: <Sword size={20} color="#ffd700" /> },
    { id: 'armor', name: '防具', icon: <Shield size={20} color="#ffd700" /> },
    { id: 'consumable', name: '消耗品', icon: <Heart size={20} color="#ffd700" /> },
    { id: 'accessory', name: '装飾品', icon: <Zap size={20} color="#ffd700" /> },
  ];

  return (
    <LinearGradient colors={['#1a237e', '#3949ab']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>アイテム</Text>
        <View style={styles.goldContainer}>
          <Text style={styles.goldText}>{gameState.gold}G</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              selectedTab === tab.id && styles.activeTab,
            ]}
            onPress={() => setSelectedTab(tab.id)}
          >
            {tab.icon}
            <Text style={[
              styles.tabText,
              selectedTab === tab.id && styles.activeTabText,
            ]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Inventory Grid */}
      <ScrollView style={styles.inventoryContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.inventoryGrid}>
          {filteredItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.itemCard,
                item.equipped && styles.equippedItem,
              ]}
              onPress={() => handleUseItem(item)}
            >
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <View style={styles.itemHeader}>
                  {getItemIcon(item.type)}
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.equipped && (
                    <View style={styles.equippedBadge}>
                      <Text style={styles.equippedText}>装備中</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.itemDescription}>{item.description}</Text>
                <View style={styles.itemStats}>
                  {item.attack && (
                    <Text style={styles.statText}>攻撃力: +{item.attack}</Text>
                  )}
                  {item.defense && (
                    <Text style={styles.statText}>防御力: +{item.defense}</Text>
                  )}
                  {item.heal && (
                    <Text style={styles.statText}>回復: {item.heal} HP</Text>
                  )}
                  {item.mana && (
                    <Text style={styles.statText}>回復: {item.mana} MP</Text>
                  )}
                </View>
                <View style={styles.itemFooter}>
                  <Text style={styles.itemPrice}>{item.price}G</Text>
                  {item.quantity > 1 && (
                    <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Quick Stats */}
      <View style={styles.quickStats}>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatLabel}>重量</Text>
          <Text style={styles.quickStatValue}>
            {inventory.reduce((total, item) => total + item.quantity, 0)}/100
          </Text>
        </View>
        <View style={styles.quickStatItem}>
          <Text style={styles.quickStatLabel}>価値</Text>
          <Text style={styles.quickStatValue}>
            {inventory.reduce((total, item) => total + (item.price * item.quantity), 0)}G
          </Text>
        </View>
      </View>
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
  goldContainer: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  goldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  tabsContainer: {
    maxHeight: 60,
    marginBottom: 10,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 5,
    marginLeft: 20,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderWidth: 1,
    borderColor: '#ffd700',
  },
  tabText: {
    fontSize: 14,
    color: '#e3f2fd',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#ffd700',
    fontWeight: 'bold',
  },
  inventoryContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inventoryGrid: {
    paddingBottom: 20,
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
  },
  equippedItem: {
    borderWidth: 2,
    borderColor: '#ffd700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e3f2fd',
    marginLeft: 8,
    flex: 1,
  },
  equippedBadge: {
    backgroundColor: '#ffd700',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  equippedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a237e',
  },
  itemDescription: {
    fontSize: 14,
    color: '#9e9e9e',
    marginBottom: 8,
  },
  itemStats: {
    marginBottom: 8,
  },
  statText: {
    fontSize: 12,
    color: '#4caf50',
    marginBottom: 2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffd700',
  },
  itemQuantity: {
    fontSize: 12,
    color: '#9e9e9e',
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  quickStatItem: {
    alignItems: 'center',
  },
  quickStatLabel: {
    fontSize: 12,
    color: '#9e9e9e',
    marginBottom: 5,
  },
  quickStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffd700',
  },
});