// types/health.ts

// 型定義を共通ファイルとする
// 健康用
export type Health = {
  id: string;
  date: string;
  steps: number;
  exerciseMinutes: number;
  sleepHours: number;
  waterMl: number;
};

// Health型の一部をカレンダー用に使用するため型定義
export type CalendarHealth = Pick<
  Health,
  "id" | "date" | "steps"
>;

// **これは修正が必要かも
// アクティビティ用
export type Activity = {
  id: string;
  date: string;
  sleep: number;
  work: number;
  study: number;
  exercise: number;
  hobby: number;
  other: number;
};

// ジャーナル用
export type Journal = {
  id: string;
  date: string;
  gratitude: string;
  achievement: string;
  tomorrowGoal: string;
  freeText: string;
};

// ダイアリー用
export type Diary = {
  id: string;
  date: string;
  content: string;
};