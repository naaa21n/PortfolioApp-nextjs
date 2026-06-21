"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  clearAuthSession,
  saveAuthSession,
} from "../lib/auth";

// このファイルは、ログイン済みユーザーだけにページを表示するクライアントコンポーネントです。
// 初回表示時にNext.jsのセッション確認APIを呼び、未ログインならログイン画面へ移動します。

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();

  const [isChecking, setIsChecking] =
    useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        // HttpOnly CookieはクライアントJavaScriptから直接読めません。
        // そのため、Route Handlerに問い合わせてサーバー側でJWTの有無を確認します。
        const response = await fetch(
          "/api/auth/session"
        );

        if (!response.ok) {
          // セッションAPIが401などを返した場合は、認証情報が無効と判断します。
          clearAuthSession();
          router.replace("/login");
          return;
        }

        const data = await response.json();

        if (!data.authenticated) {
          clearAuthSession();
          router.replace("/login");
          return;
        }

        // セッション確認APIから返ったユーザー情報を、
        // 画面表示用localStorageへ同期します。
        // JWT本体はHttpOnly Cookieにあるため、ここでは保存しません。
        saveAuthSession(
          data,
          data.user?.email || ""
        );

        setIsChecking(false);
      } catch (error) {
        // 通信エラーなどで確認できない場合も、
        // 安全側に倒してログイン画面へ戻します。
        console.error(
          "Auth Check Error",
          error
        );

        clearAuthSession();
        router.replace("/login");
      }
    };

    checkSession();
  }, [router]);

  if (isChecking) {
    // 認証確認が終わるまでは、保護ページの中身を描画しません。
    // 未ログイン時に一瞬だけ保護ページが見える状態を防ぎます。
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg,#f5f3ff 0%,#eef2ff 100%)",
          color: "#1e1b4b",
        }}
      >
        <div
          role="status"
          aria-live="polite"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            padding: "28px 36px",
            textAlign: "center",
          }}
        >
          {/* 大きいローディングアイコン */}
          <div
            className="auth-spinner"
            aria-hidden="true"
          />

          {/* メインメッセージ */}
          <p
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            ログイン情報を確認しています...
          </p>

          {/* 補足メッセージ */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              color: "#6366f1",
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {/* 文言横の小さいローディングアイコン */}
            {/*
            <span
              className="auth-spinner-small"
              aria-hidden="true"
            />
            */}
            <span>
              1〜2分かかる場合があるため、このままお待ちください
            </span>
          </div>
        </div>

        {/* ローディングアイコンの回転アニメーション */}
        <style jsx>{`
          .auth-spinner {
            width: 42px;
            height: 42px;
            border: 4px solid
              rgba(99, 102, 241, 0.2);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: auth-spin 0.8s
              linear infinite;
          }

          .auth-spinner-small {
            width: 16px;
            height: 16px;
            border: 2px solid
              rgba(99, 102, 241, 0.2);
            border-top-color: #6366f1;
            border-radius: 50%;
            animation: auth-spin 0.8s
              linear infinite;
            flex-shrink: 0;
          }

          @keyframes auth-spin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          @media (
            prefers-reduced-motion: reduce
          ) {
            .auth-spinner,
            .auth-spinner-small {
              animation-duration: 1.8s;
            }
          }
        `}</style>
      </main>
    );
  }

  return children;
}