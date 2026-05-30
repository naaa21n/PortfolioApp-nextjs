type Props = {
    title: string;
    value: string;
    subText?: string;
    color?: string;
  };
  
  export default function StatCard({
    title,
    value,
    subText,
    color = "#6366f1",
  }: Props) {
    return (
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "24px",
          boxShadow:
            "0 10px 30px rgba(15,23,42,.06)",
          border:
            "1px solid #eef2ff"
        }}
      >
        <div
          style={{
            color: "#64748b",
            marginBottom: "12px",
          }}
        >
          {title}
        </div>
  
        <div
          style={{
            fontSize: "38px",
            fontWeight: "bold",
            color,
          }}
        >
          {value}
        </div>
  
        {subText && (
          <div
            style={{
              marginTop: "10px",
              color: "#94a3b8",
            }}
          >
            {subText}
          </div>
        )}
      </div>
    );
  }