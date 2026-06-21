"use client";

// このファイルは、タスク一覧・タスク追加・完了切替・削除と、
// 画面内だけで使う簡易メモ帳を表示するクライアントコンポーネントです。
// タスク操作は apiFetch を通して Next.js のBFFへ送り、そこからSpring Bootへ中継します。

// =========================
// Import
// =========================

import {
  useCallback,
  useEffect,
  useState,
} from "react";

// 共通レイアウト
//
// Sidebar込み画面
import Layout from "./layout/Layout";
import { apiFetch } from "./lib/api";

// =========================
// Type
// =========================

type Task = {
  // Spring Boot側で採番されたタスクID
  id: string;

  // タスク名
  title: string;

  // 実際に取り組む日付
  taskDate: string;

  // タスクの期限日
  deadline: string;

  // タスクの詳細説明
  content: string;

  // 完了済みかどうか
  completed: boolean;
};

type Memo = {
  // メモは現状画面内だけで管理するため、Date.now()由来のIDを使う
  id: string;
  title: string;
  content: string;
};

// =========================
// Tasks Page
// =========================
//
// タスク管理画面
export default function TasksPage() {

  const todayDateKey =
    toDateKey(new Date());

  // =========================
  // State
  // =========================

  // Spring Bootから取得したタスク一覧を保持する
  const [tasks, setTasks] =
    useState<Task[]>([]);

  // メモはまだAPI連携せず、この画面内のstateだけで管理する
  const [memos, setMemos] =
    useState<Memo[]>([
      {
        id: "memo-1",
        title: "アイデア",
        content: "新しいプロジェクトについて整理する",
      },
      {
        id: "memo-2",
        title: "読書メモ",
        content: "嫌われる勇気を読み直す",
      },
      {
        id: "memo-3",
        title: "買い物リスト",
        content: "水・コーヒー・ノート",
      },
    ]);

  // Task
  const [taskTitle, setTaskTitle] =
    useState("");

  const [taskDate, setTaskDate] =
    useState(todayDateKey);

  const [deadline, setDeadline] =
    useState(todayDateKey);

  const [taskContent, setTaskContent] =
    useState("");

  // Memo
  const [memoTitle, setMemoTitle] =
    useState("");

  const [memoContent, setMemoContent] =
    useState("");

  // =========================
  // Derived Data
  // =========================

  // 今日の日付に該当するタスクだけを抽出する
  const todayTasks =
    tasks.filter(
      (task) =>
        task.taskDate === todayDateKey
    );

  // 今日のタスクのうち、完了済みのものだけを数える
  const completedTodayTasks =
    todayTasks.filter(
      (task) => task.completed
    );

  // 全タスクのうち、完了済みのものだけを抽出する
  const completedTasks =
    tasks.filter(
      (task) => task.completed
    );

  // 全タスクのうち、未完了のものだけを抽出する
  const incompleteTasks =
    tasks.filter(
      (task) => !task.completed
    );

  // 今週の達成率を出すため、今週の日付に該当するタスクだけを抽出する
  const thisWeekTasks =
    tasks.filter(
      (task) =>
        isThisWeek(task.taskDate)
    );

  // 今週のタスクのうち、完了済みのものだけを抽出する
  const completedThisWeekTasks =
    thisWeekTasks.filter(
      (task) => task.completed
    );

  // 今週のタスクが0件の場合は0%、それ以外は完了数 / 全体数で達成率を計算する
  const weeklyRate =
    thisWeekTasks.length === 0
      ? 0
      : Math.round(
          (
            completedThisWeekTasks.length /
            thisWeekTasks.length
          ) * 100
        );

  // =========================
  // Task Function
  // =========================

  // タスク一覧をSpring Bootから取得する
  //
  // ブラウザからは /api/tasks にアクセスするが、
  // 実際には app/api/[...path]/route.ts を経由して Spring Boot の /api/tasks へ中継される
  const loadTasks = useCallback(async () => {
    try {
      // 共通API関数を使用してタスク記録を取得
      const res = await apiFetch("/api/tasks");
      const data = await res.json();

      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Task 読み込みの失敗", error);
    }
  }, []);

  const loadMemos = useCallback(async () => {
    try {
      // 共通API関数を使用してタスク記録を取得
      const res = await apiFetch("/api/memos");
      const data = await res.json();

      setMemos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Memo 読み込みの失敗", error);
    }
  }, []);

  // 画面初回表示時にタスク一覧を取得する
  //
  // setTimeoutを挟んでいるのは、このプロジェクトのlintルールで
  // useEffect内から状態更新につながる処理を直接呼ぶ警告を避けるため
  useEffect(() => {
    const timer = window.setTimeout(() => {
      loadTasks();
      loadMemos();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [loadTasks,loadMemos]);

  // 入力フォームの内容をSpring BootへPOSTして、新しいタスクを作成する
  const addTask = async () => {

    if (
      !taskTitle.trim() ||
      !taskDate ||
      !deadline
    ) {
      alert(
        "タスク名・実施日・期限を入力してください"
      );
      return;
    }

    // Spring Bootへ送るJSON
    // idはSpring Boot側で作る想定なので、フロントからは送らない
    const body = {
      title: taskTitle,
      taskDate,
      deadline,
      content: taskContent,
      completed: false,
    };

    try {
      // POST /api/tasks
      //
      // apiFetchがContent-Typeを付け、BFF経由でSpring Bootへ送る
      await apiFetch("/api/tasks", {
        method: "POST",
        body: JSON.stringify(body),
      });

      // 保存成功後は入力欄を初期状態に戻す
      setTaskTitle("");
      setTaskDate(todayDateKey);
      setDeadline(todayDateKey);
      setTaskContent("");

      // サーバー側の最新状態を画面へ反映するため、一覧を再取得する
      loadTasks();
    } catch (error) {
      console.error("Task 追加の失敗", error);
    }
  };

  // 指定IDのタスクを完了/未完了に切り替える
  //
  // Spring Boot側のAPI設計に合わせて PUT /api/tasks/{id}/done を呼ぶ
  const toggleTaskDone = async (
    id: string,
    completed: boolean
  ) => {

    const statusPath =
      completed
        ? "undone"
        : "done";

    await apiFetch(
      `/api/tasks/${id}/${statusPath}`,
      {
        method: "PUT",
      }
    );

    await loadTasks();
  };

  // 指定IDのタスクをSpring Bootから削除する
  const deleteTask = async (
    id: string
  ) => {

    try {
      // DELETE /api/tasks/{id}
      await apiFetch(`/api/tasks/${id}`, {
        method: "DELETE",
      });

      // 削除後の一覧を取り直して、画面にも削除結果を反映する
      loadTasks();
    } catch (error) {
      console.error("Task 削除の失敗", error);
    }
  };

  // =========================
  // Memo Function
  // =========================

  const addMemo = async () => {

    if (
      !memoTitle.trim() ||
      !memoContent.trim()
    ) {
      alert(
        "メモのタイトルと内容を入力してください"
      );
      return;
    }

    const body = {
      title: memoTitle,
      taskDate,
      deadline,
      content: memoContent,
    };

    try {
    // POST /api/tasks
    //
    // apiFetchがContent-Typeを付け、BFF経由でSpring Bootへ送る
      await apiFetch("/api/memos", {
        method: "POST",
        body: JSON.stringify(body),
      });

      setMemoTitle("");
      setTaskDate(todayDateKey);
      setDeadline(todayDateKey);
      setMemoContent("");

      loadMemos();
    } catch (error) {
        console.error("Task 追加の失敗", error);
    }
  };

  const deleteMemo = async (
    id: string
  ) => {

    try {
      // DELETE /api/tasks/{id}
      await apiFetch(`/api/memos/${id}`, {
        method: "DELETE",
      });

      // 削除後の一覧を取り直して、画面にも削除結果を反映する
      loadMemos();
    } catch(error){
      console.error("Memo 削除が失敗", error);
   }
  };

  return (

    // =========================
    // Layout
    // =========================
    //
    // Sidebar + Main画面
    <Layout currentPage="タスクとメモ帳">

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

        {/* =========================
             Page Inner
        ========================= */}
        <div
          style={{
            width: "100%",
            maxWidth: "1600px",
            margin: "0 auto",
            padding:
              "clamp(18px, 2vw, 32px)",
            fontFamily:
              "'Inter', 'Noto Sans JP', sans-serif",
            boxSizing: "border-box",
            overflowX: "hidden",
          }}
        >

          {/* =========================
               Header
          ========================= */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: "20px",
              marginBottom: "20px",
              flexWrap: "wrap",
            }}
          >
            <div>

              {/* タイトル */}
              <h1
                style={{
                  fontSize:
                    "clamp(30px, 4vw, 44px)",
                  fontWeight: "bold",
                  color: "#1e1b4b",
                  margin: 0,
                }}
              >
                📝 タスクとメモ帳
              </h1>

              {/* サブメッセージ */}
              <p
                style={{
                  color: "#64748b",
                  fontSize: "16px",
                  marginTop: "8px",
                }}
              >
                小さな一歩を積み重ねて、
                今日やることを整理しよう。
              </p>

            </div>
          </div>

          {/* =========================
               Top Summary Cards
          ========================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(230px, 1fr))",
              gap: "20px",
              marginBottom: "20px",
            }}
          >

            {/* 今日のタスク */}
            <div style={summaryCard}>

              <div style={emojiStyle}>
                ✅
              </div>

              <div>

                <div style={smallText}>
                  今日のタスク
                </div>

                <div style={bigText}>
                  {completedTodayTasks.length}
                  {" / "}
                  {todayTasks.length}
                  件
                </div>

              </div>
            </div>

            {/* 今週の達成率 */}
            <div style={summaryCard}>

              <div style={emojiStyle}>
                📅
              </div>

              <div>

                <div style={smallText}>
                  今週の達成率
                </div>

                <div style={bigText}>
                  {weeklyRate}%
                </div>

              </div>
            </div>

            {/* 未完了 */}
            <div style={summaryCard}>

              <div style={emojiStyle}>
                🕒
              </div>

              <div>

                <div style={smallText}>
                  未完了タスク
                </div>

                <div style={bigText}>
                  {incompleteTasks.length}
                  件
                </div>

              </div>
            </div>

            {/* 総完了数 */}
            <div style={summaryCard}>

              <div style={emojiStyle}>
                ⭐
              </div>

              <div>

                <div style={smallText}>
                  総タスク完了数
                </div>

                <div style={bigText}>
                  {completedTasks.length}
                  件
                </div>

              </div>
            </div>

          </div>

          {/* =========================
               Task Add Area
          ========================= */}
          <div style={mainCard}>

            {/* タイトル */}
            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginTop: 0,
                marginBottom: "18px",
                color: "#1e293b",
              }}
            >
              ✏️ タスクを追加
            </h2>

            {/* =========================
                 Task Input Area
            ========================= */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
              }}
            >

              {/* 実施日 */}
              <div>
                <div style={labelStyle}>
                  実施日
                </div>

                <input
                  type="date"
                  value={taskDate}
                  onChange={(e) =>
                    setTaskDate(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>

              {/* 期限 */}
              <div>
                <div style={labelStyle}>
                  期限
                </div>

                <input
                  type="date"
                  value={deadline}
                  onChange={(e) =>
                    setDeadline(e.target.value)
                  }
                  style={inputStyle}
                />
              </div>

              {/* タスク名 */}
              <div
                style={{
                  gridColumn:
                    "span 2",
                }}
              >
                <div style={labelStyle}>
                  タスク名
                </div>

                <input
                  value={taskTitle}
                  onChange={(e) =>
                    setTaskTitle(e.target.value)
                  }
                  placeholder="例：Spring BootのEntityを作成"
                  style={inputStyle}
                />
              </div>

            </div>

            {/* =========================
                 Task Detail
            ========================= */}
            <div
              style={{
                marginTop: "18px",
              }}
            >

              <div style={labelStyle}>
                内容
              </div>

              <textarea
                value={taskContent}
                onChange={(e) =>
                  setTaskContent(e.target.value)
                }
                placeholder="タスクの詳細やメモを入力..."
                style={textareaStyle}
              />

            </div>

            {/* =========================
                 Add Button Area
            ========================= */}
            <div
              style={{
                marginTop: "18px",
                display: "flex",
                justifyContent:
                  "flex-end",
              }}
            >

              {/* 追加ボタン */}
              <button
                type="button"
                onClick={addTask}
                style={blueButton}
              >
                ➕ タスクを追加
              </button>

            </div>

          </div>

          {/* =========================
               Task List + Today Schedule
          ========================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "2fr 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >

            {/* =========================
                 Task List
            ========================= */}
            <div style={mainCard}>

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "18px",
                  flexWrap: "wrap",
                }}
              >

                <h2
                  style={{
                    color: "#1e293b",
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  ✅ タスク一覧
                </h2>

                <div
                  style={{
                    color: "#64748b",
                    fontSize: "13px",
                    fontWeight: "bold",
                    background: "#f8fafc",
                    border:
                      "1px solid #e2e8f0",
                    borderRadius: "999px",
                    padding: "8px 12px",
                  }}
                >
                  未完了 {incompleteTasks.length}件
                </div>

              </div>

              {/* 一覧 */}
              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "10px",
                }}
              >

                {tasks.length === 0 && (
                  <div style={emptyText}>
                    まだタスクがありません。
                  </div>
                )}

                {tasks.map((task) => (

                  <div
                    key={task.id}
                    style={{
                      ...taskItem,
                      opacity:
                        task.completed
                          ? 0.72
                          : 1,
                    }}
                  >

                    <div
                      style={{
                        minWidth: 0,
                        flex: 1,
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "6px",
                          flexWrap: "wrap",
                        }}
                      >

                        <span
                          style={{
                            ...statusBadge,
                            background:
                              task.completed
                                ? "#dcfce7"
                                : "#fef3c7",
                            color:
                              task.completed
                                ? "#15803d"
                                : "#b45309",
                          }}
                        >
                          {task.completed
                            ? "完了"
                            : "未完了"}
                        </span>

                        <strong
                          style={{
                            color: "#1e293b",
                            textDecoration:
                              task.completed
                                ? "line-through"
                                : "none",
                            wordBreak:
                              "break-word",
                          }}
                        >
                          {task.title}
                        </strong>

                      </div>

                      <div style={taskMetaText}>
                        実施日：{task.taskDate}
                        {" / "}
                        期限：{task.deadline}
                      </div>

                      {task.content && (
                        <div
                          style={{
                            color: "#475569",
                            fontSize: "13px",
                            marginTop: "6px",
                            whiteSpace: "pre-wrap",
                          }}
                        >
                          {task.content}
                        </div>
                      )}

                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        flexShrink: 0,
                      }}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          toggleTaskDone(
                            task.id,
                            task.completed
                          )
                        }
                        style={greenButton}
                      >
                        {task.completed
                          ? "戻す"
                          : "完了"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteTask(task.id)
                        }
                        style={redButton}
                      >
                        削除
                      </button>

                    </div>

                  </div>

                ))}

              </div>

            </div>

            {/* =========================
                 Schedule Area
            ========================= */}
            <div style={mainCard}>

              {/* タイトル */}
              <h2
                style={{
                  color: "#1e293b",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: 0,
                  marginBottom: "18px",
                }}
              >
                📅 今日の予定
              </h2>

              {todayTasks.length === 0 && (
                <div style={emptyText}>
                  今日の予定はありません。
                </div>
              )}

              {todayTasks.map((task) => (
                <div
                  key={task.id}
                  style={scheduleItem}
                >
                  <div
                    style={{
                      fontWeight: "bold",
                      color: "#1e293b",
                      marginBottom: "4px",
                    }}
                  >
                    {task.completed
                      ? "✅"
                      : "🕒"}{" "}
                    {task.title}
                  </div>

                  <div
                    style={{
                      color: "#64748b",
                      fontSize: "12px",
                    }}
                  >
                    期限：{task.deadline}
                  </div>
                </div>
              ))}

            </div>

          </div>

          {/* =========================
               Memo Area
          ========================= */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: "20px",
              marginTop: "20px",
            }}
          >

            {/* =========================
                 Memo Input
            ========================= */}
            <div style={mainCard}>

              <h2
                style={{
                  color: "#1e293b",
                  fontSize: "24px",
                  fontWeight: "bold",
                  marginTop: 0,
                  marginBottom: "18px",
                }}
              >
                📒 メモを追加
              </h2>

              <div style={labelStyle}>
                タイトル
              </div>

              <input
                value={memoTitle}
                onChange={(e) =>
                  setMemoTitle(e.target.value)
                }
                placeholder="例：アイデア"
                style={inputStyle}
              />

              <div
                style={{
                  ...labelStyle,
                  marginTop: "16px",
                }}
              >
                内容
              </div>

              <textarea
                value={memoContent}
                onChange={(e) =>
                  setMemoContent(e.target.value)
                }
                placeholder="メモ内容を入力..."
                style={textareaStyle}
              />

              <div
                style={{
                  marginTop: "18px",
                  display: "flex",
                  justifyContent:
                    "flex-end",
                }}
              >
                <button
                  type="button"
                  onClick={addMemo}
                  style={blueButton}
                >
                  ＋ メモを追加
                </button>
              </div>

            </div>

            {/* =========================
                 Memo List
            ========================= */}
            <div style={mainCard}>

              {/* Header */}
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: "18px",
                }}
              >

                <h2
                  style={{
                    color: "#1e293b",
                    fontSize: "24px",
                    fontWeight: "bold",
                    margin: 0,
                  }}
                >
                  📚 メモ一覧
                </h2>

                <div
                  style={{
                    ...statusBadge,
                    background: "#ede9fe",
                    color: "#6d28d9",
                  }}
                >
                  {memos.length}件
                </div>

              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "10px",
                }}
              >

                {memos.length === 0 && (
                  <div style={emptyText}>
                    まだメモがありません。
                  </div>
                )}

                {memos.map((memo) => (

                  <div
                    key={memo.id}
                    style={memoItem}
                  >

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >

                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#1e293b",
                          marginBottom: "6px",
                          wordBreak:
                            "break-word",
                        }}
                      >
                        {memo.title}
                      </div>

                      <div
                        style={{
                          color: "#475569",
                          fontSize: "13px",
                          whiteSpace:
                            "pre-wrap",
                        }}
                      >
                        {memo.content}
                      </div>

                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        deleteMemo(memo.id)
                      }
                      style={redButton}
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

/* =========================
   Helper
========================= */

const pad2 = (
  value: number
) =>
  String(value).padStart(2, "0");

const toDateKey = (
  date: Date
) => {

  const year =
    date.getFullYear();

  const month =
    date.getMonth() + 1;

  const day =
    date.getDate();

  return `${year}-${pad2(month)}-${pad2(day)}`;
};

const isThisWeek = (
  dateKey: string
) => {

  const target =
    new Date(dateKey);

  const now =
    new Date();

  const start =
    new Date(now);

  start.setDate(
    now.getDate() -
      now.getDay()
  );

  start.setHours(
    0,
    0,
    0,
    0
  );

  const end =
    new Date(start);

  end.setDate(
    start.getDate() + 6
  );

  end.setHours(
    23,
    59,
    59,
    999
  );

  return (
    target >= start &&
    target <= end
  );
};

/* =========================
   Styles
========================= */

// メインカード
//
// 白背景 + 角丸 + 影
const mainCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: "24px",
  padding: "22px",
  boxShadow:
    "0 10px 26px rgba(0,0,0,0.05)",
  minWidth: 0,
  boxSizing: "border-box",
};

// 上部サマリーカード
const summaryCard: React.CSSProperties = {
  background: "#fff",
  borderRadius: "22px",
  padding: "20px 22px",
  display: "flex",
  alignItems: "center",
  gap: "16px",
  boxShadow:
    "0 10px 26px rgba(0,0,0,0.05)",
  minWidth: 0,
  boxSizing: "border-box",
};

// Emoji
const emojiStyle: React.CSSProperties = {
  fontSize: "32px",
};

// 小文字
const smallText: React.CSSProperties = {
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "bold",
};

// 大文字
const bigText: React.CSSProperties = {
  fontSize: "30px",
  fontWeight: "bold",
  color: "#1e293b",
};

// Input
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  border:
    "1px solid #c4b5fd",
  borderRadius: "12px",
  outline: "none",
  fontSize: "14px",
  fontWeight: 600,
  boxSizing: "border-box",
  background: "#fff",
  color: "#0f172a",
  caretColor: "#7c3aed",
};

// Textarea
const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "120px",
  border:
    "1px solid #c4b5fd",
  borderRadius: "12px",
  padding: "12px 14px",
  resize: "vertical",
  outline: "none",
  fontSize: "14px",
  fontWeight: 600,
  boxSizing: "border-box",
  color: "#0f172a",
  background: "#fff",
  caretColor: "#7c3aed",
};

// 青Button
const blueButton: React.CSSProperties = {
  padding: "12px 18px",
  background:
    "linear-gradient(to right,#7c3aed,#6366f1)",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "bold",
};

// 緑Button
const greenButton: React.CSSProperties = {
  padding: "9px 12px",
  background: "#dcfce7",
  color: "#15803d",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
};

// 赤Button
const redButton: React.CSSProperties = {
  padding: "9px 12px",
  background: "#fee2e2",
  color: "#dc2626",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "bold",
};

// ラベル
const labelStyle: React.CSSProperties = {
  marginBottom: "8px",
  fontWeight: "bold",
  color: "#5b21b6",
  fontSize: "14px",
};

// Status
const statusBadge: React.CSSProperties = {
  borderRadius: "999px",
  padding: "5px 9px",
  fontSize: "11px",
  fontWeight: "bold",
  whiteSpace: "nowrap",
};

// Task
const taskItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  border:
    "1px solid #ede9fe",
  borderRadius: "14px",
  padding: "12px 14px",
  minWidth: 0,
  boxSizing: "border-box",
  background: "#fff",
};

const taskMetaText: React.CSSProperties = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "bold",
};

// メモアイテム
const memoItem: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "12px",
  padding: "14px",
  border:
    "1px solid #e2e8f0",
  borderRadius: "14px",
  background: "#fff",
};

// スケジュール
const scheduleItem: React.CSSProperties = {
  padding: "14px",
  borderLeft:
    "4px solid #6366f1",
  background: "#f8fafc",
  borderRadius: "12px",
  marginBottom: "12px",
};

// Empty
const emptyText: React.CSSProperties = {
  color: "#94a3b8",
  fontSize: "14px",
  padding: "14px",
  border:
    "1px dashed #cbd5e1",
  borderRadius: "12px",
  background: "#f8fafc",
};
