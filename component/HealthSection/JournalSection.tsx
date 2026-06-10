"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import type { Journal } from "../types/health";

type Props = {
  selectedDate: string;
  selectedJournal: Journal | null;
  onSaved: () => void | Promise<void>;
};

export default function JournalSection({
  selectedDate,
  selectedJournal,
  onSaved,
}: Props) {
  const [gratitude, setGratitude] =
    useState("");

  const [achievement, setAchievement] =
    useState("");

  const [tomorrowGoal, setTomorrowGoal] =
    useState("");

  const [freeText, setFreeText] =
    useState("");

  useEffect(() => {
    setGratitude(
      selectedJournal?.gratitude || ""
    );

    setAchievement(
      selectedJournal?.achievement || ""
    );

    setTomorrowGoal(
      selectedJournal?.tomorrowGoal || ""
    );

    setFreeText(
      selectedJournal?.freeText || ""
    );
  }, [selectedJournal, selectedDate]);

  const saveJournal = async () => {
    if (!selectedDate) {
      alert("日付を選択してください");
      return;
    }

    const body = {
      id:
        selectedJournal?.id ||
        String(Date.now()),

      date: selectedDate,

      gratitude,
      achievement,
      tomorrowGoal,
      freeText,
    };

    const method =
      selectedJournal
        ? "PUT"
        : "POST";

    const path =
      selectedJournal
        ? `/api/journals/${selectedJournal.id}`
        : "/api/journals";

    try {
      await apiFetch(path, {
        method,
        body: JSON.stringify(body),
      });

      await onSaved();
    } catch (error) {
      console.error(
        "Journal Save Error",
        error
      );
    }
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
        🌱 ジャーナリング
      </h3>

      <div
        style={{
          color: "#64748b",
          marginTop: "8px",
        }}
      >
        {selectedDate || "日付を選択してください"}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "20px",
        }}
      >
        <textarea
          value={gratitude}
          onChange={(e) =>
            setGratitude(e.target.value)
          }
          placeholder="感謝したこと"
          style={textareaStyle}
        />

        <textarea
          value={achievement}
          onChange={(e) =>
            setAchievement(e.target.value)
          }
          placeholder="頑張ったこと"
          style={textareaStyle}
        />

        <textarea
          value={tomorrowGoal}
          onChange={(e) =>
            setTomorrowGoal(e.target.value)
          }
          placeholder="明日の目標"
          style={textareaStyle}
        />

        <textarea
          value={freeText}
          onChange={(e) =>
            setFreeText(e.target.value)
          }
          placeholder="自由に書く"
          style={textareaStyle}
        />

        <button
          type="button"
          onClick={saveJournal}
          style={buttonStyle}
        >
          保存
        </button>
      </div>
    </div>
  );
}

const textareaStyle: React.CSSProperties = {
  minHeight: "70px",
  padding: "12px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  border: "none",
  borderRadius: "12px",
  padding: "12px",
  background: "#16a34a",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "bold",
};