"use client";

// =========================
// Next.js Import
// =========================

// ページ遷移用Link
import Link from "next/link";

// React State管理
import { useState } from "react";
import { apiFetch } from "@/component/lib/api";

// =========================
// Login Page
// =========================

// ログイン画面
export default function LoginPage() {

  // =========================
  // State
  // =========================

  // メールアドレス入力状態
  const [email, setEmail] =
    useState("");

  // パスワード入力状態
  const [password, setPassword] =
    useState("");

  // =========================
  // Login Function
  // =========================

  // ログイン処理
  const handleLogin = async () => {

    // Spring Boot APIへPOST通信
    const response = await apiFetch(
      "/api/auth/login",
      {

        // HTTP Method
        method: "POST",

        // Header
        //headers: {
        //  "Content-Type": "application/json",
        //},

        // JSON Body
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    // レスポンス文字列取得
    const text = await response.text();

    // console確認
    console.log(text);

    try {

      // JSON変換
      const data = JSON.parse(text);

      // メッセージ表示
      alert(data.message);

      // ログイン成功時
      if (data.success) {

        // Dashboardへ遷移
        window.location.href =
          "/dashboard";
      }

    } catch (error) {

      // JSON変換失敗時
      console.error(text);

    }
  };

  // =========================
  // JSX
  // =========================

  return (

    // 全画面Wrapper
    <main
      style={{

        // 画面高さ
        minHeight: "100vh",

        // 背景色
        background: "#0f172a",

        // Flex中央配置
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        // 余白
        padding: "20px",
      }}
    >

      {/* Login Card */}
      <div
        style={{

          // 横幅
          width: "100%",

          // 最大幅
          maxWidth: "420px",

          // 背景
          background: "white",

          // 内側余白
          padding: "40px",

          // 角丸
          borderRadius: "24px",
        }}
      >

        {/* タイトル */}
        <h1
          style={{

            // フォントサイズ
            fontSize: "32px",

            // 下余白
            marginBottom: "30px",

            // 中央寄せ
            textAlign: "center",
          }}
        >
          ログイン
        </h1>

        {/* Input Area */}
        <div
          style={{

            // 縦並び
            display: "flex",
            flexDirection: "column",

            // 要素間余白
            gap: "16px",
          }}
        >

          {/* Email Input */}
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}

            // 入力変更時
            onChange={(e) =>
              setEmail(e.target.value)
            }

            style={inputStyle}
          />

          {/* Password Input */}
          <input
            type="password"
            placeholder="パスワード"
            value={password}

            // 入力変更時
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }

            style={inputStyle}
          />

          {/* Login Button */}
          <button
            onClick={handleLogin}
            style={buttonStyle}
          >
            ログイン
          </button>

        </div>

        {/* Register Guide */}
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          アカウントをお持ちでないですか？
        </p>

        {/* Register Link */}
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >

          {/* Register Page */}
          <Link href="/register">
            会員登録はこちら
          </Link>

        </div>

      </div>

    </main>
  );
}

// =========================
// Style
// =========================

// Input共通Style
const inputStyle: React.CSSProperties = {

  // 内側余白
  padding: "14px",

  // Border
  border: "1px solid #d1d5db",

  // 角丸
  borderRadius: "10px",

  // フォントサイズ
  fontSize: "16px",
};

// Button共通Style
const buttonStyle: React.CSSProperties = {

  // 内側余白
  padding: "14px",

  // 背景色
  background: "#2563eb",

  // 文字色
  color: "white",

  // Borderなし
  border: "none",

  // 角丸
  borderRadius: "10px",

  // フォントサイズ
  fontSize: "16px",

  // カーソル
  cursor: "pointer",
};