"use client";
import Layout from "../layout/Layout";

import StatCard from "./StatCard";
import StepsChart from "./StepsChart";
import DiaryList from "./DiaryList";
import JournalCard from "./JournalCard";
import LifeBalanceCard from "./LifeBalanceCard";

export default function HealthDashboard() {
  const stepData = [
    6200,
    7800,
    4500,
    9200,
    7500,
  ];

  return (
    <Layout currentPage="健康と日記">
      <div style={{ padding: "24px" }}>

        <h1
          style={{
            fontSize: "42px",
            marginBottom: "10px",
          }}
        >
          ❤️ 健康と日記
        </h1>

        <p
          style={{
            color: "#64748b",
            marginBottom: "30px",
          }}
        >
          毎日の健康習慣を記録して、
          理想の自分に近づこう。
        </p>

        {/* KPI */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(4,1fr)",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <StatCard
            title="今日の歩数"
            value="7,500歩"
            subText="目標 8,000歩"
            color="#3b82f6"
          />

          <StatCard
            title="今週の平均"
            value="6,800歩"
            subText="+8%"
            color="#10b981"
          />

          <StatCard
            title="連続記録"
            value="12日"
            subText="ベスト18日"
            color="#f97316"
          />

          <StatCard
            title="総記録数"
            value="128件"
            subText="+24件"
            color="#a855f7"
          />
        </div>

        {/* グラフ */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "20px",
            marginBottom: "20px",
          }}
        >
          <StepsChart
            data={stepData}
          />

          <LifeBalanceCard />
        </div>

        {/* 下段 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
          }}
        >
          <DiaryList />

          <JournalCard />
        </div>
      </div>
    </Layout>
  );
}