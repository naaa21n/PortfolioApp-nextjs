// LarningSection.tsx

"use client";

import { useEffect, useState } from "react";

// 共通Layout
import Layout from "./layout/Layout";

export default function LearningSection() {

  // =========================
  // 学習データ
  // =========================

  const [learnings, setLearnings] =
    useState<any[]>([]);

  // =========================
  // 読書データ
  // =========================

  const [books, setBooks] =
    useState([
      {
        id: 1,
        title: "7つの習慣",
        time: "120分",
        image:
          "https://placehold.co/60x80",
      },
      {
        id: 2,
        title: "エッセンシャル思考",
        time: "90分",
        image:
          "https://placehold.co/60x80",
      },
      {
        id: 3,
        title: "影響力の武器",
        time: "60分",
        image:
          "https://placehold.co/60x80",
      },
      {
        id: 4,
        title: "THINK AGAIN",
        time: "45分",
        image:
          "https://placehold.co/60x80",
      },
    ]);

  useEffect(() => {
    loadLearnings();
  }, []);

  // =========================
  // 学習一覧取得
  // =========================

  const loadLearnings = async () => {

    try {

      const res = await fetch(
        "http://localhost:8080/api/learnings"
      );

      const data = await res.json();

      setLearnings(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // 学習追加
  // =========================

  const addLearning = async () => {

    try {

      await fetch(
        "http://localhost:8080/api/learnings",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            id: String(Date.now()),
            title: "React学習",
            studyHours: 2,
            studyDate: "2025/06/20",
          }),
        }
      );

      loadLearnings();

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // 学習削除
  // =========================

  const deleteLearning = async (
    id: string
  ) => {

    try {

      await fetch(
        "http://localhost:8080/api/learnings/" + id,
        {
          method: "DELETE",
        }
      );

      loadLearnings();

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // 読書削除
  // =========================

  const deleteBook = (
    id: number
  ) => {

    setBooks(
      books.filter(
        (book) =>
          book.id !== id
      )
    );
  };

  return (

    <Layout currentPage="学習と読書の記録">

      <div
        style={{
          padding: "40px", // 少し余裕を持たせる
          maxWidth: "1400px", // 画面が広がりすぎないように制限
          background:
            "linear-gradient(135deg,#f5f3ff 0%,#eef2ff 100%)",
          margin: "0 auto",
          fontFamily: "'Inter', 'Noto Sans JP', sans-serif",
        }}
      >

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "26px",
          }}
        >

          <h1
            style={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#1e1b4b",
            }}
          >
            📚 学習と読書の記録
          </h1>

          {/* streak */}
          <div
            style={{
              background: "#fff",
              borderRadius: "28px",
              padding: "24px 34px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >

            <div
              style={{
                color: "#64748b",
                fontSize: "14px",
              }}
            >
              連続継続
            </div>

            <div
              style={{
                fontSize: "42px",
                fontWeight: "bold",
                color: "#ef4444",
              }}
            >
              🔥 0日
            </div>

          </div>

        </div>

        {/* =========================
            TOP
        ========================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "24px",
            marginBottom: "24px",
          }}
        >

          {/* グラフ */}
          <div
            style={{
              background: "#fff",
              borderRadius: "30px",
              padding: "30px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "24px",
              }}
            >

              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                学習時間の記録
              </h2>

              <button
                onClick={addLearning}
                style={{
                  border: "none",
                  background:
                    "linear-gradient(to right,#8b5cf6,#6366f1)",
                  color: "#fff",
                  padding:
                    "14px 22px",
                  borderRadius:
                    "16px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                ＋ 記録を追加
              </button>

            </div>

            {/* Graph */}
            <div
              style={{
                height: "300px",
                display: "flex",
                alignItems: "flex-end",
                gap: "26px",
              }}
            >

              {[4, 6, 2, 7, 5].map(
                (h, i) => (

                  <div
                    key={i}
                    style={{
                      flex: 1,
                    }}
                  >

                    <div
                      style={{
                        height: `${h * 35}px`,
                        borderRadius:
                          "20px 20px 0 0",
                        background:
                          "linear-gradient(to top,#22d3ee,#8b5cf6)",
                      }}
                    />

                    <div
                      style={{
                        textAlign:
                          "center",
                        marginTop: "10px",
                        color: "#64748b",
                      }}
                    >
                      6/{16 + i}
                    </div>

                  </div>

                )
              )}

            </div>

          </div>

          {/* 学習履歴 */}
          <div
            style={{
              background: "#fff",
              borderRadius: "30px",
              padding: "26px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >

            <h2
              style={{
                fontSize: "24px",
                fontWeight: "bold",
                marginBottom: "20px",
              }}
            >
              学習履歴
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >

              {learnings.map(
                (item: any) => (

                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                      padding:
                        "16px 18px",
                      border:
                        "1px solid #ede9fe",
                      borderRadius:
                        "18px",
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontWeight:
                            "bold",
                        }}
                      >
                        {item.studyDate}
                      </div>

                      <div
                        style={{
                          color: "#6366f1",
                          fontWeight:
                            "bold",
                        }}
                      >
                        {item.studyHours}
                        時間
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        deleteLearning(
                          item.id
                        )
                      }
                      style={{
                        border: "none",
                        background:
                          "#fee2e2",
                        color: "#dc2626",
                        borderRadius:
                          "12px",
                        padding:
                          "10px 14px",
                        cursor:
                          "pointer",
                      }}
                    >
                      削除
                    </button>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

        {/* =========================
            BOTTOM
        ========================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "24px",
          }}
        >

          {/* カレンダー */}
          <div
            style={{
              background: "#fff",
              borderRadius: "30px",
              padding: "30px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >

            <h2
              style={{
                fontSize: "30px",
                fontWeight: "bold",
                marginBottom: "24px",
              }}
            >
              カレンダー
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7,1fr)",
                gap: "12px",
              }}
            >

              {Array.from({
                length: 35,
              }).map((_, i) => (

                <div
                  key={i}
                  style={{
                    aspectRatio: "1",
                    borderRadius: "16px",
                    background:
                      "#f8fafc",
                  }}
                />

              ))}

            </div>

          </div>

          {/* 読書記録 */}
          <div
            style={{
              background: "#fff",
              borderRadius: "30px",
              padding: "30px",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.05)",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "24px",
              }}
            >

              <h2
                style={{
                  fontSize: "30px",
                  fontWeight: "bold",
                }}
              >
                読書記録
              </h2>

              <button
                style={{
                  border: "none",
                  background:
                    "linear-gradient(to right,#8b5cf6,#6366f1)",
                  color: "#fff",
                  padding:
                    "14px 20px",
                  borderRadius:
                    "16px",
                  fontWeight: "bold",
                }}
              >
                ＋ 読書を追加
              </button>

            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >

              {books.map((book) => (

                <div
                  key={book.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    border:
                      "1px solid #ede9fe",
                    borderRadius:
                      "18px",
                    padding: "18px",
                  }}
                >

                  <div
                    style={{
                      display: "flex",
                      gap: "16px",
                      alignItems:
                        "center",
                    }}
                  >

                    <img
                      src={book.image}
                      alt={book.title}
                      style={{
                        width: "60px",
                        height: "80px",
                        borderRadius:
                          "10px",
                        objectFit:
                          "cover",
                      }}
                    />

                    <div>

                      <div
                        style={{
                          fontWeight:
                            "bold",
                          marginBottom:
                            "6px",
                        }}
                      >
                        {book.title}
                      </div>

                      <div
                        style={{
                          color: "#6366f1",
                        }}
                      >
                        読書時間 :
                        {" "}
                        {book.time}
                      </div>

                    </div>

                  </div>

                  <button
                    onClick={() =>
                      deleteBook(
                        book.id
                      )
                    }
                    style={{
                      border: "none",
                      background:
                        "#fee2e2",
                      color: "#dc2626",
                      borderRadius:
                        "12px",
                      padding:
                        "10px 14px",
                      cursor:
                        "pointer",
                    }}
                  >
                    削除
                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </Layout>
  );
}