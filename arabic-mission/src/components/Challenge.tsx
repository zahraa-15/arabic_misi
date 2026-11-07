"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  ChevronLeft,
  Keyboard,
} from "lucide-react";
import { missions, type Activity } from "@/lib/content";
import { finish, recordAnswer } from "@/lib/progress";
import { useProgress } from "./ProgressProvider";
import { Speech, Recorder } from "./Media";
import { ProgressBar } from "./Ui";
function formatMatch(value: string) {
  try {
    const choices: unknown = JSON.parse(value);
    return Array.isArray(choices) && choices.every((x) => typeof x === "string")
      ? choices.join(" · ")
      : value;
  } catch {
    return value;
  }
}
function AnswerForm({
  activity,
  onSubmit,
  saved,
}: {
  activity: Activity;
  onSubmit: (value: string) => void;
  saved?: { value: string; correct: boolean };
}) {
  const a = activity;
  const [value, setValue] = useState("");
  const [selected, setSelected] = useState<number[]>([]);
  const [pairs, setPairs] = useState<string[]>(
    () => a.pairs?.map(() => "") ?? [],
  );
  const [checks, setChecks] = useState<string[]>([]);
  const [keyboard, setKeyboard] = useState(false);
  const arranged = selected
    .map((i) => a.options![i])
    .join(a.type === "letters" ? "" : " ");
  const response =
    a.type === "match"
      ? JSON.stringify(pairs)
      : ["letters", "order"].includes(a.type)
        ? arranged
        : a.type === "speak"
          ? "self-reviewed"
          : value;
  const ready = a.rubric
    ? checks.length === a.rubric.length &&
      (a.type !== "free" ||
        (/[\u0621-\u064A]/.test(value) && value.trim().length >= 15))
    : a.type === "match"
      ? pairs.every(Boolean)
      : Boolean(response.trim());
  return (
    <>
      <h2 className="question-title">{a.prompt}</h2>
      {a.audio && <Speech text={a.audio} />}{" "}
      {a.passage && (
        <div className="reading-box arabic" dir="rtl" lang="ar">
          {a.passage}
        </div>
      )}
      <fieldset disabled={!!saved}>
        <legend className="sr-only">Jawaban latihan</legend>
        {["choice", "boolean"].includes(a.type) && (
          <div className="choices">
            {a.options!.map((o, i) => (
              <label
                className={value === o ? "choice selected" : "choice"}
                key={o}
              >
                <input
                  type="radio"
                  name={a.id}
                  checked={value === o}
                  onChange={() => setValue(o)}
                />
                <span className="choice-letter">
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  dir="auto"
                  className={/[\u0600-\u06FF]/.test(o) ? "arabic" : ""}
                >
                  {o}
                </span>
              </label>
            ))}
          </div>
        )}
        {a.type === "match" && (
          <div className="matching">
            {a.pairs!.map(([ar], i) => (
              <label key={ar}>
                <span className="arabic" dir="rtl" lang="ar">
                  {ar}
                </span>
                <select
                  aria-label={`Arti ${ar}`}
                  value={pairs[i]}
                  onChange={(e) =>
                    setPairs(
                      pairs.map((x, j) => (i === j ? e.target.value : x)),
                    )
                  }
                >
                  <option value="">Pilih arti…</option>
                  {[...a.pairs!].reverse().map((p) => (
                    <option key={p[1]}>{p[1]}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        )}
        {["letters", "order"].includes(a.type) && (
          <div>
            <div
              dir="rtl"
              lang="ar"
              className="arrange-output arabic"
              aria-live="polite"
            >
              {arranged || "…"}
            </div>
            <div className="tokens" dir="rtl">
              {a.options!.map((o, i) => (
                <button
                  className="token arabic"
                  key={i}
                  disabled={selected.includes(i) || !!saved}
                  onClick={() => setSelected([...selected, i])}
                >
                  {o}
                </button>
              ))}
            </div>
            <button className="text-link" onClick={() => setSelected([])}>
              <RotateCcw size={15} /> Susun ulang
            </button>
          </div>
        )}
        {["text", "fill", "free"].includes(a.type) && (
          <div>
            <label className="field-label" htmlFor={`answer-${a.id}`}>
              Jawaban dalam bahasa Arab
            </label>
            <textarea
              id={`answer-${a.id}`}
              lang="ar"
              dir="rtl"
              className="arabic"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              rows={a.type === "free" ? 4 : 2}
              placeholder="اكتب هنا…"
            />
            <button
              className="text-link"
              onClick={() => setKeyboard(!keyboard)}
              aria-expanded={keyboard}
            >
              <Keyboard size={17} /> {keyboard ? "Tutup" : "Buka"} papan huruf
              Arab
            </button>
            {keyboard && (
              <div className="keyboard" dir="rtl">
                {"ا أ إ آ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي ة ى ء ؤ ئ"
                  .split(" ")
                  .map((c) => (
                    <button
                      className="token arabic"
                      key={c}
                      onClick={() => setValue(value + c)}
                    >
                      {c}
                    </button>
                  ))}
                <button className="token" onClick={() => setValue(value + " ")}>
                  Spasi
                </button>
                <button
                  className="token"
                  onClick={() => setValue(value.slice(0, -1))}
                >
                  Hapus
                </button>
                <button
                  className="token"
                  onClick={() => setValue(value + ". ")}
                >
                  Titik
                </button>
              </div>
            )}
          </div>
        )}
        {a.type === "speak" && <Recorder />}
        {a.rubric && (
          <div className="rubric">
            <strong>
              Refleksi mandiri — centang setelah benar-benar dilakukan
            </strong>
            {a.rubric.map((r) => (
              <label key={r}>
                <input
                  type="checkbox"
                  checked={checks.includes(r)}
                  onChange={(e) =>
                    setChecks(
                      e.target.checked
                        ? [...checks, r]
                        : checks.filter((x) => x !== r),
                    )
                  }
                />
                <span>{r}</span>
              </label>
            ))}
            <p className="text-sm muted">
              {a.type === "free"
                ? "Variasi jawaban dinilai sendiri melalui rubrik, bukan pencocokan kalimat atau AI. Minimal 15 karakter dan mengandung huruf Arab untuk mengirim."
                : "Tidak ada deteksi atau penilaian pelafalan otomatis. Rekaman tidak wajib."}
            </p>
          </div>
        )}
      </fieldset>
      {!saved ? (
        <button
          className="btn"
          disabled={!ready}
          onClick={() => onSubmit(response)}
        >
          Periksa jawaban <CheckCircle2 size={17} />
        </button>
      ) : (
        <div
          className={`feedback ${saved.correct ? "correct" : "incorrect"}`}
          role="status"
        >
          <div className="flex gap-2 items-center">
            {saved.correct ? <CheckCircle2 /> : <XCircle />}
            <strong>
              {saved.correct
                ? a.rubric
                  ? "Refleksi latihan terselesaikan"
                  : "Tepat sekali!"
                : "Belum tepat. Ayo pahami alasannya."}
            </strong>
          </div>
          <p>{a.explanation}</p>
          {!a.rubric && (
            <p className="text-sm">
              Jawaban tersimpan:{" "}
              <bdi>
                {a.type === "match" ? formatMatch(saved.value) : saved.value}
              </bdi>
            </p>
          )}
        </div>
      )}
    </>
  );
}
export function Challenge({ id }: { id: string }) {
  const { progress, ready, update } = useProgress();
  const router = useRouter();
  const m = missions.find((m) => m.id === id)!;
  const draft = progress.drafts[id] ?? {};
  const count = Object.keys(draft).length;
  const [index, setIndex] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const current = index ?? Math.min(count, m.activities.length - 1);
  const a = m.activities[current];
  if (!ready)
    return (
      <div className="container section" role="status">
        Memuat progres…
      </div>
    );
  if (progress.finalized.includes(id))
    return (
      <div className="container section">
        <h1>Latihan ini sudah dikirim.</h1>
        <p>Lihat hasil atau mulai percobaan baru dari halaman hasil.</p>
        <Link className="btn" href={`/result/${id}`}>
          Lihat hasil <ArrowRight />
        </Link>
      </div>
    );
  return (
    <div className="container section challenge-layout">
      <aside className="challenge-aside">
        <Link href={`/learn/${id}`} className="text-link">
          <ChevronLeft size={17} /> Kembali ke materi
        </Link>
        <span className="eyebrow">CHALLENGE ZONE</span>
        <h2>{m.title}</h2>
        <p>{m.objective}</p>
        <ProgressBar value={(count / 5) * 100} label="Aktivitas terjawab" />
        <p className="text-sm">{count} / 5 aktivitas dijawab</p>
        <div className="question-dots">
          {m.activities.map((q, i) => (
            <button
              key={q.id}
              disabled={i > count}
              onClick={() => setIndex(i)}
              aria-label={`Aktivitas ${i + 1}`}
              aria-current={current === i ? "step" : undefined}
              className={
                current === i ? "current" : draft[q.id] ? "answered" : ""
              }
            >
              {i + 1}
            </button>
          ))}
        </div>
        <p className="text-sm muted">
          10 XP untuk setiap aktivitas yang berhasil, hanya satu kali. Lulus
          dengan skor minimal 80% serta seluruh refleksi lisan / tulisan
          selesai.
        </p>
      </aside>
      <div className="card challenge-card">
        <div className="flex justify-between mb-6">
          <span className="eyebrow">AKTIVITAS {current + 1} DARI 5</span>
          <span className="mini-tag">+10 XP unik</span>
        </div>
        <AnswerForm
          key={a.id}
          activity={a}
          saved={draft[a.id]}
          onSubmit={(v) => {
            setIndex(current);
            update((p) => recordAnswer(p, id, a.id, v));
          }}
        />
        {draft[a.id] && (
          <div className="mt-6">
            {current < 4 ? (
              <button className="btn" onClick={() => setIndex(current + 1)}>
                Aktivitas berikutnya <ArrowRight size={18} />
              </button>
            ) : (
              <button
                disabled={count < 5 || busy}
                className="btn"
                onClick={() => {
                  setBusy(true);
                  update((p) => finish(p, id));
                  router.push(`/result/${id}`);
                }}
              >
                Lihat hasil misi <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
