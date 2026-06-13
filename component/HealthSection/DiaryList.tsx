"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Diary } from "../types/health";

// =========================
// DiaryList Component
// =========================
//
// 日記一覧・追加・編集・削除を行うコンポーネント
//
// Spring Boot側:
//
// Entity:
// DiaryEntry
//
// API:
// GET    /api/health/diaries
// POST   /api/health/diaries
// PUT    /api/health/diaries/{id}
// DELETE /api/health/diaries/{id}
//
export default function DiaryList() {
  // =========================
  // State
  // =========================

  // 日記一覧
  const [diaries, setDiaries] = useState<Diary[]>([]);

  // 新規入力中の日記本文
  const [content, setContent] = useState("");

  // =========================
  // 初回ロード
  // =========================
  //
  // コンポーネント表示時に日記一覧を取得する
  //
  useEffect(() => {
    loadDiaries();
  }, []);

  // =========================
  // 一覧取得
  // =========================
  //
  // Spring Bootから日記一覧を取得する
  //
  const loadDiaries = async () => {
  try {
    const response = await apiFetch(
      "/api/health/diaries"
    );

    const data: Diary[] =
      await response.json();

    console.log("Diary data:", data);

    setDiaries(data);
  } catch (e) {
    console.error(
      "Diary Error",
      e
    );
  }
};

  // =========================
  // 日記追加
  // =========================
  //
  // Spring Boot側のDiaryEntry Entityに合わせて
  // diaryDate / content を送信する
  //
  const addDiary = async () => {
    if (!content.trim()) {
      return;
    }

    // 今日の日付
    //
    // 例:
    // "2026-06-13"
    const today = new Date()
      .toISOString()
      .split("T")[0];

    // =========================
    // POSTするJSON
    // =========================
    //
    // 注意:
    // id は送らない
    //
    // 理由:
    // Spring Boot側でUUIDが自動生成されるため
    //
    // 注意:
    // date ではなく diaryDate
    //
    // 理由:
    // DiaryEntry Entityのフィールド名が diaryDate だから
    //
    const body = {
      diaryDate: today,
      content,
    };

    console.log("Diary POST body:", body);

    try {
      await apiFetch("/api/health/diaries", {
        method: "POST",
        body: JSON.stringify(body),
      });

      // 入力欄を空にする
      setContent("");

      // 一覧を再取得
      loadDiaries();
    } catch (e) {
      console.error("Diary Add Error", e);
    }
  };

  // =========================
  // 削除
  // =========================
  //
  // 指定IDの日記を削除する
  //
  const deleteDiary = async (id: string) => {
    try {
      await apiFetch(`/api/health/diaries/${id}`, {
        method: "DELETE",
      });

      loadDiaries();
    } catch (e) {
      console.error("Diary Delete Error", e);
    }
  };

  // =========================
  // 編集
  // =========================
  //
  // promptで本文を編集し、
  // PUTでSpring Bootへ更新リクエストを送る
  //
  const editDiary = async (diary: Diary) => {
    const newContent = prompt(
      "日記を編集",
      diary.content
    );

    if (newContent === null) {
      return;
    }

    // =========================
    // PUTするJSON
    // =========================
    //
    // Spring Boot側のDiaryEntryに合わせる
    //
    // diaryDate:
    // 既存の日付をそのまま使う
    //
    // content:
    // 編集後の本文を使う
    //
    const body = {
      diaryDate: diary.diaryDate,
      content: newContent,
    };

    console.log("Diary PUT body:", body);

    try {
      await apiFetch(`/api/health/diaries/${diary.id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });

      loadDiaries();
    } catch (e) {
      console.error("Diary Edit Error", e);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <h3>📝 今日の日記</h3>

      {/* 入力欄 */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="今日の出来事を書く"
        style={{
          width: "100%",
          minHeight: "120px",
          marginTop: "16px",
          padding: "12px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
        }}
      />

      {/* 追加ボタン */}
      <button
        onClick={addDiary}
        style={{
          marginTop: "12px",
          background: "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        ＋ 新しい日記
      </button>

      {/* 一覧 */}
      <div
        style={{
          marginTop: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {diaries.map((diary) => (
          <div
            key={diary.id}
            style={{
              border: "1px solid #e2e8f0",
              borderRadius: "14px",
              padding: "16px",
            }}
          >
            {/* 日記日付 */}
            <div
              style={{
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              {diary.diaryDate}
            </div>

            {/* 日記本文 */}
            <div
              style={{
                whiteSpace: "pre-wrap",
              }}
            >
              {diary.content}
            </div>

            {/* 操作ボタン */}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "12px",
              }}
            >
              <button onClick={() => editDiary(diary)}>
                編集
              </button>

              <button onClick={() => deleteDiary(diary.id)}>
                削除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}