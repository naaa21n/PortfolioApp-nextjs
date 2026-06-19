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
// Register Page
// =========================

// 会員登録画面
export default function RegisterPage() {

  // =========================
  // State
  // =========================

  // 名前入力状態
  const [name, setName] = useState("");

  // メールアドレス入力状態
  const [email, setEmail] =
    useState("");

  // パスワード入力状態
  const [password, setPassword] =
    useState("");

  // =========================
  // Register Function
  // =========================

  // 会員登録処理
  const handleRegister = async () => {

    // Spring Boot APIへPOST通信
    const response = await apiFetch(
      "/api/auth/register",
      {

        // HTTP Method
        method: "POST",

        // Header
        //headers: {
        //  "Content-Type": "application/json",
        //},

        // Request Body
        body: JSON.stringify({

          // 一時ID生成
          //
          // 現在はSpring Boot側で
          // 自動生成されるため
          // 本来不要
          //id: String(Date.now()),

          // 名前
          name,

          // メール
          email,

          // パスワード
          password,
        }),
      }
    );

    // JSON取得
    const data = await response.json();

    // 結果表示
    alert(data.message);
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

        // 外側余白
        padding: "20px",
      }}
    >

      {/* Register Card */}
      <div
        style={{

          // 横幅
          width: "100%",

          // 最大幅
          maxWidth: "420px",

          // 背景色
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
          会員登録
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

          {/* Name Input */}
          <input
            type="text"
            placeholder="名前"
            value={name}

            // 入力変更時
            onChange={(e) =>
              setName(e.target.value)
            }

            style={inputStyle}
          />

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

          {/* Register Button */}
          <button
            onClick={handleRegister}
            style={buttonStyle}
          >
            登録する
          </button>

        </div>

        {/* Login Guide */}
        <p
          style={{
            marginTop: "20px",
            textAlign: "center",
          }}
        >
          既にアカウントをお持ちですか？
        </p>

        {/* Login Link */}
        <div
          style={{
            textAlign: "center",
            marginTop: "10px",
          }}
        >

          {/* Login Page */}
          <Link href="/login">
            ログインはこちら
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