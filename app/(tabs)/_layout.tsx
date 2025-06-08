import { Tabs } from 'expo-router';
import { Sword, User, Package, Map } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1a237e',
          borderTopColor: '#ffd700',
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: '#ffd700',
        tabBarInactiveTintColor: '#9e9e9e',
      }}>
      <Tabs.Screen
        name="map"
        options={{
          title: 'マップ',
          tabBarIcon: ({ size, color }) => (
            <Map size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="battle"
        options={{
          title: '戦闘',
          tabBarIcon: ({ size, color }) => (
            <Sword size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: 'キャラ',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'アイテム',
          tabBarIcon: ({ size, color }) => (
            <Package size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}