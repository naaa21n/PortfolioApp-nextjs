"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import type {
  Health,
  Activity,
  Journal,
} from "../types/health"; // 型インポート

import DashboardCard from "./DashboardCard";
import StepCalendar from "./StepCalendar";
import HealthForm from "./HealthForm";
import DiaryList from "./DiaryList";
import ActivityLog from "./ActivityLog";
import BalanceChart from "./BalanceChart";
import JournalSection from "./JournalSection";

import Layout from "../layout/Layout";


export default function HealthSection() {

  // =========================
  // State
  // =========================

  /*
  // 型の定義
  type Health = {
    id: string;
    date: string;
    steps: number;
    exerciseMinutes: number;
    sleepHours: number;
    waterMl: number;
  };

  // 仮の型を定義(修正必要)
  type Activity = {
    id: string;
    date: string;
    sleep: number;
    work: number;
    study: number;
    exercise: number;
    hobby: number;
    other: number;
  };

  // 仮の型を定義(修正必要)
  type Journal = {
    id: string;
    date: string;
    [key: string]: unknown;
  };
  */

  const [healths, setHealths] =
  useState<Health[]>([]);

  const [activities, setActivities] =
    useState<Activity[]>([]);

  const [journals, setJournals] =
    useState<Journal[]>([]);

  const [selectedDate, setSelectedDate] =
    useState("");

  const [selectedHealth, setSelectedHealth] =
    useState<Health | null>(null);

  const selectedJournal =
    journals.find(
      (j) => j.date === selectedDate
    ) || null;

  const selectedActivity =
    activities.find(
      (a) =>
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
    try {
      const response = await apiFetch("/api/healths");
      const data = await response.json();

      setHealths(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Health Load Error", error);
    }
  };

  // =========================
  // Daily Activity API
  // =========================

  const loadActivities = async () => {
  try {
    const response = await apiFetch("/api/activities");
    const data = await response.json();

    setActivities(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Activity Load Error", error);
  }
  };

  // =========================
  // Journal API
  // =========================

  const loadJournals = async () => {
  try {
    const response = await apiFetch("/api/journals");
    const data = await response.json();

    setJournals(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("Journal Load Error", error);
  }
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
    <Layout currentPage="健康と日記">
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
  
          <JournalSection
            selectedDate={selectedDate}
            selectedJournal={selectedJournal}
            onSaved={loadJournals}
          />
  
        </div>
  
      </div>
    </Layout>
  );

}