"use client";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ reset }: GlobalErrorProps) {
  return (
    <html lang="th">
      <body
        style={{
          margin: 0,
          backgroundColor: "#111210",
          color: "#f1f0e9",
          fontFamily: "'DM Sans', 'Noto Sans Thai', Tahoma, sans-serif",
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <main style={{ padding: "24px", textAlign: "center", maxWidth: "480px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "12px" }}>
            ยังเปิดรายการหนังไม่ได้
          </h1>
          <p style={{ color: "#a0a296", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
            ลองอีกครั้ง หรือตรวจไฟล์ dataset และการตั้งค่า server
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 24px",
              backgroundColor: "#d7ed6b",
              color: "#111210",
              fontWeight: 600,
              fontSize: "13px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
            }}
          >
            ลองอีกครั้ง
          </button>
        </main>
      </body>
    </html>
  );
}
