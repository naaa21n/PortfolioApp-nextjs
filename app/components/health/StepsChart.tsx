type Props = {
    data: number[];
  };
  
  export default function StepsChart({
    data,
  }: Props) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "24px",
        }}
      >
        <h3>📊 歩数の推移（過去5日間）</h3>
  
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "16px",
            height: "260px",
            marginTop: "20px",
          }}
        >
          {data.map((value, index) => (
            <div
              key={index}
              style={{
                flex: 1,
                textAlign: "center",
              }}
            >
              <div
                style={{
                  height: `${value / 40}px`,
                  background:
                    "linear-gradient(180deg,#a5b4fc,#6366f1)",
                  borderRadius:
                    "12px 12px 0 0",
                  boxShadow:
                    "0 8px 20px rgba(99,102,241,0.25)",
                  transition: "0.3s",
                }}
              />
  
              <div
                style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }