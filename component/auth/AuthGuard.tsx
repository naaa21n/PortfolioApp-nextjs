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
          // 表示用に残しているlocalStorageも消してからログイン画面へ戻します。
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

        // セッション確認APIから返ったユーザー情報を、画面表示用localStorageへ同期します。
        // JWT本体はHttpOnly Cookieにあるため、ここでは保存しません。
        saveAuthSession(data, data.user?.email || "");
        setIsChecking(false);
      } catch (error) {
        // 通信エラーなどで確認できない場合も、安全側に倒してログイン画面へ戻します。
        console.error("Auth Check Error", error);
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
          fontWeight: "bold",
        }}
      >
        ログイン情報を確認しています...
      </main>
    );
  }

  return children;
}
