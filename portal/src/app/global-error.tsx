"use client";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="th"><body style={{ margin: 0, background: "#111210", color: "#f1f0e9", fontFamily: "Tahoma, sans-serif" }}><main style={{ padding: "20vh 24px", textAlign: "center" }}><h1>ยังเปิดรายการหนังไม่ได้</h1><p>ลองอีกครั้ง หรือตรวจไฟล์ dataset และการตั้งค่า server</p><button onClick={reset} style={{ padding: "12px 24px", cursor: "pointer" }}>ลองอีกครั้ง</button></main></body></html>;
}
