"use client";

type Health = {
  id: string;
  date: string;
  steps: number;
};

type Props = {
  healths: Health[];
};

export default function DashboardCard({
  healths,
}: Props) {

  console.log("healths", healths);

  const today =
    new Date()
      .toISOString()
      .split("T")[0];

  // 今日の歩数

  const todayHealth =
    healths.find(
      (h) => h.date === today
    );

  const todaySteps =
    todayHealth?.steps || 0;

  // 今週平均

  const last7 =
  [...healths]
    .filter(
      (h) => h?.date
    )
    .sort((a, b) =>
      String(a.date)
        .localeCompare(
          String(b.date)
        )
    )
    .slice(-7);

  const averageSteps =
    last7.length === 0
      ? 0
      : Math.round(
          last7.reduce(
            (sum, h) =>
              sum + (h.steps || 0),
            0
          ) / last7.length
        );

  // 連続記録

  const streak =
    calculateStreak(
      healths
    );

  return (

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(3,1fr)",
        gap: "20px",
      }}
    >

      <Card
        title="🚶 今日の歩数"
        value={`${todaySteps} 歩`}
      />

      <Card
        title="📈 今週平均"
        value={`${averageSteps} 歩`}
      />

      <Card
        title="🔥 連続記録"
        value={`${streak} 日`}
      />

    </div>
  );
}

// =========================
// Card
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
        background: "#fff",
        borderRadius: "20px",
        padding: "24px",
        textAlign: "center",
      }}
    >

      <div
        style={{
          color: "#64748b",
          fontSize: "14px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: "32px",
          fontWeight: "bold",
          marginTop: "12px",
        }}
      >
        {value}
      </div>

    </div>
  );
}

// =========================
// 連続記録計算
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