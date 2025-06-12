import { QuizByCategoryType } from './types';
import { tounyouQuiz } from './tounyou';
import { kouketsubanQuiz } from './kouketsuban';

/**
 * カテゴリ別クイズデータ
 * 
 * 新しいカテゴリを追加する場合は、以下の手順で行います：
 * 1. 新しいカテゴリのTSファイルを作成（例：app/quizData/koketsuatsu.ts）
 * 2. このファイルにインポートを追加
 * 3. QUIZ_BY_CATEGORYオブジェクトに新しいエントリを追加
 */
export const QUIZ_BY_CATEGORY: QuizByCategoryType = {
  tounyou: tounyouQuiz,
  kouketsuban: kouketsubanQuiz,
};

/**
 * 利用可能なすべてのクイズカテゴリのIDを取得
 */
export const getAllCategories = (): string[] => {
  return Object.keys(QUIZ_BY_CATEGORY);
};

/**
 * 特定のカテゴリのクイズ情報を取得
 */
export const getCategoryInfo = (categoryId: string) => {
  const category = QUIZ_BY_CATEGORY[categoryId];
  if (!category) {
    throw new Error(`カテゴリ "${categoryId}" は存在しません`);
  }
  
  return {
    id: categoryId,
    name: category.categoryName,
    description: category.description,
    quizCount: category.quizzes.length
  };
};

/**
 * すべてのカテゴリの情報を取得
 */
export const getAllCategoryInfo = () => {
  return getAllCategories().map(id => getCategoryInfo(id));
}; 