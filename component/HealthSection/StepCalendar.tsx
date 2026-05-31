"use client";


type Health = {
    id: string;
    date: string;
    steps: number;
};

type Props = {
    selectedDate: string;
    onDateSelect: (
      date: string
    ) => void;
    healths: Health[];
};

export default function StepCalendar({
  selectedDate,
  onDateSelect,
  healths,
}: Props) {

  const today =
    new Date();

  const year =
    today.getFullYear();

  const month =
    today.getMonth();

  const days =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

    const getSteps =
        (date: string) => {
    
            const health =
                healths.find(
                (h: any) =>
                    h.date === date
                );
  
            return health?.steps || 0;
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
        📅 歩数カレンダー
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(7,1fr)",
          gap: "10px",
          marginTop: "20px",
        }}
      >

        {Array.from({
          length: days,
        }).map((_, index) => {

          const day =
            index + 1;

          const date =
            `${year}-${String(
              month + 1
            ).padStart(2, "0")}-${String(
              day
            ).padStart(2, "0")}`;

          const selected =
            date ===
            selectedDate;

          return (

            <button
            key={date}
            onClick={() =>
              onDateSelect(date)
            }
            style={{
              border: "none",
              borderRadius: "12px",
              padding: "8px",
              minHeight: "70px",
              cursor: "pointer",
          
              background:
                selected
                  ? "#2563eb"
                  : "#f8fafc",
          
              color:
                selected
                  ? "#fff"
                  : "#000",
            }}
          >
          
            <div>
              {day}
            </div>
          
            <div
              style={{
                fontSize: "11px",
                marginTop: "4px",
              }}
            >
              {getSteps(date)}
            </div>
          
          </button>
          );
        })}

      </div>

    </div>
  );
}