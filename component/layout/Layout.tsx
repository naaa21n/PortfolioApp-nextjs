"use client";

import React from "react";
import Sidebar from "./Sidebar"; // 先ほど作成したSidebarのパスに合わせてください
import AuthGuard from "../auth/AuthGuard";

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
}

export default function Layout({ children, currentPage }: LayoutProps) {
  return (
    <AuthGuard>
      {/* 画面全体をFlexコンテナにし、背景色をベースに設定 */}
      <div className="flex min-h-screen bg-[#F0F2F9] font-sans">
      
      {/* 左側：固定サイドバー */}
      <Sidebar currentPage={currentPage} />

      {/* 右側：メインコンテンツエリア */}
      <main
      style={{
        flex: 1,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg,#f5f3ff 0%,#eef2ff 100%)",
      }}
      className="flex-1 h-screen overflow-y-auto"
      >
        {children}
      </main>
      
      </div>
    </AuthGuard>
  );
}
