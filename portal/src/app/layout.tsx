import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "cinefind — หนังเรื่องถัดไปที่ใช่สำหรับคุณ",
  description: "เลือกหนังที่คุณรัก 5 เรื่อง แล้วค้นพบหนังเรื่องโปรดเรื่องถัดไปกับ cinefind — UI demo",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="th"><body>{children}</body></html>;
}
