// types/health.ts

// 型定義を共通ファイルとする
// 健康用
export type Health = {
  id: string;
  userId?: string;
  recordDate: string;
  steps: number;
  exerciseMinutes: number;
  sleepHours: number;
  waterMl: number;
  createdAt?: string;
  updatedAt?: string;
};

// Health型の一部をカレンダー用に使用するため型定義
export type CalendarHealth = Pick<
  Health,
  "id" | "recordDate" | "steps"
>;

// **これは修正が必要かも
// アクティビティ用
export type Activity = {
  id: string;
  userId?: string;
  recordDate: string;
  sleep: number;
  work: number;
  study: number;
  exercise: number;
  hobby: number;
  other: number;
  createdAt?: string;
  updatedAt?: string;
};

// ジャーナル用
export type Journal = {
  id: string;
  userId?: string;
  journalDate: string;
  gratitude: string;
  achievement: string;
  tomorrowGoal: string;
  freeText: string;
  createdAt?: string;
  updatedAt?: string;
};

// ダイアリー用
export type Diary = {
  id: string;
  userId?: string;
  diaryDate: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
};