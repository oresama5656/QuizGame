/**
 * クイズの型定義
 */

// 個別のクイズ問題の型
export type Quiz = {
  question: string;
  options: string[];
  correctAnswer: string;
};

// カテゴリ別のクイズ配列の型
export type QuizCategory = {
  categoryName: string;
  description: string;
  quizzes: Quiz[];
};

// カテゴリIDとクイズ配列のマッピング型
export type QuizByCategoryType = {
  [key: string]: QuizCategory;
}; 