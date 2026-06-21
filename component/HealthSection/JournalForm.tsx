"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import type { Journal } from "../types/health";

// =========================
// Props
// =========================
//
// 親コンポーネントから受け取る値
//
type Props = {
  // 選択中の日付
  //
  // 例:
  // "2026-06-13"
  selectedDate: string;

  // 選択中の日付に対応するジャーナル記録
  //
  // 既存データがある場合:
  // Journal
  //
  // 既存データがない場合:
  // null
  selectedJournal: Journal | null;

  // 保存後に親コンポーネント側で
  // ジャーナル一覧を再取得するための関数
  onSaved: () => void | Promise<void>;
};

// =========================
// JournalForm Component
// =========================
//
// ジャーナリング入力フォーム
//
// Spring Boot側:
//
// Entity:
// JournalEntry
//
// API:
// POST /api/health/journals
// PUT  /api/health/journals/{id}
//
export default function JournalForm({
  selectedDate,
  selectedJournal,
  onSaved,
}: Props) {
  // =========================
  // State
  // =========================

  // 感謝したこと
  const [gratitude, setGratitude] =
    useState("");

  // 頑張ったこと
  const [achievement, setAchievement] =
    useState("");

  // 明日の目標
  const [tomorrowGoal, setTomorrowGoal] =
    useState("");

  // 自由記述
  const [freeText, setFreeText] =
    useState("");

  // =========================
  // selectedJournal変更時の反映
  // =========================
  //
  // カレンダーなどで日付を切り替えたときに、
  // その日の既存ジャーナルをフォームに反映する
  //
  // selectedJournal が null の場合は
  // 新規入力として空文字に戻す
  //
  useEffect(() => {
    setGratitude(
      selectedJournal?.gratitude || ""
    );

    setAchievement(
      selectedJournal?.achievement || ""
    );

    setTomorrowGoal(
      selectedJournal?.tomorrowGoal || ""
    );

    setFreeText(
      selectedJournal?.freeText || ""
    );
  }, [selectedJournal, selectedDate]);

  // =========================
  // 保存処理
  // =========================
  //
  // selectedJournal がある場合:
  // 既存データ更新 PUT
  //
  // selectedJournal がない場合:
  // 新規登録 POST
  //
  const saveJournal = async () => {
    if (!selectedDate) {
      alert("日付を選択してください");
      return;
    }

    // =========================
    // Spring Bootへ送るJSON
    // =========================
    //
    // 注意:
    // id は送らない
    //
    // 理由:
    // Spring Boot側で UUID が自動生成されるため
    //
    // 注意:
    // date ではなく journalDate にする
    //
    // 理由:
    // JournalEntry Entity側のフィールド名が
    // journalDate だから
    //
    const body = {
      // ジャーナル記録日
      //
      // Spring側:
      // private LocalDate journalDate;
      journalDate: selectedDate,

      // 感謝したこと
      //
      // Spring側:
      // private String gratitude;
      gratitude,

      // 頑張ったこと
      //
      // Spring側:
      // private String achievement;
      achievement,

      // 明日の目標
      //
      // Spring側:
      // private String tomorrowGoal;
      tomorrowGoal,

      // 自由記述
      //
      // Spring側:
      // private String freeText;
      freeText,
    };

    console.log("Journal POST/PUT body:", body);

    // =========================
    // POST / PUT 切り替え
    // =========================
    //
    // selectedJournal がある場合は更新
    // selectedJournal がない場合は新規登録
    //
    const method =
      selectedJournal
        ? "PUT"
        : "POST";

    const path =
      selectedJournal
        ? `/api/health/journals/${selectedJournal.id}`
        : "/api/health/journals";

    try {
      const response = await apiFetch(path, {
        method,
        body: JSON.stringify(body),
      });

      console.log(
        "Journal Save Response:",
        response
      );

      // 保存後に親側で一覧再取得
      await onSaved();
    } catch (error) {
      console.error(
        "Journal Save Error",
        error
      );
    }
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <h3>
        🌱 ジャーナリング
      </h3>

      {/* 選択中の日付 */}
      <div
        style={{
          color: "#64748b",
          marginTop: "8px",
        }}
      >
        {selectedDate || "日付を選択してください"}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        {/* 感謝したこと */}
        <textarea
          value={gratitude}
          onChange={(e) =>
            setGratitude(e.target.value)
          }
          placeholder="感謝したこと"
          style={textareaStyle}
        />

        {/* 頑張ったこと */}
        <textarea
          value={achievement}
          onChange={(e) =>
            setAchievement(e.target.value)
          }
          placeholder="頑張ったこと"
          style={textareaStyle}
        />

        {/* 明日の目標 */}
        <textarea
          value={tomorrowGoal}
          onChange={(e) =>
            setTomorrowGoal(e.target.value)
          }
          placeholder="明日の目標"
          style={textareaStyle}
        />

        {/* 自由記述 */}
        <textarea
          value={freeText}
          onChange={(e) =>
            setFreeText(e.target.value)
          }
          placeholder="自由に書く"
          style={textareaStyle}
        />

        {/* 保存ボタン */}
        <button
          type="button"
          onClick={saveJournal}
          style={buttonStyle}
        >
          保存
        </button>
      </div>
    </div>
  );
}

// =========================
// Textarea Style
// =========================
//
// 各textareaで共通利用するスタイル
//
const textareaStyle: React.CSSProperties = {
  minHeight: "70px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  resize: "vertical",
};

// =========================
// Button Style
// =========================
//
// 保存ボタン用スタイル
//
const buttonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "12px",
  padding: "12px",
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};