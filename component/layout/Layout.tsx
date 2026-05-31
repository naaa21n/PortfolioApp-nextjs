"use client";

// =========================
// Sidebar Import
// =========================
import Sidebar from "./Sidebar";

// =========================
// Layout Component
// =========================
export default function Layout({
  children,
  currentPage,
}: {
  children: React.ReactNode;
  currentPage: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",

        background:
          "linear-gradient(135deg,#f8fafc 0%,#eef2ff 100%)",

        padding: "20px",
        gap: "24px",

        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* =========================
          背景装飾①
      ========================= */}
      <div
        style={{
          position: "absolute",
          top: "-120px",
          right: "-120px",

          width: "320px",
          height: "320px",

          borderRadius: "9999px",

          background: "#c4b5fd",

          filter: "blur(120px)",

          opacity: 0.4,

          pointerEvents: "none",
        }}
      />

      {/* =========================
          背景装飾②
      ========================= */}
      <div
        style={{
          position: "absolute",
          bottom: "-120px",
          left: "-120px",

          width: "280px",
          height: "280px",

          borderRadius: "9999px",

          background: "#93c5fd",

          filter: "blur(120px)",

          opacity: 0.3,

          pointerEvents: "none",
        }}
      />

      {/* =========================
          Sidebar
      ========================= */}
      <Sidebar currentPage={currentPage} />

      {/* =========================
          Main Content
      ========================= */}
      <main
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}