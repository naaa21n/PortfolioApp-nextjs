"use client";

import { useEffect, useState } from "react";

import DashboardCard from "./DashboardCard";
import StepCalendar from "./StepCalendar";
import HealthForm from "./HealthForm";
import DiaryList from "./DiaryList";
import ActivityLog from "./ActivityLog";
import BalanceChart from "./BalanceChart";
import JournalSection from "./JournalSection";


export default function HealthSection() {

  // =========================
  // State
  // =========================

  type Health = {
    id: string;
    date: string;
    steps: number;
    exerciseMinutes: number;
    sleepHours: number;
    waterMl: number;
  };

  const [healths, setHealths] =
  useState<Health[]>([]);

  const [activities, setActivities] =
    useState([]);

  const [journals, setJournals] =
    useState([]);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedHealth, setSelectedHealth] =
    useState<Health | null>(null);

    const selectedActivity =
    activities.find(
      (a: any) =>
        a.date === selectedDate
    ) || null;


  // =========================
  // Initial Load
  // =========================

  useEffect(() => {

    loadHealths();
    loadActivities();
    loadJournals();

  }, []);

  // =========================
  // Health API
  // =========================

  const loadHealths = async () => {

    const response =
      await fetch(
        "http://localhost:8080/api/healths"
      );

    const data =
      await response.json();

    setHealths(data);
  };

  // =========================
  // Daily Activity API
  // =========================

  const loadActivities = async () => {

    const response =
      await fetch(
        "http://localhost:8080/api/activities"
      );

    const data =
      await response.json();

    setActivities(data);
  };

  // =========================
  // Journal API
  // =========================

  const loadJournals = async () => {

    const response =
      await fetch(
        "http://localhost:8080/api/journals"
      );

    const data =
      await response.json();

    setJournals(data);
  };

  // =========================
  // 日付選択
  // =========================

  const selectDate = (date: string) => {

    setSelectedDate(date);
  
    const health =
      healths.find(
        (h) => h.date === date
      ) || null;
  
    setSelectedHealth(health);
  };

    
  return (
  
      <div
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(135deg,#f5f3ff 0%,#eef2ff 100%)",
          padding: "20px",
          fontFamily:
            "'Inter','Noto Sans JP',sans-serif",
        }}
      >
  
        {/* Header */}
  
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
  
          <div>
  
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#1e1b4b",
                marginBottom: "8px",
              }}
            >
              ❤️ 健康と日記
            </h1>
  
            <p
              style={{
                color: "#64748b",
                fontSize: "16px",
              }}
            >
              毎日の健康習慣を記録して、
              理想の自分に近づこう。
            </p>
  
          </div>
  
        </div>
  
        {/* 上部カード */}
  
        <DashboardCard
          healths={healths}
        />
  
        {/* カレンダー＋フォーム */}
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
  
          <StepCalendar
            healths={healths}
            selectedDate={selectedDate}
            onDateSelect={selectDate}
          />
  
          <HealthForm
            selectedDate={selectedDate}
            selectedHealth={selectedHealth}
            onSaved={loadHealths}
          />
  
        </div>
  
        {/* 円グラフ＋行動ログ */}
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
  
          <BalanceChart
            activity={selectedActivity}
          />
  
          <ActivityLog
            selectedDate={selectedDate}
            selectedActivity={selectedActivity}
            reloadActivities={loadActivities}
          />
  
        </div>
  
        {/* 日記＋ジャーナル */}
  
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
            marginTop: "20px",
          }}
        >
  
          <DiaryList />
  
          <JournalSection />
  
        </div>
  
      </div>
  );

}