export default function JournalCard() {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h3>🌱 ジャーナリング</h3>
  
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginTop: "20px",
          }}
        >
          <textarea
            placeholder="感謝したこと"
            style={textareaStyle}
          />
  
          <textarea
            placeholder="頑張ったこと"
            style={textareaStyle}
          />
  
          <textarea
            placeholder="明日の目標"
            style={textareaStyle}
          />
  
          <textarea
            placeholder="自由に書く"
            style={textareaStyle}
          />
        </div>
      </div>
    );
  }
  
  const textareaStyle = {
    minHeight: "70px",
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
  };