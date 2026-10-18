"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  Clapperboard,
  Film,
  Heart,
  Sparkles,
  X,
} from "lucide-react";
import { useRef } from "react";

export function Header() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="cinefind หน้าแรก">
            <span className="brand-icon">
              <Clapperboard size={21} />
            </span>
            cinefind<span className="brand-dot">.</span>
          </Link>
          <nav aria-label="เมนูหลัก">
            <Link href="/" className="nav-active">
              ค้นพบหนัง
            </Link>
            <button onClick={() => dialog.current?.showModal()}>
              ทำงานอย่างไร <ArrowUpRight size={14} />
            </button>
          </nav>
          <span className="header-note">
            <span /> FOR THE LOVE OF CINEMA
          </span>
        </div>
      </header>
      <dialog
        ref={dialog}
        className="how-dialog"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <button
          className="icon-button dialog-close"
          aria-label="ปิด"
          onClick={() => dialog.current?.close()}
        >
          <X />
        </button>
        <span className="eyebrow">A LITTLE TASTE. A NEW DISCOVERY.</span>
        <h2>หนังที่ใช่ เริ่มจากคุณ</h2>
        <div className="how-step">
          <Heart />
          <div>
            <h3>01 — เลือกหนังที่รัก 5 เรื่อง</h3>
            <p>ไม่ต้องคิดมาก เลือกเรื่องที่ดูแล้วรู้สึกว่า “ใช่เลย”</p>
          </div>
        </div>
        <div className="how-step">
          <Sparkles />
          <div>
            <h3>02 — ให้เราทำความรู้จักรสนิยมคุณ</h3>
            <p>ดูแอนิเมชันระหว่างจับคู่แนวหนังที่คุณเลือก</p>
          </div>
        </div>
        <div className="how-step">
          <Film />
          <div>
            <h3>03 — ค้นพบเรื่องโปรดเรื่องใหม่</h3>
            <p>รับลิสต์หนัง 6 เรื่อง พร้อมเหตุผลที่น่าจะถูกใจคุณ</p>
          </div>
        </div>
        <p className="demo-note">
          นี่คือ UI demo ใช้ข้อมูลจำลองและการจับคู่แนวหนังในเครื่อง ยังไม่มีระบบ
          AI
        </p>
      </dialog>
    </>
  );
}
export function Steps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="steps" aria-label="ขั้นตอนการค้นพบหนัง">
      {["เลือกหนังที่ชอบ", "ค้นหารสนิยม", "พบหนังที่ใช่"].map(
        (label, index) => (
          <li
            key={label}
            className={
              current === index + 1
                ? "current"
                : current > index + 1
                  ? "complete"
                  : ""
            }
            aria-current={current === index + 1 ? "step" : undefined}
          >
            <span>{current > index + 1 ? "✓" : `0${index + 1}`}</span>
            {label}
          </li>
        ),
      )}
    </ol>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        cinefind<span className="brand-dot">.</span>
      </span>
      <p>Every great movie starts with a little discovery.</p>
      <small>สร้างมาเพื่อคนรักหนัง · UI DEMO</small>
    </footer>
  );
}
