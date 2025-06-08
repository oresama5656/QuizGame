import { Redirect } from 'expo-router';

export default function Index() {
  // マップ画面にリダイレクト
  return <Redirect href="/(tabs)/map" />;
} 