"use client";

// Reactの状態管理用
import { useState } from "react";

// Spring Boot APIを呼び出す共通関数
import { apiFetch } from "../lib/api";

// Activity型を読み込み
// ActivityRecordのフロント側の型として使用する想定
import { Activity } from "../types/health";

// =========================
// Props定義
// =========================
//
// 親コンポーネントから受け取る値
//
type Props = {
  // カレンダーなどで選択中の日付
  //
  // 例:
  // "2026-06-13"
  selectedDate: string;

  // 選択中の日付に紐づく活動記録
  //
  // 今回のコード内ではまだ直接使用していないが、
  // 編集機能を作る場合に使える
  selectedActivity: Activity | null;

  // 活動記録を保存・削除した後に、
  // 親側の活動記録一覧を再取得するための関数
  reloadActivities: () => void;
};

// =========================
// ActivityLog Component
// =========================
//
// 行動ログ入力フォーム
//
// 入力項目:
// ・睡眠
// ・仕事
// ・勉強
// ・運動
// ・趣味
// ・その他
//
// 保存先:
// Spring Boot
// POST /api/health/activities
//
export default function ActivityLog({
  selectedDate,
  reloadActivities,
}: Props) {
  // =========================
  // State
  // =========================
  //
  // 各活動時間を分単位で管理する
  //

  // 睡眠時間
  const [sleep, setSleep] = useState(0);

  // 仕事時間
  const [work, setWork] = useState(0);

  // 勉強時間
  const [study, setStudy] = useState(0);

  // 運動時間
  const [exercise, setExercise] = useState(0);

  // 趣味時間
  const [hobby, setHobby] = useState(0);

  // その他時間
  const [other, setOther] = useState(0);

  // =========================
  // 活動記録保存処理
  // =========================
  //
  // Spring Boot側のActivityRecord Entityに合わせて
  // JSONデータを作成してPOSTする
  //
  // ActivityRecord Entity側:
  //
  // private LocalDate recordDate;
  // private Integer sleep;
  // private Integer work;
  // private Integer study;
  // private Integer exercise;
  // private Integer hobby;
  // private Integer other;
  //
  const saveActivity = async () => {
    // =========================
    // POSTするJSONデータ
    // =========================
    //
    // 注意:
    // id は送らない
    //
    // 理由:
    // Spring Boot側で UUID が自動生成されるため
    //
    // 注意:
    // date ではなく recordDate にする
    //
    // 理由:
    // ActivityRecord Entity側のフィールド名が
    // recordDate だから
    //
    const body = {
      // 活動記録の日付
      //
      // 例:
      // "2026-06-13"
      recordDate: selectedDate,

      // 各活動時間
      //
      // Number(...) にして、
      // Spring Boot側の Integer に変換しやすい形で送る
      sleep: Number(sleep),
      work: Number(work),
      study: Number(study),
      exercise: Number(exercise),
      hobby: Number(hobby),
      other: Number(other),
    };

    // 送信前のデバッグ確認
    console.log("Activity POST body:", body);

    // =========================
    // API呼び出し
    // =========================
    //
    // Spring Boot側:
    // POST /api/health/activities
    //
    const response = await apiFetch("/api/health/activities", {
      method: "POST",

      // apiFetch側で Content-Type を付けている想定
      // もしapiFetch側で付けていない場合は、
      // headers: { "Content-Type": "application/json" }
      // が必要
      body: JSON.stringify(body),
    });

    // 保存後のレスポンス確認
    console.log("Activity Save Response:", response);

    // =========================
    // 一覧再取得
    // =========================
    //
    // 保存後に親コンポーネント側の活動記録一覧を更新する
    //
    reloadActivities();
  };

  // =========================
  // JSX
  // =========================

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      {/* タイトル */}
      <h3>📋 行動ログ</h3>

      {/* 選択中の日付表示 */}
      <div
        style={{
          color: "#64748b",
          marginBottom: "20px",
        }}
      >
        {selectedDate}
      </div>

      {/* 睡眠時間入力 */}
      <Input label="睡眠（分）" value={sleep} setValue={setSleep} />

      {/* 仕事時間入力 */}
      <Input label="仕事（分）" value={work} setValue={setWork} />

      {/* 勉強時間入力 */}
      <Input label="勉強（分）" value={study} setValue={setStudy} />

      {/* 運動時間入力 */}
      <Input label="運動（分）" value={exercise} setValue={setExercise} />

      {/* 趣味時間入力 */}
      <Input label="趣味（分）" value={hobby} setValue={setHobby} />

      {/* その他時間入力 */}
      <Input label="その他（分）" value={other} setValue={setOther} />

      {/* 保存ボタン */}
      <button
        onClick={saveActivity}
        style={{
          width: "100%",
          marginTop: "20px",
          border: "none",
          borderRadius: "12px",
          padding: "12px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        保存
      </button>
    </div>
  );
}

// =========================
// Input Component Props
// =========================
//
// 数値入力用の共通コンポーネントで使うProps
//
type InputProps = {
  // 入力欄のラベル
  label: string;

  // 現在の値
  value: number;

  // 値を更新する関数
  setValue: (value: number) => void;
};

// =========================
// Input Component
// =========================
//
// 活動時間を入力するための共通Input
//
// sleep / work / study / exercise / hobby / other
// で同じ見た目・処理を使い回す
//
function Input({ label, value, setValue }: InputProps) {
  return (
    <div
      style={{
        marginBottom: "12px",
      }}
    >
      {/* 入力項目名 */}
      <label>{label}</label>

      {/* 数値入力 */}
      <input
        type="number"
        value={value}

        // 入力値が変更されたときにStateを更新する
        onChange={(e) =>
          setValue(
            // 空文字の場合は0として扱う
            //
            // Number("") は 0 になるが、
            // 明示的に書いた方が分かりやすい
            e.target.value === ""
              ? 0
              : Number(e.target.value)
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
          marginTop: "6px",
        }}
      />
    </div>
  );
}