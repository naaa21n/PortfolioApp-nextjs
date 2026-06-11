"use client";

// =========================
// Import
// =========================

// 共通レイアウト
//
// Sidebar込み画面
import Layout from "./layout/Layout";

// =========================
// Tasks Page
// =========================
//
// タスク管理画面
export default function TasksPage() {

  return (

    // =========================
    // Layout
    // =========================
    //
    // Sidebar + Main画面
    <Layout currentPage="タスクとメモ帳">

      {/* =========================
           Page Title Area
      ========================= */}
      <div
        style={{
          padding: "40px", // 少し余裕を持たせる
          maxWidth: "1400px", // 画面が広がりすぎないように制限
          background:
            "linear-gradient(135deg,#f5f3ff 0%,#eef2ff 100%)",
          margin: "0 auto",
          fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
        }}
      >

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "26px",
          }}
        >
          <div>
            {/* タイトル */}
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1e1b4b",
              }}
            >
              📝 タスクとメモ帳
            </h1>

            {/* サブメッセージ */}
            <p
              style={{
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              ⭐ 小さな一歩の積み重ねが、
              大きな未来をつくる。
            </p>
          </div>
        </div>

      {/* =========================
           Top Summary Cards
      ========================= */}
      <div
        style={{
          // 横4列
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          padding: "24px 34px",
          gap: "20px",
          marginBottom: "32px",
        }}
      >

        {/* =========================
             今日のタスク
        ========================= */}
        <div style={summaryCard}>

          {/* Emoji */}
          <div style={emojiStyle}>
            ✅
          </div>

          {/* Text */}
          <div>

            {/* 小タイトル */}
            <div style={smallText}>
              今日のタスク
            </div>

            {/* 大きい数値 */}
            <div style={bigText}>
              3 / 8件
            </div>

          </div>
        </div>

        {/* =========================
             今週の達成率
        ========================= */}
        <div style={summaryCard}>

          <div style={emojiStyle}>
            📅
          </div>

          <div>

            <div style={smallText}>
              今週の達成率
            </div>

            <div style={bigText}>
              72%
            </div>

          </div>
        </div>

        {/* =========================
             連続記録
        ========================= */}
        <div style={summaryCard}>

          <div style={emojiStyle}>
            🔥
          </div>

          <div>

            <div style={smallText}>
              連続記録
            </div>

            <div style={bigText}>
              12日
            </div>

          </div>
        </div>

        {/* =========================
             総完了数
        ========================= */}
        <div style={summaryCard}>

          <div style={emojiStyle}>
            ⭐
          </div>

          <div>

            <div style={smallText}>
              総タスク完了数
            </div>

            <div style={bigText}>
              128件
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
            fontSize: "28px",
            marginBottom: "24px",
            color: "#64748b",
          }}
        >
          ✏️ タスクを追加
        </h2>

        {/* =========================
             Task Input Row
        ========================= */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
          }}
        >

          {/* 日付入力 */}
          <input
            type="date"
            style={inputStyle}
          />

          {/* タスク入力 */}
          <input
            placeholder="タスクを入力..."
            style={{
              ...inputStyle,
              // 横幅最大
              flex: 1,
            }}
          />

          {/* 完了ボタン */}
          <button
            style={greenButton}
          >
            完了
          </button>

          {/* 削除ボタン */}
          <button
            style={redButton}
          >
            削除
          </button>

        </div>

        {/* =========================
             Memo Area
        ========================= */}
        <div
          style={{
            // 左右分割
            display: "grid",
            gridTemplateColumns:
              "1fr 2fr",
            gap: "20px",
            marginTop: "30px",
          }}
        >

          {/* =========================
               Deadline
          ========================= */}
          <div>

            {/* ラベル */}
            <div style={labelStyle}>
              期限
            </div>

            {/* 日付入力 */}
            <input
              type="date"
              style={inputStyle}
            />

          </div>

          {/* =========================
               Memo
          ========================= */}
          <div>

            {/* ラベル */}
            <div style={labelStyle}>
              内容
            </div>

            {/* メモ入力 */}
            <textarea
              placeholder="タスク内容を入力..."
              style={{
                width: "100%",
                height: "140px",
                border:
                  "1px solid #dbe2ea",
                borderRadius: "14px",
                padding: "16px",
                resize: "none",
                fontSize: "15px",
              }}
            />

          </div>

        </div>

        {/* =========================
             Add Button Area
        ========================= */}
        <div
          style={{
            marginTop: "24px",
            display: "flex",
            justifyContent:
              "flex-end",
          }}
        >

          {/* 追加ボタン */}
          <button
            style={blueButton}
          >
            ➕ 追加する
          </button>

        </div>

      </div>

      {/* =========================
           Bottom Area
      ========================= */}
      <div
        style={{
          // 左右2カラム
          display: "grid",
          gridTemplateColumns:
            "2fr 1fr",
          gap: "24px",
          marginTop: "30px",
        }}
      >

        {/* =========================
             Memo Area
        ========================= */}
        <div style={mainCard}>

          {/* Header */}
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "24px",
            }}
          >

            {/* タイトル */}
            <h2
              style={{
                color: "#64748b",
                fontSize: "28px",
              }}
            >
              📒 メモ帳
            </h2>

            {/* 新規ボタン */}
            <button
              style={miniButton}
            >
              ＋ 新しいメモ
            </button>

          </div>

          {/* メモ一覧 */}
          <div style={memoItem}>
            💡 アイデア :
            新しいプロジェクトについて
          </div>

          <div style={memoItem}>
            📚 読書メモ :
            嫌われる勇気
          </div>

          <div style={memoItem}>
            🛒 買い物リスト
          </div>

        </div>

        {/* =========================
             Schedule Area
        ========================= */}
        <div style={mainCard}>

          {/* タイトル */}
          <h2
            style={{
              color: "#64748b",
              fontSize: "28px",
              marginBottom: "24px",
            }}
          >
            📅 今日の予定
          </h2>

          {/* スケジュール */}
          <div style={scheduleItem}>
            09:00 朝勉強
          </div>

          <div style={scheduleItem}>
            13:00 ジム
          </div>

          <div style={scheduleItem}>
            19:00 読書
          </div>

        </div>
      </div>
      </div>

    </Layout>
  );
}

/* =========================
   Styles
========================= */

// メインカード
//
// 白背景 + 角丸 + 影
const mainCard = {
  background: "white",
  borderRadius: "24px",
  padding: "32px",
  boxShadow:
    "0 8px 24px rgba(0,0,0,0.08)",
};

// 上部サマリーカード
const summaryCard = {
  background: "white",
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: "18px",
  boxShadow:
    "0 6px 20px rgba(0,0,0,0.06)",
};

// Emoji
const emojiStyle = {
  fontSize: "34px",
};

// 小文字
const smallText = {
  fontSize: "14px",
  color: "#64748b",
};

// 大文字
const bigText = {
  fontSize: "34px",
  fontWeight: "bold",
};

// Input
const inputStyle = {
  padding: "14px",
  border:
    "1px solid #dbe2ea",
  borderRadius: "14px",
  fontSize: "15px",
};

// 青Button
const blueButton = {
  padding: "14px 24px",
  background: "#4f46e5",
  color: "white",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "15px",
};

// 緑Button
const greenButton = {
  padding: "14px 20px",
  background: "#d1fae5",
  color: "#047857",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
};

// 赤Button
const redButton = {
  padding: "14px 20px",
  background: "#fee2e2",
  color: "#dc2626",
  border: "none",
  borderRadius: "14px",
  cursor: "pointer",
};

// ラベル
const labelStyle = {
  marginBottom: "10px",
  fontWeight: "bold",
};

// 小ボタン
const miniButton = {
  padding: "10px 16px",
  background: "#ede9fe",
  border: "none",
  borderRadius: "12px",
  color: "#6d28d9",
  cursor: "pointer",
};

// メモアイテム
const memoItem = {
  padding: "18px",
  border:
    "1px solid #e2e8f0",
  borderRadius: "14px",
  marginBottom: "14px",
};

// スケジュール
const scheduleItem = {
  padding: "18px",
  borderLeft:
    "4px solid #6366f1",
  background: "#f8fafc",
  borderRadius: "10px",
  marginBottom: "16px",
};