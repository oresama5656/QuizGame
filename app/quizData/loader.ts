import { Quiz, QuizCategory } from './types';
import { QUIZ_BY_CATEGORY } from './index';

/**
 * クイズデータローダー
 * 
 * 将来的にはAPIやGoogleスプレッドシートなどから
 * データを取得する機能を実装することを想定しています。
 * 現在は、ローカルのTypeScriptファイルからデータを取得します。
 */

/**
 * 指定されたカテゴリのクイズを取得する
 * @param category カテゴリID
 * @returns カテゴリに対応するクイズデータ
 */
export const getQuiz = (category: string): QuizCategory => {
  const quizData = QUIZ_BY_CATEGORY[category];
  if (!quizData) {
    throw new Error(`カテゴリ "${category}" のクイズデータが見つかりません`);
  }
  return quizData;
};

/**
 * 指定されたカテゴリからランダムなクイズを1問取得する
 * @param category カテゴリID
 * @returns ランダムに選ばれた1問のクイズ
 */
export const getRandomQuiz = (category: string): Quiz => {
  const quizData = getQuiz(category);
  const randomIndex = Math.floor(Math.random() * quizData.quizzes.length);
  return quizData.quizzes[randomIndex];
};

/**
 * 指定されたカテゴリから指定された数のランダムなクイズを取得する
 * @param category カテゴリID
 * @param count 取得するクイズの数
 * @returns ランダムに選ばれたクイズの配列
 */
export const getRandomQuizzes = (category: string, count: number): Quiz[] => {
  const quizData = getQuiz(category);
  
  // カテゴリ内のクイズ数よりも多くのクイズを要求された場合は、
  // 利用可能なすべてのクイズを返す
  if (count >= quizData.quizzes.length) {
    return [...quizData.quizzes]; // 元の配列を変更しないようにコピーを返す
  }
  
  // Fisher-Yatesのシャッフルアルゴリズムを使用して、
  // クイズをランダムに並べ替え、先頭からcount個を取得
  const shuffled = [...quizData.quizzes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, count);
};

/**
 * 将来的なAPI実装のためのモック関数
 * 実際のAPIが実装されたら、この関数を置き換える
 */
export const fetchQuizzesFromAPI = async (category: string): Promise<QuizCategory> => {
  // 実際のAPIコールをシミュレート
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getQuiz(category));
    }, 500); // 500msの遅延を追加してAPIコールをシミュレート
  });
}; 