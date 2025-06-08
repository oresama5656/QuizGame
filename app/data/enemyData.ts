export interface Enemy {
  id: string;
  name: string;
  image: string;
  hp: number;
  maxHp: number;
  level?: number;
  description?: string;
}

// 敵の基本データ
export const ENEMIES: { [key: string]: Enemy } = {
  slime: {
    id: 'slime',
    name: 'スライム',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 60,
    maxHp: 60,
    level: 1,
    description: '森に生息する弱い魔物。体が柔らかく、攻撃力は低い。',
  },
  goblin: {
    id: 'goblin',
    name: 'ゴブリン',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 80,
    maxHp: 80,
    level: 2,
    description: '小型の人型魔物。知能は低いが集団で行動する。',
  },
  wolf: {
    id: 'wolf',
    name: '森の狼',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 70,
    maxHp: 70,
    level: 2,
    description: '森に生息する凶暴な狼。素早い動きが特徴。',
  },
  bandit: {
    id: 'bandit',
    name: '山賊',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 90,
    maxHp: 90,
    level: 4,
    description: '山に潜む盗賊。武器を使った攻撃が得意。',
  },
  golem: {
    id: 'golem',
    name: '石のゴーレム',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 120,
    maxHp: 120,
    level: 5,
    description: '岩で作られた人型の魔物。物理攻撃に強い。',
  },
  ice_spirit: {
    id: 'ice_spirit',
    name: '氷の精霊',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 100,
    maxHp: 100,
    level: 6,
    description: '山の頂に住む氷の魔物。冷気攻撃が特徴。',
  },
  sandworm: {
    id: 'sandworm',
    name: 'サンドワーム',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 150,
    maxHp: 150,
    level: 8,
    description: '砂漠に生息する巨大な虫。地中から突然現れる。',
  },
  desert_bandit: {
    id: 'desert_bandit',
    name: '砂漠の盗賊',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 120,
    maxHp: 120,
    level: 8,
    description: '砂漠地帯を支配する盗賊団。素早い動きが特徴。',
  },
  mummy: {
    id: 'mummy',
    name: 'ミイラ',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 140,
    maxHp: 140,
    level: 9,
    description: '古代の遺跡から蘇ったミイラ。呪いの力を持つ。',
  },
  dark_knight: {
    id: 'dark_knight',
    name: '闇の騎士',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 180,
    maxHp: 180,
    level: 14,
    description: '魔王の配下の騎士。強力な武器と鎧を持つ。',
  },
  dragon: {
    id: 'dragon',
    name: 'ドラゴン',
    image: 'https://images.pexels.com/photos/1563356/pexels-photo-1563356.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 200,
    maxHp: 200,
    level: 15,
    description: '伝説の竜。炎の息を吐き、強大な力を持つ。',
  },
  dark_lord: {
    id: 'dark_lord',
    name: '魔王',
    image: 'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=300',
    hp: 250,
    maxHp: 250,
    level: 20,
    description: 'この世界を支配しようとする邪悪な存在。強大な魔力を持つ。',
  },
};

// 場所ごとの敵リスト
export const LOCATION_ENEMIES: { [key: string]: Enemy[] } = {
  forest: [ENEMIES.slime, ENEMIES.goblin, ENEMIES.wolf],
  mountain: [ENEMIES.bandit, ENEMIES.golem, ENEMIES.ice_spirit],
  desert: [ENEMIES.sandworm, ENEMIES.desert_bandit, ENEMIES.mummy],
  castle: [ENEMIES.dark_lord, ENEMIES.dark_knight, ENEMIES.dragon],
};

// 場所に基づいてランダムな敵を選択する関数
export function getRandomEnemyForLocation(locationId: string): Enemy {
  if (LOCATION_ENEMIES[locationId]) {
    const enemies = LOCATION_ENEMIES[locationId];
    return {...enemies[Math.floor(Math.random() * enemies.length)]};
  }
  
  // デフォルトの敵（場所が見つからない場合）
  return {...ENEMIES.slime};
} 