"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // ===== state管理 =====
  const [message, setMessage] = useState("");

  // タスク
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  // 学習
  const [learnings, setLearnings] = useState<any[]>([]);
  const [learningText, setLearningText] = useState("");

  // ===== 初回ロード：API取得 =====
  useEffect(() => {
    // Hello API
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data));

    // タスク取得
    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));

    // 学習取得
    fetch("http://localhost:8080/api/learnings")
      .then((res) => res.json())
      .then((data) => setLearnings(data));
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
        done: false,
      }),
    }).then(() => {
      fetch("http://localhost:8080/api/tasks")
        .then((res) => res.json())
        .then((data) => setTasks(data));

      setTitle("");
    });
  };

  // ===== 学習追加（修正版）=====
  const addLearning = () => {
    fetch("http://localhost:8080/api/learnings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: String(Date.now()),
        title: learningText,
        done: false,
      }),
    }).then(() => {
      fetch("http://localhost:8080/api/learnings")
        .then((res) => res.json())
        .then((data) => setLearnings(data));

      setLearningText("");
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
      {/* タイトル */}
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        ポートフォリオ
      </h1>

      <p style={{ marginTop: "10px", color: "gray" }}>
        タスク・学習・健康を管理するアプリ
      </p>

      <p style={{ marginTop: "20px", color: "blue" }}>
        API: {message}
      </p>

      {/* ===== タスク入力 ===== */}
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
          }}
        >
          追加
        </button>
      </div>

      {/* ===== 学習入力（追加）===== */}
      <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
        <input
          value={learningText}
          onChange={(e) => setLearningText(e.target.value)}
          placeholder="学習内容を入力"
          style={{
            padding: "10px",
            flex: 1,
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />

        <button
          onClick={addLearning}
          style={{
            padding: "10px 16px",
            background: "#10b981",
            color: "white",
            border: "none",
            borderRadius: "6px",
          }}
        >
          追加
        </button>
      </div>

      {/* ===== タスク一覧 ===== */}
      <div style={{ marginTop: "30px" }}>
        <h2>タスク一覧</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task: any) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
                border: "1px solid #eee",
                marginBottom: "8px",
              }}
            >
              <span
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                }}
              >
                {task.title}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => completeTask(task.id)}>完了</button>
                <button onClick={() => deleteTask(task.id)}>削除</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ===== 学習一覧（追加）===== */}
      <div style={{ marginTop: "30px" }}>
        <h2>学習一覧</h2>

        <ul style={{ listStyle: "none", padding: 0 }}>
          {learnings.map((learning: any) => (
            <li
              key={learning.id}
              style={{
                padding: "10px",
                border: "1px solid #eee",
                marginBottom: "8px",
              }}
            >
              {learning.title}
            </li>
          ))}
        </ul>
      </div>

      {/* ===== カード ===== */}
      <div
        style={{
          display: "grid",
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

// ===== スタイル =====
const cardStyle = {
  padding: "20px",
  border: "1px solid #ddd",
  borderRadius: "10px",
  fontSize: "18px",
};