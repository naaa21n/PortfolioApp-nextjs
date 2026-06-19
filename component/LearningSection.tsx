// LarningSection.tsx

"use client";

import { useEffect, useState } from "react";

import Layout from "./layout/Layout";
import { apiFetch } from "./lib/api";

type Learning = {
  id: string;
  title: string;
  studyMinutes: number;
  studiedOn: string;
};

type Book = {
  id: number;
  bookTitle: string;
  readingMinutes: number;
  readOn: string;
  imageUrl: string;
};

type CalendarDay = {
  day: number | null;
  dateKey: string | null;
};

type GraphMode = "learning" | "book" | "all";
type ActiveTab = "learning" | "book";

const STUDY_COLOR = "#8b5cf6";
const BOOK_COLOR = "#22d3ee";

const JAPANESE_WEEK_DAYS = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
];

export default function LearningSection() {
  const todayDateKey = toDateKey(new Date());

  const [learnings, setLearnings] = useState<Learning[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>("learning");

  const [graphMode, setGraphMode] = useState<GraphMode>("all");

  const [studyTitle, setStudyTitle] = useState("");
  const [studyTime, setStudyTime] = useState("");
  const [studyDate, setStudyData] = useState("");

  const [bookTitle, setBookTitle] = useState("");
  const [bookTime, setBookTime] = useState("");
  const [bookDate, setBookDate] = useState("");

  const [calendarMonth, setCalendarMonth] = useState(() =>
    toMonthKey(new Date())
  );

  const [graphDisplayDate, setGraphDisplayDate] =
    useState(() => toDateKey(new Date()));

  // デフォルトデータは使用せず、Spring Bootから取得したデータだけを保持する
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    loadLearnings();
    loadBooks();
  }, []);

  // 学習枠の読み込み処理
  const loadLearnings = async () => {
    try {
      // 共通API関数を使って学習記録を取得する
      const res = await apiFetch("/api/learning/records");
      const data = await res.json();

      setLearnings(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  // 読書枠の読み込み処理
  const loadBooks = async () => {
    try {
      // 共通API関数を使って学習記録を取得する
      const res = await apiFetch("/api/learning/readings");
      const data = await res.json();

      setBooks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const addLearning = async () => {
    if (!studyTitle || !studyTime || !studyDate) {
      alert("学習内容・学習時間・学習日を入力してください");
      return;
    }

    try {
      // 共通API関数を使って学習記録を追加する
      // Content-Type は apiFetch 側で自動設定されるため、ここでは headers を書かない
      await apiFetch("/api/learning/records", {
        method: "POST",
        //共通化で記載されたため
        //headers: {
        //  "Content-Type": "application/json",
        //},
        body: JSON.stringify({
          //id: String(Date.now()),
          title: studyTitle,
          studyMinutes: Number(studyTime),
          studiedOn: studyDate,
        }),
      });

      setStudyTitle("");
      setStudyTime("");
      setStudyData("");

      loadLearnings();
    } catch (error) {
      console.error(error);
    }
  };

  // 読書枠の追加
  const addBook = async () => {
    if (!bookTitle || !bookTime || !bookDate) {
      alert("本のタイトル・読書時間・読書日を入力してください");
      return;
    }
    try {
      // 共通API関数を使って学習記録を追加する
      // Content-Type は apiFetch 側で自動設定されるため、ここでは headers を書かない
      await apiFetch("/api/learning/readings", {
        method: "POST",
        //共通化で記載されたため
        //headers: {
        //  "Content-Type": "application/json",
        //},
        body: JSON.stringify({
          //id: String(Date.now()),
          bookTitle: bookTitle,
          readingMinutes: Number(bookTime),
          readOn: bookDate,
          imageUrl: null,
        }),
      });

      setBookTitle("");
      setBookTime("");
      setBookDate("");

      loadBooks();
    } catch (error) {
      console.error(error);
    }
  };

  /*
    setBooks([
      ...books,
      {
        id: Date.now(),
        title: bookTitle,
        readTime: Number(bookTime),
        readDate: bookDate,
        image: "https://placehold.co/60x80",
      },
    ]);

    setBookTitle("");
    setBookTime("");
    setBookDate("");
  };
  */

  const deleteLearning = async (id: string) => {
    try {
      // 共通API関数を使って指定IDの学習記録を削除する
      await apiFetch(`/api/learning/records/${id}`, {
        method: "DELETE",
      });

      loadLearnings();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteBook = async (id: number) => {
    try {
      // 共通API関数を使って指定IDの学習記録を削除する
      await apiFetch(`/api/learning/readings/${id}`, {
        method: "DELETE",
      });

      loadBooks();
    } catch (error) {
      console.error(error);
    }
    //setBooks(books.filter((book) => book.id !== id));
  };

  // デフォルトデータへ切り替えず、取得した学習記録だけを表示する
  const displayLearnings =
    learnings;

  const weekGraphData = Array.from({ length: 7 }).map((_, index) => {
    const dateKey = addDaysToDateKey(graphDisplayDate, index - 6);

    const studyMinutesTotal = displayLearnings.reduce((total, item) => {
      const itemDateKey = normalizeDateKey(item.studiedOn);

      if (itemDateKey !== dateKey) {
        return total;
      }

      return total + Number(item.studyMinutes || 0);
    }, 0);

    const bookMinutesTotal = books.reduce((total, book) => {
      const bookDateKey = normalizeDateKey(book.readOn);

      if (bookDateKey !== dateKey) {
        return total;
      }

      return total + Number(book.readingMinutes || 0);
    }, 0);

    return {
      dateKey,
      studyDate: formatShortDate(dateKey),
      weekDay: formatWeekDay(dateKey),
      studyMinutes: studyMinutesTotal,
      bookMinutes: bookMinutesTotal,
    };
  });

  const maxGraphMinutes = Math.max(
    ...weekGraphData.flatMap((item) => [
      item.studyMinutes,
      item.bookMinutes,
    ]),
    1
  );

  const weekDays = JAPANESE_WEEK_DAYS;

  const calendarDays = createCalendarDays(calendarMonth);

  const studyMarkedDateKeys = new Set(
    displayLearnings
      .map((item) => normalizeDateKey(item.studiedOn))
      .filter(Boolean)
  );

  const bookMarkedDateKeys = new Set(
    books
      .map((book) => normalizeDateKey(book.readOn))
      .filter(Boolean)
  );

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
            <div style={formCardStyle(activeTab)}>
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
                    background:
                      activeTab === "book"
                        ? "#ecfeff"
                        : "#eef2ff",
                    color:
                      activeTab === "book"
                        ? "#0891b2"
                        : "#6366f1",
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
                  background:
                    activeTab === "book"
                      ? "#cffafe"
                      : "#ede9fe",
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
                        ? "linear-gradient(to right,#06b6d4,#22d3ee)"
                        : "transparent",
                  }}
                >
                  読書
                </button>
              </div>

              {activeTab === "learning" && (
                <>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={formLabelStyle(activeTab)}>
                      学習内容
                    </label>
                    <input
                      value={studyTitle}
                      onChange={(e) => setStudyTitle(e.target.value)}
                      placeholder="例：React学習"
                      style={formInputStyle(activeTab)}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={formLabelStyle(activeTab)}>
                      学習時間（分）
                    </label>
                    <input
                      type="number"
                      value={studyTime}
                      onChange={(e) => setStudyTime(e.target.value)}
                      placeholder="例：120"
                      style={formInputStyle(activeTab)}
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={formLabelStyle(activeTab)}>
                      学習日
                    </label>
                    <input
                      type="date"
                      value={studyDate}
                      onChange={(e) => setStudyData(e.target.value)}
                      style={formInputStyle(activeTab, Boolean(studyDate))}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addLearning}
                    style={submitButtonStyle(activeTab)}
                  >
                    ＋ 学習を追加
                  </button>
                </>
              )}

              {activeTab === "book" && (
                <>
                  <div style={{ marginBottom: "14px" }}>
                    <label style={formLabelStyle(activeTab)}>
                      本のタイトル
                    </label>
                    <input
                      value={bookTitle}
                      onChange={(e) => setBookTitle(e.target.value)}
                      placeholder="例：7つの習慣"
                      style={formInputStyle(activeTab)}
                    />
                  </div>

                  <div style={{ marginBottom: "14px" }}>
                    <label style={formLabelStyle(activeTab)}>
                      読書時間（分）
                    </label>
                    <input
                      type="number"
                      value={bookTime}
                      onChange={(e) => setBookTime(e.target.value)}
                      placeholder="例：60"
                      style={formInputStyle(activeTab)}
                    />
                  </div>

                  <div style={{ marginBottom: "18px" }}>
                    <label style={formLabelStyle(activeTab)}>
                      読書日
                    </label>
                    <input
                      type="date"
                      value={bookDate}
                      onChange={(e) => setBookDate(e.target.value)}
                      style={formInputStyle(activeTab, Boolean(bookDate))}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={addBook}
                    style={submitButtonStyle(activeTab)}
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
                学習・読書時間の記録
              </h2>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "12px",
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
                    表示日
                  </label>

                  <input
                    type="date"
                    value={graphDisplayDate}
                    onChange={(e) => setGraphDisplayDate(e.target.value)}
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
                  {formatGraphRange(graphDisplayDate)}
                </div>
              </div>

              {/* 表示切り替え */}
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  marginBottom: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  type="button"
                  onClick={() => setGraphMode("learning")}
                  style={graphModeButtonStyle(
                    graphMode === "learning",
                    STUDY_COLOR
                  )}
                >
                  学習
                </button>

                <button
                  type="button"
                  onClick={() => setGraphMode("book")}
                  style={graphModeButtonStyle(
                    graphMode === "book",
                    BOOK_COLOR
                  )}
                >
                  読書
                </button>

                <button
                  type="button"
                  onClick={() => setGraphMode("all")}
                  style={graphModeButtonStyle(
                    graphMode === "all",
                    "#6366f1"
                  )}
                >
                  すべて
                </button>
              </div>

              {/* 凡例 */}
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                  marginBottom: "8px",
                  color: "#64748b",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {(graphMode === "learning" || graphMode === "all") && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "999px",
                        background: STUDY_COLOR,
                      }}
                    />
                    学習
                  </div>
                )}

                {(graphMode === "book" || graphMode === "all") && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    <span
                      style={{
                        width: "9px",
                        height: "9px",
                        borderRadius: "999px",
                        background: BOOK_COLOR,
                      }}
                    />
                    読書
                  </div>
                )}
              </div>

              <div
                style={{
                  height: "205px",
                  display: "flex",
                  alignItems: "flex-end",
                  gap:
                    graphMode === "all"
                      ? "clamp(5px, 0.8vw, 10px)"
                      : "clamp(8px, 1.2vw, 18px)",
                  padding: "6px 2px 0",
                  minWidth: 0,
                }}
              >
                {weekGraphData.map((item) => {
                  const studyHeight = getGraphBarHeight(
                    item.studyMinutes,
                    maxGraphMinutes
                  );

                  const bookHeight = getGraphBarHeight(
                    item.bookMinutes,
                    maxGraphMinutes
                  );

                  return (
                    <div
                      key={item.dateKey}
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      {graphMode === "all" ? (
                        <div
                          style={{
                            height: "135px",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                            gap: "4px",
                          }}
                        >
                          <div
                            title={`学習 ${formatMinutesLabel(
                              item.studyMinutes
                            )}`}
                            style={{
                              width: "38%",
                              maxWidth: "14px",
                              minWidth: "6px",
                              height: `${studyHeight}px`,
                              borderRadius: "12px 12px 0 0",
                              background:
                                item.studyMinutes === 0
                                  ? "#e2e8f0"
                                  : STUDY_COLOR,
                            }}
                          />

                          <div
                            title={`読書 ${formatMinutesLabel(
                              item.bookMinutes
                            )}`}
                            style={{
                              width: "38%",
                              maxWidth: "14px",
                              minWidth: "6px",
                              height: `${bookHeight}px`,
                              borderRadius: "12px 12px 0 0",
                              background:
                                item.bookMinutes === 0
                                  ? "#e2e8f0"
                                  : BOOK_COLOR,
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            height: "135px",
                            display: "flex",
                            alignItems: "flex-end",
                            justifyContent: "center",
                          }}
                        >
                          <div
                            style={{
                              width: "55%",
                              maxWidth: "26px",
                              minWidth: "10px",
                              height: `${
                                graphMode === "learning"
                                  ? studyHeight
                                  : bookHeight
                              }px`,
                              borderRadius: "14px 14px 0 0",
                              background:
                                graphMode === "learning"
                                  ? item.studyMinutes === 0
                                    ? "#e2e8f0"
                                    : STUDY_COLOR
                                  : item.bookMinutes === 0
                                  ? "#e2e8f0"
                                  : BOOK_COLOR,
                            }}
                          />
                        </div>
                      )}

                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "7px",
                          color: "#64748b",
                          fontSize: "11px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.studyDate}
                      </div>

                      <div
                        style={{
                          textAlign: "center",
                          marginTop: "2px",
                          color: "#94a3b8",
                          fontSize: "10px",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {item.weekDay}
                      </div>

                      {graphMode === "all" ? (
                        <div
                          style={{
                            textAlign: "center",
                            marginTop: "2px",
                            fontSize: "10px",
                            fontWeight: "bold",
                            lineHeight: 1.25,
                          }}
                        >
                          <span style={{ color: STUDY_COLOR }}>
                            {formatMinutesLabel(item.studyMinutes)}
                          </span>
                          <br />
                          <span style={{ color: BOOK_COLOR }}>
                            {formatMinutesLabel(item.bookMinutes)}
                          </span>
                        </div>
                      ) : (
                        <div
                          style={{
                            textAlign: "center",
                            marginTop: "2px",
                            color:
                              graphMode === "learning"
                                ? STUDY_COLOR
                                : BOOK_COLOR,
                            fontSize: "11px",
                            fontWeight: "bold",
                          }}
                        >
                          {graphMode === "learning"
                            ? formatMinutesLabel(item.studyMinutes)
                            : formatMinutesLabel(item.bookMinutes)}
                        </div>
                      )}
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

                  const isToday = dateKey === todayDateKey;

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
                        background: day ? "#ffffff" : "transparent",
                        border: day
                          ? isToday
                            ? `2px solid ${STUDY_COLOR}`
                            : "1px solid #e2e8f0"
                          : "1px solid transparent",
                        boxShadow: day
                          ? isToday
                            ? "0 0 0 4px rgba(139,92,246,0.10)"
                            : "0 4px 10px rgba(15,23,42,0.04)"
                          : "none",
                        color: "#334155",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                        fontWeight: "bold",
                        minWidth: 0,
                        padding: "4px 0",
                        boxSizing: "border-box",
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
                                background: STUDY_COLOR,
                              }}
                            />
                          )}

                          {hasBook && (
                            <span
                              style={{
                                width: "6px",
                                height: "6px",
                                borderRadius: "999px",
                                background: BOOK_COLOR,
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
                      background: STUDY_COLOR,
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
                      background: BOOK_COLOR,
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
                          学習内容：{item.title}
                        </div>

                        <div
                          style={{
                            color: STUDY_COLOR,
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        >
                          学習時間：{formatMinutesLabel(item.studyMinutes)}
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "12px",
                            marginTop: "2px",
                          }}
                        >
                          学習日：{item.studiedOn}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteLearning(item.id)}
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
                        src={book.imageUrl}
                        alt={book.bookTitle}
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
                            color: "#1e293b",
                            wordBreak: "break-word",
                          }}
                        >
                          {book.bookTitle}
                        </div>

                        <div
                          style={{
                            color: BOOK_COLOR,
                            fontSize: "12px",
                          }}
                        >
                          読書時間：{formatMinutesLabel(book.readingMinutes)}
                        </div>

                        <div
                          style={{
                            color: "#64748b",
                            fontSize: "12px",
                            marginTop: "2px",
                          }}
                        >
                          読書日：{book.readOn}
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

const normalizeDateKey = (
  dateText: string | null | undefined
) => {

  if (!dateText) {
    return "";
  }

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

const toMonthKey = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  return `${year}-${pad2(month)}`;
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

const formatWeekDay = (dateKey: string) => {
  const date = createDateFromKey(dateKey);

  return JAPANESE_WEEK_DAYS[date.getDay()];
};

const formatJapaneseDate = (dateKey: string) => {
  const [yearText, monthText, dayText] = dateKey.split("-");

  return `${yearText}年${Number(monthText)}月${Number(dayText)}日`;
};

const formatGraphRange = (displayDateKey: string) => {
  const startDateKey = addDaysToDateKey(displayDateKey, -6);

  return `${formatJapaneseDate(startDateKey)}〜${formatJapaneseDate(
    displayDateKey
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

const formatMinutesLabel = (minutes: number) => {
  const totalMinutes =
    Math.max(
      0,
      Math.floor(Number(minutes) || 0)
    );

  const hours =
    Math.floor(totalMinutes / 60);

  const remainingMinutes =
    totalMinutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}分`;
  }

  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }

  return `${hours}時間${remainingMinutes}分`;
};

const getGraphBarHeight = (value: number, maxValue: number) => {
  if (value === 0) {
    return 8;
  }

  return Math.max(12, (value / maxValue) * 125);
};

const formCardStyle = (
  activeTab: ActiveTab
): React.CSSProperties => ({
  background:
    activeTab === "book"
      ? "linear-gradient(180deg,#f0fdff 0%,#ecfeff 100%)"
      : "linear-gradient(180deg,#fbfaff 0%,#f5f3ff 100%)",
  borderRadius: "24px",
  padding: "22px",
  boxShadow:
    activeTab === "book"
      ? "0 14px 32px rgba(34,211,238,0.14)"
      : "0 14px 32px rgba(99,102,241,0.12)",
  border:
    activeTab === "book"
      ? "1px solid #bae6fd"
      : "1px solid #ddd6fe",
  minWidth: 0,
  boxSizing: "border-box",
});

const formLabelStyle = (
  activeTab: ActiveTab
): React.CSSProperties => ({
  display: "block",
  fontWeight: "bold",
  color: activeTab === "book" ? "#0e7490" : "#5b21b6",
  marginBottom: "6px",
  fontSize: "14px",
});

const formInputStyle = (
  activeTab: ActiveTab,
  hasValue = true
): React.CSSProperties => ({
  width: "100%",
  padding: "12px 14px",
  borderRadius: "12px",
  border:
    activeTab === "book"
      ? "1px solid #67e8f9"
      : "1px solid #c4b5fd",
  outline: "none",
  fontSize: "14px",
  fontWeight: 600,
  boxSizing: "border-box",
  background: "#ffffff",
  color: hasValue ? "#0f172a" : "#94a3b8",
  caretColor: activeTab === "book" ? "#0891b2" : "#7c3aed",
});

const dateInputStyle: React.CSSProperties = {
  padding: "9px 12px",
  borderRadius: "12px",
  border: "1px solid #ddd6fe",
  outline: "none",
  fontSize: "13px",
  fontWeight: 600,
  boxSizing: "border-box",
  color: "#0f172a",
  background: "#fff",
  caretColor: "#7c3aed",
};

const submitButtonStyle = (
  activeTab: ActiveTab
): React.CSSProperties => ({
  width: "100%",
  border: "none",
  background:
    activeTab === "book"
      ? "linear-gradient(to right,#06b6d4,#22d3ee)"
      : "linear-gradient(to right,#7c3aed,#6366f1)",
  color: "#fff",
  padding: "13px 18px",
  borderRadius: "14px",
  fontWeight: "bold",
  fontSize: "15px",
  cursor: "pointer",
});

const graphModeButtonStyle = (
  active: boolean,
  activeColor: string
): React.CSSProperties => ({
  border: active ? "none" : "1px solid #e2e8f0",
  background: active ? activeColor : "#fff",
  color: active ? "#fff" : "#64748b",
  borderRadius: "999px",
  padding: "7px 12px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
  boxShadow: active
    ? "0 8px 16px rgba(99,102,241,0.16)"
    : "none",
});

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