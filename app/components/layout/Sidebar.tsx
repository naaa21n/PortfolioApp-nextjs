"use client";

// =========================
// Link Import
// =========================
//
// Next.js の画面遷移用
//
// <a>タグではなく
// Linkを使うことで
// 高速ページ遷移できる
import Link from "next/link";

// =========================
// Sidebar Component
// =========================
//
// 共通サイドバー
//
// ・メニュー表示
// ・現在ページ色変更
// ・画面遷移
//
export default function Sidebar({
  currentPage,
}: {
  // 現在開いているページ名
  currentPage: string;
}) {

  // =========================
  // Menu Data
  // =========================
  //
  // サイドバーメニュー一覧
  const menus = [
    {
      title: "ダッシュボード",
      href: "/dashboard",
      emoji: "🏠",
    },
    {
      title: "タスクとメモ帳",
      href: "/tasks",
      emoji: "📝",
    },
    {
      title: "学習と読書の記録",
      href: "/learnings",
      emoji: "📚",
    },
    {
      title: "健康と日記",
      href: "/health",
      emoji: "🏃",
    },
  ];

  // =========================
  // UI
  // =========================
  return (

    // Sidebar本体
    <div
      style={{

        // 横幅固定
        width: "260px",

        // 背景色
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)",

        // 角丸
        borderRadius: "32px",

        // 内側余白
        padding: "30px 24px",

      }}
    >

      {/* =========================
          Logo
      ========================= */}
      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginBottom: "40px",
          color: "#7c3aed",
        }}
      >
        習慣の民
      </div>

      {/* =========================
          Menu Area
      ========================= */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >

        {/* メニュー一覧ループ */}
        {menus.map((item) => (

          // =========================
          // Link
          // =========================
          //
          // ページ遷移
          <Link
            key={item.title}

            href={item.href}

            style={{
              textDecoration: "none",
            }}
          >

            {/* =========================
                Menu Item
            ========================= */}
            <div
              style={{

                // 内側余白
                padding: "16px 18px",

                // 角丸
                borderRadius: "18px",

                // =========================
                // 現在ページ背景色変更
                // =========================
                background:
                  currentPage === item.title
                    ? "#f3f0ff"
                    : "transparent",

                // =========================
                // 現在ページ文字色変更
                // =========================
                color:
                  currentPage === item.title
                    ? "#7c3aed"
                    : "#334155",

                // =========================
                // 現在ページ太字
                // =========================
                fontWeight:
                  currentPage === item.title
                    ? "bold"
                    : "normal",

                // マウスカーソル
                cursor: "pointer",
              }}
            >

              {/* 絵文字 + タイトル */}
              {item.emoji} {item.title}

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}