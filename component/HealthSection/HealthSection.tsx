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

    <div>

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
          selectedDate={
            selectedDate
          }
          selectedHealth={
            selectedHealth
          }
          onSaved={
            loadHealths
          }
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

      {/* 日記＋ジャーナリング */}
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