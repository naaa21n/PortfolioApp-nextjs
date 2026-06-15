"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  SlidersHorizontal, 
  BookOpen, 
  Heart, 
  Settings,
  LogOut,
} from "lucide-react";
import {
  clearAuthSession,
  getAuthSession,
} from "../lib/auth";

const navItems = [
  { label: "タスクとメモ帳", href: "/tasks", icon: SlidersHorizontal },
  { label: "学習と読書の記録", href: "/learnings", icon: BookOpen },
  { label: "健康と日記", href: "/health", icon: Heart },
  //{ label: "カレンダー", href: "/calendar", icon: Calendar },
  //{ label: "統計・レポート", href: "/analytics", icon: BarChart3 },
];

type SidebarProps = {
  currentPage: string;
};

export default function Sidebar({
  currentPage,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const session = getAuthSession();
  const userName =
    session?.user.name ||
    session?.user.email ||
    "ログイン中";
  const userInitial =
    userName.trim().charAt(0).toUpperCase() || "U";

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("Logout Error", error);
    }

    clearAuthSession();
    router.replace("/login");
  };

  return (
    <aside aria-label={`${currentPage} サイドバー`} style={{
      width: "260px",
      height: "100vh",
      backgroundColor: "#F9F9FE",
      borderRight: "1px solid #EBEBF5",
      display: "flex",
      flexDirection: "column",
      justifyContent: "between",
      padding: "24px",
      boxSizing: "border-box",
      color: "#1A1C29",
      fontFamily: "sans-serif",
      position: "sticky",
      top: 0,
      left: 0
    }}>
      
      {/* 上部エリア */}
      <div style={{ display: "flex", flexDirection: "column", gap: "32px", flexGrow: 1 }}>
        {/* ロゴ */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 8px" }}>
          <div style={{
            width: "32px",
            height: "32px",
            borderRadius: "12px",
            background: "linear-gradient(to top right, #6366F1, #A855F7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Sparkles style={{ width: "20px", height: "20px", color: "#fff" }} />
          </div>
          <span style={{ fontSize: "20px", fontWeight: 900, letterSpacing: "wider", color: "#1A1C29" }}>
            習慣の民
          </span>
        </div>

        {/* ナビゲーション */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === "/records" && (pathname === "/" || pathname === ""));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "18px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  fontSize: "15px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  backgroundColor: isActive ? "#EEEDFC" : "transparent",
                  color: isActive ? "#5046E5" : "#5C5F79",
                  fontWeight: isActive ? "bold" : "500",
                }}
              >
                <Icon style={{ width: "18px", height: "18px", color: isActive ? "#5046E5" : "#7C7F9B" }} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* 下部エリア */}
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "auto" }}>
        {/* 設定 */}
        <Link
          href="/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "18px",
            padding: "14px 16px",
            borderRadius: "12px",
            fontSize: "15px",
            textDecoration: "none",
            color: "#5C5F79",
            fontWeight: "500",
          }}
        >
          <Settings style={{ width: "18px", height: "18px", color: "#7C7F9B" }} />
          設定
        </Link>

        <hr style={{ border: "none", borderTop: "1px solid #EBEBF5", margin: "4px 0" }} />

        {/* ユーザーカード */}
        <div style={{
          backgroundColor: "#fff",
          border: "1px solid rgba(235, 235, 245, 0.6)",
          borderRadius: "16px",
          padding: "16px",
          boxShadow: "0 4px 20px rgba(240, 240, 250, 0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "44px",
              height: "44px",
              borderRadius: "50%",
              background:
                "linear-gradient(to top right, #6366F1, #A855F7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              fontWeight: "bold",
              color: "#fff",
              border: "2px solid #fff",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
            }}>
              {userInitial}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "13px", fontWeight: "bold", color: "#2A2C3D" }}>{userName}</span>
              <span style={{
                fontSize: "11px",
                fontWeight: "black",
                color: "#7C7F9B",
                backgroundColor: "#F0F0F8",
                padding: "2px 6px",
                borderRadius: "6px",
                marginTop: "2px",
                width: "max-content"
              }}>
                ログイン済み
              </span>
            </div>
          </div>

          {/* ゲージ */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <div style={{ width: "100%", height: "8px", backgroundColor: "#EBEBF5", borderRadius: "9999px", overflow: "hidden" }}>
              <div style={{
                width: "65%",
                height: "100%",
                background: "linear-gradient(to right, #6366F1, #8B5CF6, #A855F7)",
                borderRadius: "9999px"
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", fontWeight: "bold", color: "#9A9DB6" }}>
              <span>次のレベルまで</span>
              <span style={{ color: "#6366F1" }}>あと 320 XP</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "10px 12px",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              background: "#fff",
              color: "#5C5F79",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            <LogOut style={{ width: "16px", height: "16px" }} />
            ログアウト
          </button>
        </div>
      </div>

    </aside>
  );
}
