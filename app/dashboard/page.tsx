// =========================
// Layout Import
// =========================
//
// 共通レイアウト
//
// ・サイドバー
// ・背景
// ・ページ共通UI
import Layout from "../components/layout/Layout";

// =========================
// Dashboard Card Import
// =========================
//
// ダッシュボード用カード
//
// ・タイトル
// ・説明
// ・リンク
// ・絵文字
import DashboardCard
from "../components/DashboardCard";

// =========================
// Dashboard Page
// =========================
//
// ダッシュボード画面
//
// ・各機能への入口
// ・カード一覧表示
export default function DashboardPage() {

  return (

    // =========================
    // Layout
    // =========================
    //
    // currentPage:
    // Sidebarの現在ページ判定
    <Layout currentPage="ダッシュボード">

      {/* =========================
          Page Title
      ========================= */}
      <h1
        style={{

          // タイトル文字サイズ
          fontSize: "42px",

          // 下余白
          marginBottom: "40px",
        }}
      >
        ダッシュボード
      </h1>

      {/* =========================
          Card Grid
      ========================= */}
      <div
        style={{

          // グリッド表示
          display: "grid",

          // 3列
          gridTemplateColumns:
            "1fr 1fr 1fr",

          // カード間余白
          gap: "24px",
        }}
      >

        {/* =========================
            Task Card
        ========================= */}
        <DashboardCard

          // カードタイトル
          title="タスクとメモ帳"

          // 説明文
          description="タスク追加・完了管理"

          // 遷移先
          href="/tasks"

          // アイコン
          emoji="📝"
        />

        {/* =========================
            Learning Card
        ========================= */}
        <DashboardCard

          title="学習と読書の記録"

          description="勉強時間・記録"

          href="/learnings"

          emoji="📚"
        />

        {/* =========================
            Health Card
        ========================= */}
        <DashboardCard

          title="健康と日記"

          description="歩数・健康記録"

          href="/health"

          emoji="🏃"
        />

      </div>

    </Layout>
  );
}