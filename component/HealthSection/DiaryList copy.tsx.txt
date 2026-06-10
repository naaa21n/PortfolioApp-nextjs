"use client";

import { useEffect, useState } from "react";

type Diary = {
  id: string;
  date: string;
  content: string;
};

export default function DiaryList() {

  // =========================
  // State
  // =========================

  const [diaries, setDiaries] =
    useState<Diary[]>([]);

  const [content, setContent] =
    useState("");

  // =========================
  // 初回ロード
  // =========================

  useEffect(() => {

    loadDiaries();

  }, []);

  // =========================
  // 一覧取得
  // =========================

  const loadDiaries = async () => {

    try {
  
      const response = await fetch(
        "http://localhost:8080/api/diaries"
      );
  
      console.log("status", response.status);
  
      const text =
        await response.text();
  
      console.log("raw", text);
  
      const data =
        JSON.parse(text);
  
      console.log("data", data);
  
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

  const addDiary = () => {

    if (!content.trim()) {
      return;
    }

    fetch(
      "http://localhost:8080/api/diaries",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          id: String(
            Date.now()
          ),

          date:
            new Date()
              .toISOString()
              .split("T")[0],

          content,
        }),
      }
    )
      .then(() => {

        setContent("");

        loadDiaries();
      })

      .catch(console.error);
  };

  // =========================
  // 削除
  // =========================

  const deleteDiary = (
    id: string
  ) => {

    fetch(
      `http://localhost:8080/api/diaries/${id}`,
      {
        method: "DELETE",
      }
    )
      .then(loadDiaries)

      .catch(console.error);
  };

  // =========================
  // 編集
  // =========================

  const editDiary = (
    diary: Diary
  ) => {

    const newContent =
      prompt(
        "日記を編集",
        diary.content
      );

    if (
      newContent === null
    ) {
      return;
    }

    fetch(
      `http://localhost:8080/api/diaries/${diary.id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({

          ...diary,

          content:
            newContent,
        }),
      }
    )
      .then(loadDiaries)

      .catch(console.error);
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

      <h3>
        📝 今日の日記
      </h3>

      {/* 入力 */}

      <textarea
        value={content}

        onChange={(e) =>
          setContent(
            e.target.value
          )
        }

        placeholder="今日の出来事を書く"

        style={{
          width: "100%",
          minHeight: "120px",
          marginTop: "16px",
          padding: "12px",
          borderRadius: "12px",
          border:
            "1px solid #cbd5e1",
        }}
      />

      {/* 追加 */}

      <button
        onClick={addDiary}

        style={{
          marginTop: "12px",
          background:
            "#2563eb",
          color: "#fff",
          border: "none",
          borderRadius: "12px",
          padding:
            "10px 18px",
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
          flexDirection:
            "column",
          gap: "16px",
        }}
      >

        {diaries.map(
          (diary) => (

            <div
              key={diary.id}

              style={{
                border:
                  "1px solid #e2e8f0",

                borderRadius:
                  "14px",

                padding: "16px",
              }}
            >

              <div
                style={{
                  fontWeight:
                    "bold",

                  marginBottom:
                    "8px",
                }}
              >
                {diary.date}
              </div>

              <div
                style={{
                  whiteSpace:
                    "pre-wrap",
                }}
              >
                {diary.content}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginTop:
                    "12px",
                }}
              >

                <button
                  onClick={() =>
                    editDiary(
                      diary
                    )
                  }
                >
                  編集
                </button>

                <button
                  onClick={() =>
                    deleteDiary(
                      diary.id
                    )
                  }
                >
                  削除
                </button>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}