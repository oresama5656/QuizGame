import { Redirect } from 'expo-router';

export default function Index() {
  // タブ内のマップ画面にリダイレクト
  return <Redirect href="/(tabs)/map" />;
} 