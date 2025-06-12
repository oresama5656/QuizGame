import { Quiz, QuizCategory } from './types';

/**
 * 糖尿病関連の薬剤クイズ
 */
const tounyouQuizzes: Quiz[] = [
  {
    question: 'メトホルミン（メトグルコ）の主な作用機序は？',
    options: [
      '肝臓での糖新生抑制',
      'インスリン分泌促進',
      'α-グルコシダーゼ阻害',
      'SGLT2阻害'
    ],
    correctAnswer: '肝臓での糖新生抑制'
  },
  {
    question: 'SGLT2阻害薬の主な副作用として最も注意すべきものは？',
    options: [
      '尿路感染症',
      '低血糖',
      '乳酸アシドーシス',
      '体重増加'
    ],
    correctAnswer: '尿路感染症'
  },
  {
    question: 'グリメピリド（アマリール）はどのクラスの糖尿病治療薬か？',
    options: [
      'スルホニルウレア薬',
      'ビグアナイド薬',
      'チアゾリジン薬',
      'DPP-4阻害薬'
    ],
    correctAnswer: 'スルホニルウレア薬'
  },
  {
    question: 'ジャヌビア（シタグリプチン）の作用機序は？',
    options: [
      'DPP-4阻害',
      'インスリン抵抗性改善',
      '腸管からの糖吸収遅延',
      '尿中へのグルコース排泄促進'
    ],
    correctAnswer: 'DPP-4阻害'
  },
  {
    question: '糖尿病治療薬の中で、低血糖リスクが比較的低いものはどれか？',
    options: [
      'DPP-4阻害薬',
      'スルホニルウレア薬',
      'インスリン製剤',
      'グリニド薬'
    ],
    correctAnswer: 'DPP-4阻害薬'
  }
];

export const tounyouQuiz: QuizCategory = {
  categoryName: '糖尿病',
  description: '糖尿病治療薬に関する問題です。作用機序、副作用、薬剤の特徴などについて出題されます。',
  quizzes: tounyouQuizzes
}; 