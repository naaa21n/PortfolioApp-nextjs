"use client";

type Health = {
  id: string;
  date: string;
  steps: number;
  sleepHours: number;
  exerciseMinutes: number;
  waterMl: number;
};

type Props = {
  healths: Health[];
};

export default function DashboardCard({
  healths,
}: Props) {

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  const todayHealth =
    healths.find(
      (h) => h.date === today
    );

  const todaySteps =
    todayHealth?.steps || 0;

  const todaySleep =
    todayHealth?.sleepHours || 0;

  const todayExercise =
    todayHealth?.exerciseMinutes || 0;

  const todayWater =
    todayHealth?.waterMl || 0;

  const streak =
    calculateStreak(
      healths
    );

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(4,1fr)",
        gap: "24px",
        marginBottom: "24px",
      }}
    >

      <Card
        title="👣 今日の歩数"
        value={`${todaySteps.toLocaleString()} 歩`}
      />

      <Card
        title="😴 睡眠"
        value={`${todaySleep} h`}
      />

      <Card
        title="🏃 運動"
        value={`${todayExercise} 分`}
      />

      <Card
        title="🔥 継続日数"
        value={`${streak} 日`}
      />

    </div>
  );
}

// =========================
// KPI Card
// =========================

function Card({
  title,
  value,
}: {
  title: string;
  value: string;
}) {

  return (

    <div
      style={{
        background: "#ffffff",
        borderRadius: "30px",
        padding: "28px",
        boxShadow:
          "0 10px 30px rgba(0,0,0,0.05)",
      }}
    >

      <div
        style={{
          fontSize: "15px",
          color: "#64748b",
          marginBottom: "14px",
          fontWeight: 500,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "42px",
          fontWeight: 700,
          color: "#1e1b4b",
        }}
      >
        {value}
      </div>

    </div>
  );
}

// =========================
// 連続記録
// =========================

function calculateStreak(
  healths: Health[]
) {

  const dates =
    healths
      .filter(
        (h) =>
          (h.steps || 0) > 0
      )
      .map((h) => h.date)
      .sort()
      .reverse();

  if (dates.length === 0) {
    return 0;
  }

  let streak = 1;

  for (
    let i = 0;
    i < dates.length - 1;
    i++
  ) {

    const current =
      new Date(dates[i]);

    const next =
      new Date(
        dates[i + 1]
      );

    const diff =
      (current.getTime() -
        next.getTime()) /
      (1000 * 60 * 60 * 24);

    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}