import Link from "next/link";
import {
  Headphones,
  Mic,
  BookOpen,
  PenLine,
  ArrowRight,
  Check,
  Flag,
  Trophy,
} from "lucide-react";
import { type Skill, missions, skillNames } from "@/lib/content";
import { type Progress } from "@/lib/progress";
export const icons = {
  listening: Headphones,
  speaking: Mic,
  reading: BookOpen,
  writing: PenLine,
};
export function ProgressBar({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div
      className="progress-track"
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <span style={{ width: `${value}%` }} />
    </div>
  );
}
export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="page-title">
      <span className="eyebrow">{eyebrow}</span>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
export function MissionCards({ progress }: { progress?: Progress }) {
  return (
    <div className="mission-list">
      {missions.map((m, i) => {
        const Icon = m.id === "final" ? Trophy : icons[m.skill];
        const count = Object.keys(progress?.drafts[m.id] ?? {}).length;
        const done = progress?.completed.includes(m.id);
        return (
          <Link className="mission-row" href={`/learn/${m.id}`} key={m.id}>
            <span className={`skill-icon ${m.skill}`}>
              <Icon size={23} />
            </span>
            <div className="grow">
              <span className="eyebrow">
                {m.id === "final"
                  ? "FINAL CHALLENGE"
                  : `MISSION 0${i + 1} · ${skillNames[m.skill]}`}
              </span>
              <h3>{m.title}</h3>
              <span className="muted text-sm">
                {m.minutes} menit · 5 aktivitas ·{" "}
                {done ? "Selesai" : count ? "Sedang berjalan" : "Tersedia"}
              </span>
            </div>
            <span className="mission-status">
              {done ? <Check /> : <ArrowRight />}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
export function Empty() {
  return (
    <div className="empty">
      <Flag size={38} />
      <h2>Petualanganmu dimulai di sini.</h2>
      <p>
        Belum ada aktivitas. Selesaikan misi pertamamu untuk mengumpulkan XP dan
        melihat perkembanganmu.
      </p>
      <Link className="btn" href="/learn/listening">
        Mulai misi pertama <ArrowRight size={17} />
      </Link>
    </div>
  );
}
export function SkillCard({ skill }: { skill: Skill }) {
  const Icon = icons[skill];
  const arabic = {
    listening: "الاستماع",
    speaking: "الكلام",
    reading: "القراءة",
    writing: "الكتابة",
  };
  const desc = {
    listening: "Latih telingamu, temukan maknanya.",
    speaking: "Mulai bicara dengan percaya diri.",
    reading: "Buka dunia melalui setiap kata.",
    writing: "Tuangkan ceritamu dalam bahasa Arab.",
  };
  return (
    <Link className="skill-card" href={`/learn/${skill}`}>
      <div className="flex items-center justify-between">
        <span className={`skill-icon ${skill}`}>
          <Icon size={23} />
        </span>
        <ArrowUp />
      </div>
      <p className="arabic" lang="ar" dir="rtl">
        {arabic[skill]}
      </p>
      <h3>{skillNames[skill]}</h3>
      <p>{desc[skill]}</p>
    </Link>
  );
}
function ArrowUp() {
  return <ArrowRight size={18} className="muted -rotate-45" />;
}
