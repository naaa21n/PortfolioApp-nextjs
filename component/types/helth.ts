// types/health.ts

// 型定義を共通ファイルとする
export type Health = {
  id: string;
  date: string;
  steps: number;
  exerciseMinutes: number;
  sleepHours: number;
  waterMl: number;
};

// **これは修正が必要かも
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

// **これは修正必要かも
export type Journal = {
  id: string;
  date: string;
  title?: string;
  content?: string;
};