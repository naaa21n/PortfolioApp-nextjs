"use client";

import { useState } from "react";

type Props = {
  selectedDate: string;
  reloadActivities: () => void;
};

export default function ActivityLog({
  selectedDate,
  reloadActivities,
}: Props) {

  const [sleep, setSleep] =
    useState(0);

  const [work, setWork] =
    useState(0);

  const [study, setStudy] =
    useState(0);

  const [exercise, setExercise] =
    useState(0);

  const [hobby, setHobby] =
    useState(0);

  const [other, setOther] =
    useState(0);

  const saveActivity =
    async () => {

      const body = {
        id: String(Date.now()),
        date: selectedDate,

        sleep,
        work,
        study,
        exercise,
        hobby,
        other,
      };

      console.log(body);

      const response =
        await fetch(
          "http://localhost:8080/api/activities",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(body),
          }
        );

      console.log(
        response.status
      );

      reloadActivities();
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
        📋 行動ログ
      </h3>

      <div
        style={{
          color: "#64748b",
          marginBottom: "20px",
        }}
      >
        {selectedDate}
      </div>

      <Input
        label="睡眠（分）"
        value={sleep}
        setValue={setSleep}
      />

      <Input
        label="仕事（分）"
        value={work}
        setValue={setWork}
      />

      <Input
        label="勉強（分）"
        value={study}
        setValue={setStudy}
      />

      <Input
        label="運動（分）"
        value={exercise}
        setValue={setExercise}
      />

      <Input
        label="趣味（分）"
        value={hobby}
        setValue={setHobby}
      />

      <Input
        label="その他（分）"
        value={other}
        setValue={setOther}
      />

      <button
        onClick={saveActivity}
        style={{
          width: "100%",
          marginTop: "20px",
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

function Input({
  label,
  value,
  setValue,
}: any) {

  return (

    <div
      style={{
        marginBottom: "12px",
      }}
    >

      <label>
        {label}
      </label>

      <input
        type="number"
        value={value}
        onChange={(e) =>
          setValue(
            Number(
              e.target.value
            )
          )
        }
        style={{
          width: "100%",
          padding: "10px",
          borderRadius: "10px",
          border:
            "1px solid #cbd5e1",
          marginTop: "6px",
        }}
      />

    </div>
  );
}