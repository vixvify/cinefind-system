import Link from "next/link";
import { Film } from "lucide-react";
import { APP_ROUTES } from "@/routes/routes";

export default function NotFound() {
  return (
    <main className="page flex min-h-screen flex-col items-center justify-center gap-6 text-center">
      <Film size={40} className="text-lime" />
      <span className="text-sm tracking-[6px] text-lime">
        404 · SCENE NOT FOUND
      </span>
      <h1 className="text-3xl font-semibold">เหมือนเราจะหลงมาผิดฉาก</h1>
      <p className="text-muted">กลับไปหาหนังเรื่องโปรดของคุณกัน</p>
      <Link href={APP_ROUTES.HOME} className="primary-button">
        กลับหน้าแรก
      </Link>
    </main>
  );
}
