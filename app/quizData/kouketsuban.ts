import { Quiz, QuizCategory } from './types';

/**
 * 抗血小板薬関連のクイズ
 */
const kouketsubanQuizzes: Quiz[] = [
  {
    question: 'アスピリンの抗血小板作用の機序は？',
    options: [
      'シクロオキシゲナーゼ阻害によるトロンボキサンA2産生抑制',
      'ADP受容体阻害',
      'ホスホジエステラーゼ阻害',
      'ビタミンK拮抗作用'
    ],
    correctAnswer: 'シクロオキシゲナーゼ阻害によるトロンボキサンA2産生抑制'
  },
  {
    question: 'クロピドグレル（プラビックス）の作用機序は？',
    options: [
      'P2Y12（ADP受容体）阻害',
      'トロンビン阻害',
      'ビタミンK拮抗',
      'プロスタグランジン合成阻害'
    ],
    correctAnswer: 'P2Y12（ADP受容体）阻害'
  },
  {
    question: 'プラスグレル（エフィエント）とクロピドグレルを比較した場合の特徴として正しいのは？',
    options: [
      'プラスグレルの方が効果発現が早い',
      'クロピドグレルの方が出血リスクが低い',
      'プラスグレルはCYP2C19の遺伝子多型の影響を受けない',
      '以上すべて正しい'
    ],
    correctAnswer: '以上すべて正しい'
  },
  {
    question: '抗血小板薬の副作用として最も注意すべきものは？',
    options: [
      '出血',
      '腎機能障害',
      '肝機能障害',
      '高血糖'
    ],
    correctAnswer: '出血'
  },
  {
    question: '抗血小板薬の中で、手術前に休薬期間が最も長いものはどれか？',
    options: [
      'チクロピジン（パナルジン）',
      'クロピドグレル（プラビックス）',
      'アスピリン',
      'シロスタゾール（プレタール）'
    ],
    correctAnswer: 'チクロピジン（パナルジン）'
  }
];

export const kouketsubanQuiz: QuizCategory = {
  categoryName: '抗血小板薬',
  description: '抗血小板薬に関する問題です。作用機序、副作用、薬剤の特徴などについて出題されます。',
  quizzes: kouketsubanQuizzes
}; 