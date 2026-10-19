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
            <button onClick={() => dialog.current?.showModal()}>
              วิธีใช้ <ArrowUpRight size={14} />
            </button>
          </nav>
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
          ข้อมูลหนังจาก TMDB 5000 · ผลแนะนำยังใช้การจับคู่แนวหนัง ไม่ได้เชื่อมระบบ AI
        </p>
        <p className="mt-3 text-[10px] leading-5 text-muted"><a href="https://www.themoviedb.org" target="_blank" rel="noreferrer" className="text-lime">TMDB</a><br />This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
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
      <small>TMDB 5000 · ผลแนะนำจำลอง</small>
    </footer>
  );
}
