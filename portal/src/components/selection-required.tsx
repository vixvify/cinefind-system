import Link from "next/link";
import { ArrowLeft, Film } from "lucide-react";
export function SelectionRequired() {
  return (
    <div className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center gap-5 text-center">
      <Film size={42} className="text-lime" />
      <h1 className="text-2xl font-semibold">เริ่มจากหนังที่คุณรัก 5 เรื่อง</h1>
      <p className="text-sm leading-7 text-muted">
        เรายังได้รับรายการไม่ครบ เลือกหนังที่ชอบก่อน
        แล้วมาค้นพบเรื่องโปรดเรื่องถัดไปกัน
      </p>
      <Link href="/" className="primary-button">
        <ArrowLeft size={16} /> กลับไปเลือกหนัง
      </Link>
    </div>
  );
}
