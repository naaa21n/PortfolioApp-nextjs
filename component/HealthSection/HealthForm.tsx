"use client";

import {
  useEffect,
  useState,
} from "react";

import { apiFetch } from "../lib/api";
import { Health } from "../types/health";

// =========================
// Props
// =========================
//
// 親コンポーネントから受け取る値
//
type Props = {
  // 選択中の日付
  //
  // 例:
  // "2026-06-13"
  selectedDate: string;

  // 選択中の日付に対応する健康記録
  //
  // 既存データがある場合:
  // Health
  //
  // 既存データがない場合:
  // null / undefined
  selectedHealth?: Health | null;

  // 保存後に親コンポーネント側で
  // 健康記録一覧を再取得するための関数
  onSaved: () => void;
};

// =========================
// HealthForm Component
// =========================
//
// 健康記録入力フォーム
//
// 保存先:
// POST /api/health/records
//
// 更新先:
// PUT /api/health/records/{id}
//
export default function HealthForm({
  selectedDate,
  selectedHealth,
  onSaved,
}: Props) {
  // =========================
  // State
  // =========================
  //
  // 各入力値を管理する
  //

  // 歩数
  const [steps, setSteps] = useState(
    selectedHealth?.steps || 0
  );

  // 運動時間
  const [
    exerciseMinutes,
    setExerciseMinutes,
  ] = useState(
    selectedHealth?.exerciseMinutes || 0
  );

  // 睡眠時間
  const [sleepHours, setSleepHours] =
    useState(
      selectedHealth?.sleepHours || 0
    );

  // 水分摂取量
  const [waterMl, setWaterMl] =
    useState(
      selectedHealth?.waterMl || 0
    );

  // =========================
  // selectedHealth変更時の反映
  // =========================
  //
  // カレンダーなどで日付を切り替えたときに、
  // その日の既存データをフォームへ反映する
  //
  // selectedHealth が null の場合は、
  // 新規入力として0に戻す
  //
  useEffect(() => {
    setSteps(
      selectedHealth?.steps || 0
    );

    setExerciseMinutes(
      selectedHealth?.exerciseMinutes || 0
    );

    setSleepHours(
      selectedHealth?.sleepHours || 0
    );

    setWaterMl(
      selectedHealth?.waterMl || 0
    );
  }, [selectedHealth, selectedDate]);

  // =========================
  // 保存処理
  // =========================
  //
  // selectedHealth がある場合:
  // 既存データ更新 PUT
  //
  // selectedHealth がない場合:
  // 新規登録 POST
  //
  const saveHealth = async () => {
    console.log("健康記録 保存クリック");

    // =========================
    // Spring Bootへ送るJSON
    // =========================
    //
    // 注意:
    // id は送らない
    //
    // 理由:
    // Spring Boot側で UUID が自動生成されるため
    //
    // 注意:
    // date ではなく recordDate にする
    //
    // 理由:
    // HealthRecord Entity側のフィールド名が
    // recordDate だから
    //
    const body = {
      // 健康記録日
      //
      // Spring側:
      // private LocalDate recordDate;
      recordDate: selectedDate,

      // 歩数
      //
      // Spring側:
      // private Integer steps;
      steps: Number(steps),

      // 運動時間
      //
      // Spring側:
      // private Integer exerciseMinutes;
      exerciseMinutes: Number(exerciseMinutes),

      // 睡眠時間
      //
      // Spring側:
      // private Double sleepHours;
      sleepHours: Number(sleepHours),

      // 水分摂取量
      //
      // Spring側:
      // private Integer waterMl;
      waterMl: Number(waterMl),
    };

    console.log("Health POST/PUT body:", body);

    // =========================
    // POST / PUT 切り替え
    // =========================
    //
    // selectedHealth がある場合は更新
    // selectedHealth がない場合は新規作成
    //
    const method = selectedHealth
      ? "PUT"
      : "POST";

    const path = selectedHealth
      ? `/api/health/records/${selectedHealth.id}`
      : "/api/health/records";

    // =========================
    // API呼び出し
    // =========================
    //
    // apiFetch側で res.json() まで行う設計なら、
    // response には保存後のHealthRecord JSONが入る
    //
    const response = await apiFetch(path, {
      method,
      body: JSON.stringify(body),
    });

    console.log(
      "Health Save Response:",
      response
    );

    // =========================
    // 保存後の再読み込み
    // =========================
    //
    // 親側で一覧を再取得する
    //
    onSaved();
  };

  // =========================
  // JSX
  // =========================

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "24px",
      }}
    >
      <h3>
        📋 健康記録
      </h3>

      {/* 選択中の日付 */}
      <div
        style={{
          color: "#64748b",
          marginBottom: "20px",
        }}
      >
        {selectedDate}
      </div>

      {/* 歩数 */}
      <div
        style={{
          marginBottom: "12px",
        }}
      >
        <label>
          歩数
        </label>

        <input
          type="number"
          value={steps}
          onChange={(e) =>
            setSteps(
              e.target.value === ""
                ? 0
                : Number(e.target.value)
            )
          }
          style={inputStyle}
        />
      </div>

      {/* 運動時間 */}
      <div
        style={{
          marginBottom: "12px",
        }}
      >
        <label>
          運動時間（分）
        </label>

        <input
          type="number"
          value={exerciseMinutes}
          onChange={(e) =>
            setExerciseMinutes(
              e.target.value === ""
                ? 0
                : Number(e.target.value)
            )
          }
          style={inputStyle}
        />
      </div>

      {/* 睡眠時間 */}
      <div
        style={{
          marginBottom: "12px",
        }}
      >
        <label>
          睡眠時間
        </label>

        <input
          type="number"
          step="0.5"
          value={sleepHours}
          onChange={(e) =>
            setSleepHours(
              e.target.value === ""
                ? 0
                : Number(e.target.value)
            )
          }
          style={inputStyle}
        />
      </div>

      {/* 水分摂取量 */}
      <div
        style={{
          marginBottom: "20px",
        }}
      >
        <label>
          水分摂取量（ml）
        </label>

        <input
          type="number"
          value={waterMl}
          onChange={(e) =>
            setWaterMl(
              e.target.value === ""
                ? 0
                : Number(e.target.value)
            )
          }
          style={inputStyle}
        />
      </div>

      {/* 保存ボタン */}
      <button
        onClick={saveHealth}
        style={{
          width: "100%",
          border: "none",
          borderRadius: "12px",
          padding: "12px",
          background: "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        保存
      </button>
    </div>
  );
}

// =========================
// Input Style
// =========================
//
// 各inputで共通利用するスタイル
//
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginTop: "6px",
};