"use client";

// =========================
// React Hooks
// =========================
//
// useEffect:
// 初回表示時の処理
//
// useState:
// 状態管理
import { useEffect, useState } from "react";

// =========================
// Layout Import
// =========================
//
// 共通レイアウト
import Layout from "./layout/Layout";

// =========================
// Style Import
// =========================
//
// 共通スタイル
import {
  cardStyle,
  titleStyle,
  inputAreaStyle,
  inputStyle,
  ulStyle,
  listStyle,
  blueButton,
  redButton,
} from "./styles";

// =========================
// Health Section Component
// =========================
//
// 健康管理エリア
//
// ・歩数記録
// ・グラフ表示
// ・一覧表示
// ・削除
export default function HealthSection() {

  // =========================
  // State
  // =========================

  // 健康データ一覧
  const [healths, setHealths] =
    useState<any[]>([]);

  // 入力中の歩数
  const [steps, setSteps] =
    useState("");

  // =========================
  // 初回表示時
  // =========================
  //
  // DBから健康データ取得
  useEffect(() => {

    loadHealths();

  }, []);

  // =========================
  // 健康データ取得
  // =========================
  //
  // Spring Boot APIから一覧取得
  const loadHealths = () => {

    fetch("http://localhost:8080/api/healths")

      .then((res) => res.json())

      // 配列ならState更新
      .then((data) =>
        setHealths(
          Array.isArray(data)
            ? data
            : []
        )
      );
  };

  // =========================
  // 健康データ追加
  // =========================
  //
  // 歩数をDB保存
  const addHealth = () => {

    // 未入力なら終了
    if (!steps) return;

    fetch(
      "http://localhost:8080/api/healths",
      {

        // POST送信
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        // JSONデータ送信
        body: JSON.stringify({

          // 簡易ID生成
          id: String(Date.now()),

          // 例: 5000歩
          title: `${steps}歩`,

          // 初期状態
          done: false,
        }),
      }

    ).then(() => {

      // 再取得
      loadHealths();

      // 入力リセット
      setSteps("");
    });
  };

  // =========================
  // 健康データ削除
  // =========================
  //
  // ID指定削除
  const deleteHealth = (
    id: string
  ) => {

    fetch(
      `http://localhost:8080/api/healths/${id}`,
      {
        method: "DELETE",
      }

    ).then(loadHealths);
  };

  // =========================
  // UI
  // =========================
  return (

    <Layout currentPage="健康と日記">

      {/* =========================
           Header
      ========================= */}

      <div
        style={{
          marginBottom: "32px",
        }}
      >

        {/* タイトル */}
        <h1
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            marginBottom: "12px",
          }}
        >
          🏃 健康管理
        </h1>

        {/* サブタイトル */}
        <div
          style={{
            background: "#f8fafc",
            padding: "16px",
            borderRadius: "16px",
            color: "#475569",
            fontSize: "14px",
            boxShadow:
              "0 4px 10px rgba(0,0,0,0.05)",
          }}
        >
          🌿 毎日の健康習慣が、
          明日の自分をつくる。
        </div>

      </div>

      {/* =========================
           Main Card
      ========================= */}

      <div style={cardStyle}>

        {/* タイトル */}
        <h2 style={titleStyle}>
          📈 歩数記録
        </h2>

        {/* 入力エリア */}
        <div style={inputAreaStyle}>

          {/* 歩数入力 */}
          <input
            value={steps}

            onChange={(e) =>
              setSteps(
                e.target.value
              )
            }

            placeholder="今日の歩数"

            style={inputStyle}
          />

          {/* 記録ボタン */}
          <button
            onClick={addHealth}
            style={blueButton}
          >
            記録
          </button>

        </div>

        {/* =========================
             グラフエリア
        ========================= */}

        <div
          style={{
            position: "relative",
            height: "260px",
            background: "#ffffff",
            border: "1px solid #eef2ff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
            borderRadius: "12px",
            padding: "16px",
          }}
        >

          {/* 棒グラフ */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              height: "100%",
              gap: "10px",
            }}
          >

            {/* データループ */}
            {healths.map(

              (
                health: any,
                index: number
              ) => {

                // "5000歩" → 5000変換
                const value =
                  parseInt(
                    String(
                      health.title
                    ).replace("歩", "")
                  ) || 0;

                return (

                  <div
                    key={health.id}

                    style={{
                      flex: 1,
                      textAlign:
                        "center",
                    }}
                  >

                    {/* 棒 */}
                    <div
                      style={{

                        // 歩数に応じ高さ変更
                        height: `${Math.max(
                          value / 100,
                          20
                        )}px`,

                        background:
                          "linear-gradient(to top,#2563eb,#60a5fa)",

                        borderRadius:
                          "10px 10px 0 0",
                      }}
                    />

                    {/* Day表示 */}
                    <div
                      style={{
                        fontSize: "11px",
                        marginTop: "6px",
                      }}
                    >
                      Day {index + 1}
                    </div>

                  </div>
                );
              }
            )}

          </div>

        </div>

        {/* =========================
             一覧表示
        ========================= */}

        <ul
          style={{
            ...ulStyle,
            marginTop: "20px",
          }}
        >

          {/* データ一覧 */}
          {healths.map((health: any) => (

            <li
              key={health.id}
              style={listStyle}
            >

              {/* 歩数表示 */}
              <span>
                {health.title}
              </span>

              {/* 削除ボタン */}
              <button

                onClick={() =>
                  deleteHealth(
                    health.id
                  )
                }

                style={redButton}
              >
                削除
              </button>

            </li>
          ))}

        </ul>

      </div>

    </Layout>
  );
}