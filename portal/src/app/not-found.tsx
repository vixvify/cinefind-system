import Link from "next/link";
export default function NotFound() {
  return <main className="page flex min-h-screen flex-col items-center justify-center gap-6 text-center"><span className="text-sm tracking-[6px] text-lime">404 · SCENE NOT FOUND</span><h1 className="text-3xl font-semibold">เหมือนเราจะหลงมาผิดฉาก</h1><p className="text-muted">กลับไปหาหนังเรื่องโปรดของคุณกัน</p><Link href="/" className="primary-button">กลับหน้าแรก</Link></main>;
}
