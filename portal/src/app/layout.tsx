import type { Metadata } from "next";
import "./globals.css";
import { getCatalog } from "@/lib/catalog.server";
import { CatalogProvider } from "@/components/catalog-provider";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "cinefind — หนังเรื่องถัดไปที่ใช่สำหรับคุณ",
  description: "เลือกหนังที่คุณรัก 5 เรื่อง แล้วค้นพบหนังเรื่องโปรดเรื่องถัดไปกับ cinefind — UI demo",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const movies = await getCatalog();

  return (
    <html lang="th">
      <body>
        <CatalogProvider movies={movies}>
          {children}
        </CatalogProvider>
      </body>
    </html>
  );
}
