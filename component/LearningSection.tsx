// LarningSection.tsx

"use client";

import { useEffect, useState } from "react";

import Layout from "./layout/Layout";

type Learning = {
  id: string;
  title: string;
  studyHours: number;
  studyDate: string;
};

type Book = {
  id: number;
  title: string;
  time: string;
  readDate: string;
  image: string;
};

type CalendarDay = {
  day: number | null;
  dateKey: string | null;
};

export default function LearningSection() {
  const [learnings, setLearnings] = useState<Learning[]>([]);

  const [activeTab, setActiveTab] = useState<"learning" | "book">(
    "learning"
  );

  const [studyTitle, setStudyTitle] = useState("");
  const [studyHours, setStudyHours] = useState("");
  const [studyDate, setStudyDate] = useState("");

  const [bookTitle, setBookTitle] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookDate, setBookDate] = useState("");

  const [calendarMonth, setCalendarMonth] = useState("2025-06");
  const [graphStartDate, setGraphStartDate] = useState("2025-06-16");

  const [books, setBooks] = useState<Book[]>([
    {
      id: 1,
      title: "7つの習慣",
      time: "120分",
      readDate: "2025-06-16",
      image: "https://placehold.co/60x80",
    },
    {
      id: 2,
      title: "エッセンシャル思考",
      time: "90分",
      readDate: "2025-06-17",
      image: "https://placehold.co/60x80",
    },
    {
      id: 3,
      title: "影響力の武器",
      time: "60分",
      readDate: "2025-06-18",
      image: "https://placehold.co/60x80",
    },
    {
      id: 4,
      title: "THINK AGAIN",
      time: "45分",
      readDate: "2025-06-19",
      image: "https://placehold.co/60x80",
    },
  ]);

  const [sampleLearnings, setSampleLearnings] = useState<Learning[]>([
    {
      id: "sample-1",
      title: "React学習",
      studyHours: 4,
      studyDate: "2025-06-16",
    },
    {
      id: "sample-2",
      title: "TypeScript学習",
      studyHours: 6,
      studyDate: "2025-06-17",
    },
    {
      id: "sample-3",
      title: "Next.js学習",
      studyHours: 2,
      studyDate: "2025-06-18",
    },
    {
      id: "sample-4",
      title: "API連携学習",
      studyHours: 7,
      studyDate: "2025-06-19",
    },
    {
      id: "sample-5",
      title: "UI実装学習",
      studyHours: 5,
      studyDate: "2025-06-20",
    },
  ]);

  useEffect(() => {
    loadLearnings();
  }, []);

  const loadLearnings = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/learnings");
      const data = await res.json();

      setLearnings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const addLearning = async () => {
    if (!studyTitle || !studyHours || !studyDate) {
      alert("学習内容・学習時間・学習日を入力してください");
      return;
    }

    try {
      await fetch("http://localhost:8080/api/learnings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: String(Date.now()),
          title: studyTitle,
          studyHours: Number(studyHours),
          studyDate,
        }),
      });

      setStudyTitle("");
      setStudyHours("");
      setStudyDate("");

      loadLearnings();
    } catch (error) {
      console.error(error);
    }
  };

  const addBook = () => {
    if (!bookTitle || !bookTime || !bookDate) {
      alert("本のタイトル・読書時間・読書日を入力してください");
      return;
    }

    setBooks([
      ...books,
      {
        id: Date.now(),
        title: bookTitle,
        time: `${bookTime}分`,
        readDate: bookDate,
        image: "https://placehold.co/60x80",
      },
    ]);

    setBookTitle("");
    setBookTime("");
    setBookDate("");
  };

  const deleteLearning = async (id: string) => {
    try {
      await fetch("http://localhost:8080/api/learnings/" + id, {
        method: "DELETE",
      });

      loadLearnings();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteDisplayedLearning = (id: string) => {
    if (id.startsWith("sample-")) {
      setSampleLearnings(
        sampleLearnings.filter((item) => item.id !== id)
      );
      return;
    }

    deleteLearning(id);
  };

  const deleteBook = (id: number) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  const displayLearnings =
    learnings.length > 0 ? learnings : sampleLearnings;

  const weekGraphData = Array.from({ length: 7 }).map((_, index) => {
    const dateKey = addDaysToDateKey(graphStartDate, index);

    const totalHours = displayLearnings.reduce((total, item) => {
      const itemDateKey = normalizeDateKey(item.studyDate);

      if (itemDateKey !== dateKey) {
        return total;
      }

      return total + Number(item.studyHours || 0);
    }, 0);

    return {
      dateKey,
      studyDate: formatShortDate(dateKey),
      studyHours: totalHours,
    };
  });

  const maxGraphHours = Math.max(
    ...weekGraphData.map((item) => item.studyHours),
    1
  );

  const weekDays = ["日", "月", "火", "水", "木", "金", "土"];

  const calendarDays = createCalendarDays(calendarMonth);

  const studyMarkedDateKeys = new Set(
    displayLearnings
      .map((item) => normalizeDateKey(item.studyDate))
      .filter(Boolean)
  );

  const bookMarkedDateKeys = new Set(
    books
      .map((book) => normalizeDateKey(book.readDate))
      .filter(Boolean)
  );

  const highlightedDateKey = "2025-06-20";

  return (
    <Layout currentPage="学習と読書の記録">
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          maxWidth: "100%",
          overflowX: "hidden",
          boxSizing: "border-box",
          background:
            "linear-gradient(135deg,#f5f3ff 0%,#eef2ff 100%)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1600px",
            margin: "0 auto",
            padding: "clamp(18px, 2vw, 32px)",
            fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <h1
              style={{
                fontSize: "clamp(30px, 4vw, 44px)",
                fontWeight: "bold",
                color: "#1e1b4b",
                margin: 0,
              }}
            >
              📚 学習と読書の記録
            </h1>

            <div
              style={{
                background: "#fff",
                borderRadius: "22px",
                padding: "18px 26px",
                boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                flexShrink: 0,
              }}
            >
              <div style={{ color: "#64748b", fontSize: "13px" }}>
                連続継続
              </div>

              <div
                style={{
                  fontSize: "34px",
                  fontWeight: "bold",
                  color: "#ef4444",
                }}
              >
                🔥 0日
              </div>
            </div>
          </div>

          {/* TOP */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "20px",
              marginBottom: "18px",
              alignItems: "stretch",
              width: "100%",
              maxWidth: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* 入力フォーム */}
            <div style={formCardStyle}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                  marginBottom: "16px",
                }}
              >
                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: "bold",
                    color: "#1e293b",
                    margin: 0,
                  }}
                >
                  記録を追加
                </h2>

                <span
                  style={{
                    background: "#eef2ff",
                    color: "#6366f1",
                    borderRadius: "999px",
                    padding: "6px 10px",
                    fontSize: "12px",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  入力フォーム
                </span>
              </div>

              {/* タブ */}
              <div
                style={{
                  display: "flex",
                  background: "#ede9fe",
                  borderRadius: "16px",
                  padding: "5px",
                  marginBottom: "18px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab("learning")}
                  style={{
                    flex: 1,
                    border: "none",
                    padding: "10px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: activeTab === "learning" ? "#fff" : "#64748b",
                    background:
                      activeTab === "learning"
                        ? "linear-gradient(to right,#7c3aed,#6366f1)"
                        : "transparent",
                  }}
                >
                  学習
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("book")}
                  style={{
                    flex: 1,
                    border: "none",
                    padding: "10px",
                    borderRadius: "12px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: activeTab === "book" ? "#fff" : "#64748b",
                    background:
                      activeTab === "book"
                        ? "linear-gradient(to right,#7c3aed,#6366f1)"
                        : "transparent",
                  }}
                >
                  読書
                </button>
              </div>

              {activeTab === "learning" && (
                <>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={labelStyle}>学習内容</label>
                    <input
                      value={studyTitle}
                      onChange={(e) => setStudyTitle(e.target.value)}
                      placeholder="例：React学習"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={labelStyle}>学習時間</label>
                    <input
                      type="number"
                      value={studyHours}
                      onChange={(e) => setStudyHours(e.target.value)}
                      placeholder="例：2"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>学習日</label>
                    <input
                      type="date"
                      value={studyDate}
                      onChange={(e) => setStudyDate(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addLearning}
                    style={submitButtonStyle}
                  >
                    ＋ 学習を追加
                  </button>
                </>
              )}

              {activeTab === "book" && (
                <>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={labelStyle}>本のタイトル</label>
                    <input
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="例：7つの習慣"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={labelStyle}>読書時間</label>
                    <input
                      type="number"
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      placeholder="例：60"
                      style={inputStyle}
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={labelStyle}>読書日</label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      style={inputStyle}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addBook}
                    style={submitButtonStyle}
                  >
                    ＋ 読書を追加
                  </button>
                </>
              )}
            </div>

            {/* 棒グラフ */}
            <div
              style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "22px",
                boxShadow: "0 10px 26px rgba(0,0,0,0.05)",
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "14px",
                  marginTop: 0,
                }}
              >
                学習時間の記録
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "14px",
                  flexWrap: "wrap",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: "#64748b",
                      marginBottom: "6px",
                    }}
                  >
                    表示開始日
                  </label>

                  <input
                    type="date"
                    value={graphStartDate}
                    onChange={(e) => setGraphStartDate(e.target.value)}
                    style={dateInputStyle}
                  />
                </div>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: "bold",
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "999px",
                    padding: "8px 12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatGraphRange(graphStartDate)}
                </div>
              </div>

              <div
                style={{
                  height: "210px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap: "clamp(8px, 1.2vw, 18px)",
                  padding: "8px 2px 0",
                  minWidth: 0,
                }}
              >
                {weekGraphData.map((item) => {
                  const height =
                    item.studyHours === 0
                      ? 8
                      : Math.max(
                          14,
                          (item.studyHours / maxGraphHours) * 155
                        );

                  return (
                    <div
                      key={item.dateKey}
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          height: `${height}px`,
                          maxHeight: "155px",
                          borderRadius: "18px 18px 0 0",
                          background:
                            item.studyHours === 0
                              ? "#e2e8f0"
                              : "linear-gradient(to top,#22d3ee,#8b5cf6)",
                        }}
                      />

                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "8px",
                          color: "#64748b",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.studyDate}
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "3px",
                          color: "#6366f1",
                          fontSize: "11px",
                          fontWeight: "bold",
                        }}
                      >
                        {item.studyHours}h
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* カレンダー */}
            <div
              style={{
                background:
                  "linear-gradient(180deg,#ffffff 0%,#f8fafc 100%)",
                borderRadius: "24px",
                padding: "22px",
                boxShadow: "0 14px 30px rgba(99,102,241,0.10)",
                border: "1px solid rgba(226,232,240,0.9)",
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginTop: 0,
                  marginBottom: "16px",
                }}
              >
                カレンダー
              </h2>

              <div
                style={{
                  marginBottom: "16px",
                }}
              >
                <label
                  style={{
                    display: "block",
                    fontSize: "12px",
                    fontWeight: "bold",
                    color: "#64748b",
                    marginBottom: "6px",
                  }}
                >
                  表示年月
                </label>

                <input
                  type="month"
                  value={calendarMonth}
                  onChange={(e) => setCalendarMonth(e.target.value)}
                  style={dateInputStyle}
                  aria-label="カレンダーの年月を選択"
                />

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "12px",
                    fontWeight: "bold",
                    marginTop: "8px",
                  }}
                >
                  {formatJapaneseMonth(calendarMonth)}を表示中
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: "6px",
                  marginBottom: "8px",
                }}
              >
                {weekDays.map((day) => (
                  <div
                    key={day}
                    style={{
                      textAlign: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color: day === "日" ? "#ef4444" : "#64748b",
                    }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
                  gap: "6px",
                }}
              >
                {calendarDays.map((calendarDay, i) => {
                  const day = calendarDay.day;
                  const dateKey = calendarDay.dateKey;

                  const isToday = dateKey === highlightedDateKey;
                  const hasStudy =
                    dateKey !== null && studyMarkedDateKeys.has(dateKey);
                  const hasBook =
                    dateKey !== null && bookMarkedDateKeys.has(dateKey);

                  return (
                    <div
                      key={i}
                      style={{
                        minHeight: "40px",
                        borderRadius: "14px",
                        background: isToday
                          ? "linear-gradient(135deg,#8b5cf6,#6366f1)"
                          : day
                          ? "#ffffff"
                          : "transparent",
                        border: day
                          ? "1px solid #e2e8f0"
                          : "1px solid transparent",
                        boxShadow: isToday
                          ? "0 10px 18px rgba(99,102,241,0.24)"
                          : day
                          ? "0 4px 10px rgba(15,23,42,0.04)"
                          : "none",
                        color: isToday ? "#fff" : "#334155",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        fontWeight: "bold",
                        minWidth: 0,
                        padding: "4px 0",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "12px",
                          lineHeight: 1,
                        }}
                      >
                        {day ?? ""}
                      </span>

                      {day && (
                        <div
                          style={{
                            display: "flex",
                            gap: "4px",
                            height: "6px",
                          }}
                        >
                          {hasStudy && (
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "999px",
                                background: isToday ? "#fff" : "#8b5cf6",
                              }}
                            />
                          )}

                          {hasBook && (
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "999px",
                                background: isToday ? "#dbeafe" : "#22d3ee",
                              }}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "14px",
                  marginTop: "16px",
                  padding: "12px 14px",
                  borderRadius: "16px",
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  <span
                    style={{
                      width: "9px",
                      height: "9px",
                      borderRadius: "999px",
                      background: "#8b5cf6",
                    }}
                  />
                  学習
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    color: "#475569",
                    fontSize: "13px",
                    fontWeight: "bold",
                  }}
                >
                  <span
                    style={{
                      width: "9px",
                      height: "9px",
                      borderRadius: "999px",
                      background: "#22d3ee",
                    }}
                  />
                  読書
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "16px",
              marginBottom: "16px",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            {/* 学習履歴 */}
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.045)",
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "10px",
                  marginTop: 0,
                }}
              >
                学習履歴
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {displayLearnings.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      border: "1px solid #ede9fe",
                      borderRadius: "13px",
                      padding: "9px 11px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          width: "38px",
                          height: "38px",
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg,#8b5cf6,#6366f1)",
                          color: "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "18px",
                          flexShrink: 0,
                          boxShadow:
                            "0 6px 14px rgba(99,102,241,0.20)",
                        }}
                      >
                        ✏️
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "2px",
                            color: "#1e293b",
                            fontSize: "13px",
                            wordBreak: "break-word",
                          }}
                        >
                          学習内容 : {item.title}
                        </div>

                        <div
                          style={{
                            color: "#6366f1",
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          学習時間 : {item.studyHours}時間
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "12px",
                            marginTop: "2px",
                          }}
                        >
                          学習日 : {item.studyDate}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteDisplayedLearning(item.id)}
                      style={compactDeleteButtonStyle}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 読書記録 */}
            <div
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "16px",
                boxShadow: "0 8px 20px rgba(0,0,0,0.045)",
                minWidth: 0,
                boxSizing: "border-box",
              }}
            >
              <h2
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  marginBottom: "10px",
                  marginTop: 0,
                }}
              >
                読書記録
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                }}
              >
                {books.map((book) => (
                  <div
                    key={book.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      border: "1px solid #ede9fe",
                      borderRadius: "13px",
                      padding: "9px 11px",
                      minWidth: 0,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                        minWidth: 0,
                      }}
                    >
                      <img
                        src={book.image}
                        alt={book.title}
                        style={{
                          width: "38px",
                          height: "52px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />

                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "2px",
                            fontSize: "13px",
                            wordBreak: "break-word",
                          }}
                        >
                          {book.title}
                        </div>

                        <div
                          style={{
                            color: "#6366f1",
                            fontSize: "12px",
                          }}
                        >
                          読書時間 : {book.time}
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "12px",
                            marginTop: "2px",
                          }}
                        >
                          読書日 : {book.readDate}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteBook(book.id)}
                      style={compactDeleteButtonStyle}
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const pad2 = (value: number) => String(value).padStart(2, "0");

const normalizeDateKey = (dateText: string) => {
  const text = dateText.trim();

  const match = text.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);

  if (!match) {
    return "";
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return `${year}-${pad2(month)}-${pad2(day)}`;
};

const createDateFromKey = (dateKey: string) => {
  const [yearText, monthText, dayText] = dateKey.split("-");

  return new Date(
    Number(yearText),
    Number(monthText) - 1,
    Number(dayText)
  );
};

const toDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${pad2(month)}-${pad2(day)}`;
};

const addDaysToDateKey = (dateKey: string, days: number) => {
  const date = createDateFromKey(dateKey);
  date.setDate(date.getDate() + days);

  return toDateKey(date);
};

const formatShortDate = (dateKey: string) => {
  const [, monthText, dayText] = dateKey.split("-");

  return `${Number(monthText)}/${Number(dayText)}`;
};

const formatJapaneseDate = (dateKey: string) => {
  const [yearText, monthText, dayText] = dateKey.split("-");

  return `${yearText}年${Number(monthText)}月${Number(dayText)}日`;
};

const formatGraphRange = (startDateKey: string) => {
  const endDateKey = addDaysToDateKey(startDateKey, 6);

  return `${formatJapaneseDate(startDateKey)}〜${formatJapaneseDate(
    endDateKey
  )}`;
};

const splitMonthValue = (monthValue: string) => {
  const [yearText, monthText] = monthValue.split("-");

  return {
    year: Number(yearText),
    month: Number(monthText),
  };
};

const formatJapaneseMonth = (monthValue: string) => {
  const { year, month } = splitMonthValue(monthValue);

  return `${year}年${month}月`;
};

const createCalendarDays = (monthValue: string): CalendarDay[] => {
  const { year, month } = splitMonthValue(monthValue);

  const firstDate = new Date(year, month - 1, 1);
  const firstDayOfWeek = firstDate.getDay();
  const lastDay = new Date(year, month, 0).getDate();

  const totalCells = Math.ceil((firstDayOfWeek + lastDay) / 7) * 7;

  return Array.from({ length: totalCells }).map((_, index) => {
    const day = index - firstDayOfWeek + 1;

    if (day < 1 || day > lastDay) {
      return {
        day: null,
        dateKey: null,
      };
    }

    return {
      day,
      dateKey: `${year}-${pad2(month)}-${pad2(day)}`,
    };
  });
};

const formCardStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg,#fbfaff 0%,#f5f3ff 100%)",
  borderRadius: "24px",
  padding: "22px",
  boxShadow: "0 14px 32px rgba(99,102,241,0.12)",
  border: "1px solid #ddd6fe",
  minWidth: 0,
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontWeight: "bold",
  color: "#475569",
  marginBottom: "6px",
  fontSize: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #ddd6fe",
  outline: "none",
  fontSize: "14px",
  boxSizing: "border-box",
  background: "#ffffff",
};

const dateInputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: "12px",
  border: "1px solid #ddd6fe",
  outline: "none",
  fontSize: "13px",
  boxSizing: "border-box",
  color: "#334155",
  background: "#fff",
};

const submitButtonStyle: React.CSSProperties = {
  width: "100%",
  border: "none",
  background: "linear-gradient(to right,#7c3aed,#6366f1)",
  color: "#fff",
  padding: "13px 18px",
  borderRadius: "14px",
  fontWeight: "bold",
  fontSize: "15px",
  cursor: "pointer",
};

const compactDeleteButtonStyle: React.CSSProperties = {
  border: "none",
  background: "#fee2e2",
  color: "#dc2626",
  borderRadius: "9px",
  padding: "7px 10px",
  cursor: "pointer",
  flexShrink: 0,
  fontSize: "12px",
  fontWeight: "bold",
};