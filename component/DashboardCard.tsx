"use client";

import Link from "next/link";

// =========================
// Dashboard Card
// =========================
//
// ダッシュボード用カード
//
// props:
// title
// description
// href
// emoji
export default function DashboardCard({

  title,
  description,
  href,
  emoji,

}: {

  title: string;
  description: string;
  href: string;
  emoji: string;

}) {

  return (

    <Link
      href={href}

      style={{
        textDecoration: "none",
      }}
    >

      <div
        style={{
          background: "white",
          borderRadius: "20px",
          padding: "30px",
          boxShadow:
            "0 8px 20px rgba(0,0,0,0.1)",

          transition: "0.2s",
          cursor: "pointer",
        }}
      >

        {/* Emoji */}
        <div
          style={{
            fontSize: "48px",
            marginBottom: "20px",
          }}
        >
          {emoji}
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: "24px",
            color: "#111827",
            marginBottom: "10px",
          }}
        >
          {title}
        </h2>

        {/* Description */}
        <p
          style={{
            color: "#6b7280",
          }}
        >
          {description}
        </p>

      </div>

    </Link>
  );
}