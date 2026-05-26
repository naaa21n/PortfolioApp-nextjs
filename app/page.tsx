"use client";

import { useEffect, useState } from "react";

export default function Home() {
  // ===== state管理 =====
  const [message, setMessage] = useState("");

  // ===== タスク管理 =====
  const [tasks, setTasks] = useState<any[]>([]);
  const [title, setTitle] = useState("");

  // ===== 学習管理 =====
  const [learnings, setLearnings] = useState<any[]>([]);
  const [learningText, setLearningText] = useState("");

  // ===== 健康管理 =====
  const [healths, setHealths] = useState<any[]>([]);
  const [steps, setSteps] = useState("");

  // ===== 初回ロード =====
  useEffect(() => {
    fetch("http://localhost:8080/api/hello")
      .then((res) => res.text())
      .then((data) => setMessage(data));

    fetch("http://localhost:8080/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data));

    fetch("http://localhost:8080/api/learnings")
      .then((res) => res.json())
      .then((data) => setLearnings(data));

    fetch("http://localhost:8080/api/healths")
      .then((res) => res.json())
      .then((data) => setHealths(data));
  }, []);

  // ===== タスク追加 =====
  const addTask = () => {
    if (!title) return;

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

  // ===== 学習追加 =====
  const addLearning = () => {
    if (!learningText) return;

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

  // ===== 学習削除 =====
  const deleteLearning = (id: string) => {
    fetch(`http://localhost:8080/api/learnings/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetch("http://localhost:8080/api/learnings")
        .then((res) => res.json())
        .then((data) => setLearnings(data));
    });
  };

  // ===== 学習完了 =====
  const completeLearning = (id: string) => {
    fetch(`http://localhost:8080/api/learnings/${id}/done`, {
      method: "PUT",
    }).then(() => {
      fetch("http://localhost:8080/api/learnings")
        .then((res) => res.json())
        .then((data) => setLearnings(data));
    });
  };

  // ===== 歩数追加 =====
  const addHealth = () => {
    if (!steps) return;

    fetch("http://localhost:8080/api/healths", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: String(Date.now()),
        title: `${steps}歩`,
        done: false,
      }),
    }).then(() => {
      fetch("http://localhost:8080/api/healths")
        .then((res) => res.json())
        .then((data) => setHealths(data));

      setSteps("");
    });
  };

  // ===== 歩数削除 =====
  const deleteHealth = (id: string) => {
    fetch(`http://localhost:8080/api/healths/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetch("http://localhost:8080/api/healths")
        .then((res) => res.json())
        .then((data) => setHealths(data));
    });
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#556b5d",
        padding: "40px",
        fontFamily: "sans-serif",
      }}
    >
      {/* ===== タイトル ===== */}

      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1
          style={{
            fontSize: "42px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          タスク・学習・健康管理アプリ
        </h1>

        <p
          style={{
            marginTop: "10px",
            color: "#d1d5db",
            fontSize: "18px",
          }}
        >
          Spring Boot × Next.js Portfolio
        </p>

        <p
          style={{
            marginTop: "12px",
            color: "#bfdbfe",
          }}
        >
          API Status : {message}
        </p>
      </div>

      {/* ===== 横並び ===== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        {/* ========================= */}
        {/* タスク管理 */}
        {/* ========================= */}

        <div style={cardStyle}>
          <h2 style={titleStyle}>📝 タスク管理</h2>

          <div style={inputAreaStyle}>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="タスクを入力"
              style={inputStyle}
            />

            <button onClick={addTask} style={blueButton}>
              追加
            </button>
          </div>

          <ul style={ulStyle}>
            {tasks.map((task: any) => (
              <li
                key={task.id}
                style={{
                  ...listStyle,
                  background: task.done ? "#d1d5db" : "#f9fafb",
                  opacity: task.done ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    textDecoration: task.done
                      ? "line-through"
                      : "none",
                    color: task.done ? "#6b7280" : "#111827",
                    fontWeight: "500",
                  }}
                >
                  {task.title}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() => completeTask(task.id)}
                    style={greenButton}
                  >
                    完了
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    style={redButton}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ========================= */}
        {/* 学習管理 */}
        {/* ========================= */}

        <div style={cardStyle}>
          <h2 style={titleStyle}>📚 学習管理</h2>

          <div style={inputAreaStyle}>
            <input
              value={learningText}
              onChange={(e) => setLearningText(e.target.value)}
              placeholder="学習内容を入力"
              style={inputStyle}
            />

            <button onClick={addLearning} style={greenButton}>
              追加
            </button>
          </div>

          <ul style={ulStyle}>
            {learnings.map((learning: any) => (
              <li
                key={learning.id}
                style={{
                  ...listStyle,
                  background: learning.done
                    ? "#d1d5db"
                    : "#f9fafb",
                  opacity: learning.done ? 0.6 : 1,
                }}
              >
                <span
                  style={{
                    textDecoration: learning.done
                      ? "line-through"
                      : "none",
                    color: learning.done
                      ? "#6b7280"
                      : "#111827",
                    fontWeight: "500",
                  }}
                >
                  {learning.title}
                </span>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={() =>
                      completeLearning(learning.id)
                    }
                    style={greenButton}
                  >
                    完了
                  </button>

                  <button
                    onClick={() =>
                      deleteLearning(learning.id)
                    }
                    style={redButton}
                  >
                    削除
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ========================= */}
        {/* 健康管理 */}
        {/* ========================= */}

        <div style={cardStyle}>
          <h2 style={titleStyle}>🏃 健康管理</h2>

          <div style={inputAreaStyle}>
            <input
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="今日の歩数"
              style={inputStyle}
            />

            <button onClick={addHealth} style={blueButton}>
              記録
            </button>
          </div>

          {/* ===== グラフ ===== */}

          <div
            style={{
              background: "#f3f4f6",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "30px",
            }}
          >
            {/* ===== タイトル + 凡例 ===== */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
              }}
            >
              <h3
                style={{
                  margin: 0,
                  fontSize: "18px",
                  color: "#1f2937",
                }}
              >
                📈 歩数グラフ
              </h3>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "13px",
                  color: "#374151",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    background:
                      "linear-gradient(to top, #2563eb, #60a5fa)",
                    borderRadius: "4px",
                  }}
                />

                <span>歩数</span>
              </div>
            </div>

            {/* ===== グラフ本体 ===== */}

            <div
              style={{
                position: "relative",
                height: "260px",
                paddingTop: "10px",
              }}
            >
              {/* ===== メモリ線 ===== */}

              {[5000, 10000, 15000, 20000].map((line) => (
                <div
                  key={line}
                  style={{
                    position: "absolute",
                    bottom: `${line / 100}px`,
                    left: 0,
                    width: "100%",
                    borderTop: "1px dashed #cbd5e1",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "-5px",
                      top: "-10px",
                      fontSize: "11px",
                      color: "#6b7280",
                      background: "#f3f4f6",
                      paddingRight: "6px",
                    }}
                  >
                    {line}
                  </span>
                </div>
              ))}

              {/* ===== 棒 ===== */}

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "12px",
                  height: "100%",
                }}
              >
                {healths.map(
                  (health: any, index: number) => {
                    const stepValue = parseInt(
                      health.title.replace("歩", "")
                    );

                    const height = Math.max(
                      stepValue / 100,
                      20
                    );

                    return (
                      <div
                        key={health.id}
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          height: "100%",
                          zIndex: 2,
                        }}
                      >
                        <span
                          style={{
                            marginBottom: "8px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            color: "#1f2937",
                          }}
                        >
                          {stepValue}
                        </span>

                        <div
                          style={{
                            width: "100%",
                            maxWidth: "40px",
                            height: `${height}px`,
                            background:
                              "linear-gradient(to top, #2563eb, #60a5fa)",
                            borderRadius:
                              "10px 10px 0 0",
                            transition: "0.3s",
                            boxShadow:
                              "0 4px 10px rgba(37,99,235,0.3)",
                          }}
                        />

                        <span
                          style={{
                            marginTop: "10px",
                            fontSize: "11px",
                            color: "#6b7280",
                          }}
                        >
                          Day {index + 1}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>

          <ul style={ulStyle}>
            {healths.map((health: any) => (
              <li key={health.id} style={listStyle}>
                <span
                  style={{
                    fontWeight: "500",
                  }}
                >
                  {health.title}
                </span>

                <button
                  onClick={() => deleteHealth(health.id)}
                  style={redButton}
                >
                  削除
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}

// ===== 共通スタイル =====

const cardStyle = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.18)",
};

const titleStyle = {
  fontSize: "24px",
  marginBottom: "20px",
  color: "#1f2937",
};

const inputAreaStyle = {
  display: "flex",
  gap: "10px",
  marginBottom: "20px",
};

const ulStyle = {
  listStyle: "none",
  padding: 0,
};

const inputStyle = {
  padding: "10px",
  flex: 1,
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  outline: "none",
};

const listStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px",
  border: "1px solid #e5e7eb",
  borderRadius: "10px",
  marginBottom: "10px",
  transition: "0.2s",
};

const blueButton = {
  padding: "10px 16px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const greenButton = {
  padding: "10px 16px",
  background: "#10b981",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};

const redButton = {
  padding: "10px 16px",
  background: "#ef4444",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
};