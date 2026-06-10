"use client";

import {
    useEffect,
    useState,
  } from "react";
import { apiFetch } from "../lib/api";
import { Health } from "../types/health" // 型インポート

/*
type Health = {
  id: string;
  date: string;
  steps: number;
  exerciseMinutes: number;
  sleepHours: number;
  waterMl: number;
};
*/

type Props = {
    selectedDate: string;
    selectedHealth?: Health | null;
    onSaved: () => void;
  };

export default function HealthForm({
  selectedDate,
  selectedHealth,
  onSaved,
}: Props) {

  const [steps, setSteps] =
    useState(
      selectedHealth?.steps || 0
    );

  const [exerciseMinutes,
    setExerciseMinutes] =
    useState(
      selectedHealth?.exerciseMinutes || 0
    );

  const [sleepHours,
    setSleepHours] =
    useState(
      selectedHealth?.sleepHours || 0
    );

  const [waterMl,
    setWaterMl] =
    useState(
      selectedHealth?.waterMl || 0
    );

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
      
      }, [selectedHealth]);

  // =========================
  // 保存
  // =========================

  console.log("保存クリック");

  const saveHealth = async () => {

    const body = {
      id:
        selectedHealth?.id ||
        String(Date.now()),
  
      date: selectedDate,
  
      steps,
      exerciseMinutes,
      sleepHours,
      waterMl,
    };
  
    const method =
      selectedHealth
        ? "PUT"
        : "POST";
    
    const path =
      selectedHealth
        ? `/api/healths/${selectedHealth.id}`
        : "/api/healths";

    const response = await apiFetch(path, {
      method,
      body: JSON.stringify(body),
    });
  
    console.log(
      response.status
    );
  
    onSaved();
  };

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
              Number(
                e.target.value
              )
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
              Number(
                e.target.value
              )
            )
          }
          style={inputStyle}
        />
      </div>

      {/* 睡眠 */}

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
              Number(
                e.target.value
              )
            )
          }
          style={inputStyle}
        />
      </div>

      {/* 水分 */}

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
              Number(
                e.target.value
              )
            )
          }
          style={inputStyle}
        />
      </div>

      <button
        onClick={saveHealth}
        style={{
          width: "100%",
          border: "none",
          borderRadius: "12px",
          padding: "12px",
          background:
            "#2563eb",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        保存
      </button>

    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  marginTop: "6px",
};