export default function DiaryList() {
    const diaries = [
      {
        date: "2024/06/20",
        text: "今日は朝から散歩を30分した。",
      },
      {
        date: "2024/06/19",
        text: "ジムに行けて充実した。",
      },
      {
        date: "2024/06/18",
        text: "体調が少し悪かった。",
      },
    ];
  
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h3>📖 今日の日記</h3>
  
        {diaries.map((diary) => (
          <div
            key={diary.date}
            style={{
              border:
                "1px solid #e2e8f0",
              borderRadius: "12px",
              padding: "16px",
              marginTop: "12px",
            }}
          >
            <strong>
              {diary.date}
            </strong>
  
            <p>{diary.text}</p>
          </div>
        ))}
      </div>
    );
  }