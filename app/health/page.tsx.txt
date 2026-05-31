import Sidebar from "@/component/layout/Sidebar";
import HealthSection from "@/component/HealthSection/HealthSection";

export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#f8fafc 0%,#eef2ff 100%)",
        padding: "24px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
        }}
      >
        <Sidebar currentPage="健康と日記" />

        <div
          style={{
            flex: 1,
          }}
        >
          <HealthSection />
        </div>
      </div>
    </main>
  );
}