"use client";

import { useRef, type MouseEvent } from "react";
import Link from "next/link";
import { APP_ROUTES } from "@/routes/routes";
import {
  ArrowUpRight,
  Clapperboard,
  Film,
  Heart,
  Sparkles,
  X,
} from "lucide-react";

interface StepsProps {
  current: 1 | 2 | 3;
}

const STEP_LABELS = ["เลือกหนังที่ชอบ", "ค้นหารสนิยม", "พบหนังที่ใช่"] as const;

export function Header() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  function openDialog() {
    dialogRef.current?.showModal();
  }

  function closeDialog() {
    dialogRef.current?.close();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) {
      closeDialog();
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href={APP_ROUTES.HOME} className="brand" aria-label="cinefind หน้าแรก">
            <span className="brand-icon">
              <Clapperboard size={21} />
            </span>
            cinefind<span className="brand-dot">.</span>
          </Link>

          <nav aria-label="เมนูหลัก">
            <button type="button" onClick={openDialog}>
              วิธีใช้ <ArrowUpRight size={14} />
            </button>
          </nav>
        </div>
      </header>

      <dialog
        ref={dialogRef}
        className="how-dialog"
        onClick={handleBackdropClick}
      >
        <button
          type="button"
          className="icon-button dialog-close"
          aria-label="ปิดหน้าต่างวิธีใช้"
          onClick={closeDialog}
        >
          <X size={16} />
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
          ข้อมูลหนังจาก TMDB 5000 · แนะนำโดย CineFind AI
        </p>

        <p className="mt-3 text-[10px] leading-5 text-muted">
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noreferrer"
            className="text-lime"
          >
            TMDB
          </a>
          <br />
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </dialog>
    </>
  );
}

export function Steps({ current }: StepsProps) {
  return (
    <ol className="steps" aria-label="ขั้นตอนการค้นพบหนัง">
      {STEP_LABELS.map((label, index) => {
        const stepNumber = index + 1;
        const isCurrent = current === stepNumber;
        const isComplete = current > stepNumber;

        const stateClass = isCurrent
          ? "current"
          : isComplete
            ? "complete"
            : "";

        return (
          <li
            key={label}
            className={stateClass}
            aria-current={isCurrent ? "step" : undefined}
          >
            <span>{isComplete ? "✓" : `0${stepNumber}`}</span>
            {label}
          </li>
        );
      })}
    </ol>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <span>
        cinefind<span className="brand-dot">.</span>
      </span>
      <small>TMDB 5000 · CineFind AI</small>
    </footer>
  );
}
