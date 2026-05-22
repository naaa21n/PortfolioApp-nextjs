"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // ===== state管理 =====
  const [message, setMessage] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  // ===== 初回ロード：API取得 =====
  useEffect(() => {
    // Hello API
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data));

    // タスク一覧取得
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));
  }, []);

  // ===== タスク追加 =====
  const addTask = () => {
    fetch("http://localhost:8080/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: String(Date.now()),
        title: title,
      }),
    }).then(() => {
      // 再取得
      fetch("http://localhost:8080/api/tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data));

      setTitle("");
    });
  };

  // ===== タスク削除 =====
  const deleteTask = (id: string) => {
    fetch(`http://localhost:8080/api/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetch("http://localhost:8080/api/tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data));
    });
  };

  // ===== タスク完了 =====
  const completeTask = (id: string) => {
    fetch(`http://localhost:8080/api/tasks/${id}/done`, {
      method: "PUT",
    }).then(() => {
      fetch("http://localhost:8080/api/tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data));
    });
  };

  return (
    <main
      style={{
        padding: "40px",
        fontFamily: "sans-serif",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* ===== タイトル ===== */}
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        ポートフォリオ
      </h1>

      {/* サブタイトル */}
      <p style={{ marginTop: "10px", color: "gray" }}>
        タスク・学習・健康を管理するアプリ
      </p>

      {/* API確認 */}
      <p style={{ marginTop: "20px", color: "blue" }}>
        API: {message}
      </p>

      {/* ===== タスク入力エリア ===== */}
      <div style={{ marginTop: "30px", display: "flex", gap: "10px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="タスクを入力"
          style={{
            padding: "10px",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          onClick={addTask}
          style={{
            padding: "10px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </div>

      {/* ===== タスク一覧 ===== */}
      <div style={{ marginTop: "30px" }}>
        <h2 style={{ marginBottom: "10px" }}>タスク一覧</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task: any) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px",
                border: "1px solid #eee",
                borderRadius: "8px",
                marginBottom: "8px",
              }}
            >
              {/* 左側：タスク内容 */}
              <span
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                  color: task.done ? "#888" : "#000",
                }}
              >
                {task.title}
              </span>

              {/* 右側：操作ボタン（まとめるのがポイント） */}
              <div style={{ display: "flex", gap: "8px" }}>
                {/* 完了ボタン */}
                <button
                  onClick={() => completeTask(task.id)}
                  style={{
                    background: "#22c55e",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  完了
                </button>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    background: "#ef4444",
                    color: "white",
                    border: "none",
                    padding: "6px 10px",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== 機能紹介カード ===== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "20px",
          marginTop: "40px",
        }}
      >
        <div style={cardStyle}>📝 タスク管理</div>
        <div style={cardStyle}>📚 学習管理</div>
        <div style={cardStyle}>🏃 健康管理</div>
      </div>
    </main>
  );
}

// ===== カード共通スタイル =====
const cardStyle = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "18px",
};


