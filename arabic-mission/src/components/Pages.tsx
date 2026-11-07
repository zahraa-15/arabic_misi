"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Compass,
  Lock,
  Users,
  School,
  Heart,
  Sun,
  Utensils,
  MapPin,
  Clock,
  Trophy,
  Star,
  Flame,
  CheckCircle2,
  RotateCcw,
  ChevronLeft,
  BookOpen,
  ShieldCheck,
} from "lucide-react";
import {
  missions,
  themes,
  vocabulary,
  skillNames,
  badgeDefs,
  type Skill,
} from "@/lib/content";
import { badgesOf, xpOf, levelOf } from "@/lib/progress";
import { useProgress } from "./ProgressProvider";
import { useAuth } from "./AuthProvider";
import { Empty, MissionCards, PageTitle, ProgressBar, icons } from "./Ui";
import { Speech } from "./Media";
const themeIcons = [Users, Heart, School, Sun, Clock, Utensils, MapPin, Clock];
function Stats() {
  const { progress } = useProgress();
  const xp = xpOf(progress);
  const l = levelOf(xp);
  return (
    <div className="stats-grid">
      <div className="stat card">
        <span>
          <Flame size={19} /> TOTAL XP
        </span>
        <strong>
          {xp}
          <small>XP</small>
        </strong>
        <p>Diraih dari latihanmu</p>
      </div>
      <div className="stat card">
        <span>
          <Compass size={19} /> LEVEL SAAT INI
        </span>
        <strong className="level-name">{l.current.name}</strong>
        <ProgressBar value={l.percent} label="Progres level" />
        <p>
          {l.next
            ? `${l.next.xp - xp} XP lagi menuju ${l.next.name}`
            : "Level tertinggi tercapai!"}
        </p>
      </div>
      <div className="stat card">
        <span>
          <CheckCircle2 size={19} /> MISI SELESAI
        </span>
        <strong>
          {progress.completed.length}
          <small>/ 5</small>
        </strong>
        <p>Teruskan langkah baikmu</p>
      </div>
    </div>
  );
}
export function Dashboard() {
  const { progress, ready } = useProgress();
  return (
    <div className="container section">
      <PageTitle
        eyebrow="PUSAT BELAJARMU"
        title="Halo, penjelajah bahasa!"
        description="Tidak perlu terburu-buru. Satu misi hari ini sudah menjadi kemajuan."
      />
      {!ready ? (
        <p role="status">Memuat progres…</p>
      ) : (
        <>
          <Stats />
          {!progress.last && !progress.completed.length ? (
            <Empty />
          ) : (
            progress.last && (
              <div className="continue-banner">
                <div>
                  <span className="eyebrow">LANJUTKAN PERJALANAN</span>
                  <h2>{missions.find((m) => m.id === progress.last)?.title}</h2>
                </div>
                <Link
                  className="btn"
                  href={
                    progress.finalized.includes(progress.last)
                      ? `/result/${progress.last}`
                      : `/challenge/${progress.last}`
                  }
                >
                  Lanjutkan <ArrowRight size={17} />
                </Link>
              </div>
            )
          )}
          <div className="section-heading mt-12">
            <h2>Misi untukmu</h2>
            <Link href="/missions" className="text-link">
              Lihat peta <ArrowRight size={17} />
            </Link>
          </div>
          <div className="two-column">
            <MissionCards progress={progress} />
            <div>
              <div className="card">
                <h3>Empat keterampilanmu</h3>
                <SkillProgress />
              </div>
              <div className="card mt-6">
                <h3>Badge yang kamu raih</h3>
                {badgesOf(progress).length ? (
                  <div className="badge-chips">
                    {badgeDefs
                      .filter((b) => badgesOf(progress).includes(b.id))
                      .map((b) => (
                        <span key={b.id}>
                          <ShieldCheck size={17} />
                          {b.name}
                        </span>
                      ))}
                  </div>
                ) : (
                  <p className="muted">
                    Badge pertama menunggumu setelah lulus satu misi.
                  </p>
                )}
                <Link href="/rewards" className="text-link">
                  Jelajahi pencapaian →
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
export function MissionMap() {
  const { progress } = useProgress();
  return (
    <div className="container section">
      <PageTitle
        eyebrow="MISSION MAP"
        title="Ke mana langkahmu hari ini?"
        description="Delapan dunia bahasa, dimulai dari satu perkenalan. Pilih misi dengan ritme yang nyaman untukmu."
      />
      <div className="theme-grid">
        {themes.map(([ar, name, desc], i) => {
          const Icon = themeIcons[i];
          return (
            <article
              key={name}
              className={`theme-card ${i === 0 ? "available" : "upcoming"}`}
            >
              <div className="flex justify-between items-center">
                <span className="skill-icon">
                  <Icon />
                </span>
                <span className="mini-tag">
                  {i === 0 ? "Tersedia" : "Konten lanjutan"}
                </span>
              </div>
              <span className="theme-number">DUNIA 0{i + 1}</span>
              <p lang="ar" dir="rtl" className="arabic">
                {ar}
              </p>
              <h2>{name}</h2>
              <p>{desc}</p>
              {i === 0 ? (
                <>
                  <ProgressBar
                    value={(progress.completed.length / 5) * 100}
                    label="Tema perkenalan"
                  />
                  <p className="text-sm">
                    {progress.completed.length}/5 misi selesai
                  </p>
                  <a className="btn" href="#misi-perkenalan">
                    Pilih misi <ArrowRight size={16} />
                  </a>
                </>
              ) : (
                <span className="unavailable">
                  <Lock size={14} /> Belum tersedia · 0 misi
                </span>
              )}
            </article>
          );
        })}
      </div>
      <section id="misi-perkenalan" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DUNIA 01 · التعارف</span>
            <h2>Senang berkenalan denganmu.</h2>
          </div>
          <p>
            Semua misi perkenalan dapat diakses.
            <br />
            Disarankan mulai dari menyimak.
          </p>
        </div>
        <MissionCards progress={progress} />
      </section>
    </div>
  );
}
export function LearnIndex() {
  return (
    <div className="container section">
      <PageTitle
        eyebrow="LEARNING ZONE"
        title="Bekal untuk setiap misimu."
        description="Pahami kosakata, temukan pola kalimat, lalu gunakan dalam latihan. Materi bahasa Arab fusha untuk pemula."
      />
      <MissionCards />
      <section className="section">
        <h2>Kamus kecil perkenalan</h2>
        <p className="muted">
          Transliterasi membantu memulai; gunakan teks Arab dan contoh suara
          untuk berlatih.
        </p>
        <Vocabulary />
      </section>
    </div>
  );
}
function Vocabulary() {
  return (
    <div className="vocab-grid">
      {vocabulary.map(([ar, id, latin]) => (
        <div className="vocab-item" key={ar}>
          <strong className="arabic" lang="ar" dir="rtl">
            {ar}
          </strong>
          <span>{id}</span>
          <small>{latin}</small>
        </div>
      ))}
    </div>
  );
}
export function Lesson({ id }: { id: string }) {
  const m = missions.find((m) => m.id === id)!;
  const { progress } = useProgress();
  const Icon = id === "final" ? Trophy : icons[m.skill];
  return (
    <div className="container section lesson">
      <Link href="/learn" className="text-link">
        <ChevronLeft size={17} /> Semua materi
      </Link>
      <PageTitle
        eyebrow={`LEARNING ZONE · ${id === "final" ? "EVALUASI AKHIR" : skillNames[m.skill].toUpperCase()}`}
        title={m.title}
        description={m.objective}
      />
      <div className="lesson-meta">
        <span>
          <Icon size={18} />
          {m.arabic}
        </span>
        <span>Pemula · A1 dasar</span>
        <span>
          <Clock size={16} />
          {m.minutes} menit
        </span>
        <span>5 aktivitas</span>
      </div>
      <div className="two-column lesson-columns">
        <article>
          <div className="card">
            <h2>Kenali polanya</h2>
            <p>{m.lesson}</p>
            <div className="reading-box">
              <p lang="ar" dir="rtl" className="arabic">
                {m.example}
              </p>
              <p className="translation">{m.translation}</p>
            </div>
            <Speech text={m.example} />
          </div>
          <div className="card mt-6">
            <h2>Kosakata inti</h2>
            <Vocabulary />
          </div>
        </article>
        <aside>
          <div className="card sticky-card">
            <span className="skill-icon">
              <Icon />
            </span>
            <h3>Siap menerima tantangan?</h3>
            <p>Lima aktivitas untuk mencoba apa yang sudah kamu pelajari.</p>
            <ul className="check-list">
              <li>
                <CheckCircle2 /> Umpan balik setiap jawaban
              </li>
              <li>
                <CheckCircle2 /> Hingga 50 XP aktivitas
              </li>
              <li>
                <CheckCircle2 /> Bonus lulus {id === "final" ? 50 : 25} XP
              </li>
            </ul>
            <Link
              className="btn"
              href={
                progress.finalized.includes(id)
                  ? `/result/${id}`
                  : `/challenge/${id}`
              }
            >
              {progress.finalized.includes(id)
                ? "Lihat hasil"
                : "Mulai tantangan"}
              <ArrowRight size={17} />
            </Link>
            <p className="text-sm muted">
              Lulus: minimal 80% dan semua refleksi mandiri selesai. XP
              aktivitas dan bonus hanya diberikan sekali.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
function SkillProgress() {
  const { progress } = useProgress();
  return (
    <div className="skill-progress">
      {(["listening", "speaking", "reading", "writing"] as Skill[]).map((s) => {
        const m = missions.find((m) => m.id === s)!;
        const n = m.activities.filter((a) =>
          progress.earned.includes(a.id),
        ).length;
        const Icon = icons[s];
        return (
          <div key={s}>
            <div className="flex items-center justify-between mb-2">
              <span className="flex gap-2 items-center">
                <Icon size={17} />
                {skillNames[s]}
              </span>
              <span className="text-sm">{n}/5</span>
            </div>
            <ProgressBar value={(n / 5) * 100} label={skillNames[s]} />
          </div>
        );
      })}
      <p className="text-sm muted">
        Indikator aktivitas berhasil, bukan sertifikasi kemampuan. Berbicara dan
        tulisan bebas mencakup penilaian mandiri.
      </p>
    </div>
  );
}
export function Rewards() {
  const { progress, ready } = useProgress();
  const badges = badgesOf(progress);
  return (
    <div className="container section">
      <PageTitle
        eyebrow="REWARDS"
        title="Setiap usaha punya cerita."
        description="Pencapaian ini tumbuh dari aktivitas yang kamu selesaikan. Yuk, buka badge pertamamu."
      />
      {!ready ? (
        <p>Memuat pencapaian…</p>
      ) : (
        <>
          <Stats />
          <div className="section-heading mt-12">
            <h2>Koleksi badge</h2>
            <span className="muted">{badges.length} dari 6 terbuka</span>
          </div>
          <div className="badge-grid">
            {badgeDefs.map((b, i) => (
              <div
                key={b.id}
                className={`card badge-card ${badges.includes(b.id) ? "earned" : "unearned"}`}
              >
                <div className="badge-medal">
                  {i === 5 ? <Trophy size={36} /> : <ShieldCheck size={36} />}
                </div>
                <span className="mini-tag">
                  {badges.includes(b.id) ? "Berhasil diraih" : "Belum diraih"}
                </span>
                <h3>{b.name}</h3>
                <p>{b.criterion}</p>
              </div>
            ))}
          </div>
          <section className="section">
            <h2>Misi yang telah selesai</h2>
            {progress.completed.length ? (
              <div className="badge-chips">
                {missions
                  .filter((m) => progress.completed.includes(m.id))
                  .map((m) => (
                    <Link key={m.id} href={`/result/${m.id}`}>
                      <CheckCircle2 size={17} />
                      {m.title}
                    </Link>
                  ))}
              </div>
            ) : (
              <p className="muted">
                Belum ada misi selesai.{" "}
                <Link className="text-link" href="/missions">
                  Mulai perjalananmu →
                </Link>
              </p>
            )}
          </section>
          <div className="card">
            <h3>Aturan XP yang transparan</h3>
            <p>
              10 XP per aktivitas berhasil, bonus 25 XP per misi utama yang
              lulus, dan 50 XP untuk evaluasi akhir yang lulus. Total maksimal
              400 XP. Pengulangan dapat memperbaiki hasil, tetapi aktivitas dan
              misi yang sama tidak memberi hadiah dua kali.
            </p>
            <p className="text-sm muted">
              Level: Explorer 0 · Word Hunter 80 · Sentence Builder 160 · Arabic
              Communicator 260 · Mission Master 350 XP. Badge Mission Master
              tetap memerlukan kelulusan seluruh misi.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
export function MyProgress() {
  const { progress, ready, reset } = useProgress();
  const { user } = useAuth();
  const results = Object.entries(progress.results);
  return (
    <div className="container section">
      <PageTitle
        eyebrow="MY PROGRESS"
        title="Lihat seberapa jauh kamu melangkah."
        description={user ? "Progres, XP, badge, dan hasil misi tersimpan pada akunmu dan dapat dilanjutkan dari perangkat lain." : "Progres sementara tersimpan di browser ini. Masuk atau daftar untuk menyinkronkan perjalanan belajarmu antarperangkat."}
      />
      {!ready ? (
        <p>Memuat progres…</p>
      ) : (
        <>
          <Stats />
          {!progress.earned.length && !results.length && <Empty />}
          <div className="two-column mt-8">
            <div className="card">
              <h2>Perkembangan keterampilan</h2>
              <SkillProgress />
            </div>
            <div className="card">
              <h2>Langkah berikutnya</h2>
              {missions
                .filter((m) => !progress.results[m.id]?.passed)
                .map((m) => (
                  <Link
                    className="recommend"
                    href={`/learn/${m.id}`}
                    key={m.id}
                  >
                    <BookOpen size={18} />
                    <span>
                      {progress.results[m.id] ? `Ulangi: ${m.title}` : m.title}
                      <small>
                        {progress.results[m.id]
                          ? `Skor terakhir ${progress.results[m.id].score}% · baca kembali materi`
                          : "Belum lulus · materi tersedia"}
                      </small>
                    </span>
                    <ArrowRight size={17} />
                  </Link>
                ))}
              {missions.every((m) => progress.results[m.id]?.passed) && (
                <p>
                  Hebat, semua misi lulus! Ulangi dialog tanpa melihat teks
                  untuk latihan tambahan.
                </p>
              )}
            </div>
          </div>
          <section className="section">
            <h2>Riwayat latihan</h2>
            <p className="text-sm muted">
              Skor mencakup soal berkunci dan refleksi mandiri. Ditampilkan
              maksimal 50 percobaan terakhir.
            </p>
            {progress.history.length ? (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Misi</th>
                      <th>Skor</th>
                      <th>Waktu lokal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {progress.history.map((h, i) => (
                      <tr key={`${h.date}-${i}`}>
                        <td>
                          <Link href={`/result/${h.mission}`}>
                            {missions.find((m) => m.id === h.mission)?.title}
                          </Link>
                        </td>
                        <td>{h.score}%</td>
                        <td>{new Date(h.date).toLocaleString("id-ID")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="muted">
                Riwayat akan muncul setelah kamu mengirim hasil misi.
              </p>
            )}
          </section>
          <div className="reset-panel">
            <div>
              <h3>{user ? "Progres tersimpan di akun" : "Progres sementara di browser"}</h3>
              <p>
                {user
                  ? "Progres akun disimpan melalui server Arabic Mission dan dapat dibuka kembali setelah login dari perangkat lain. Rekaman suara tidak disimpan bersama progres."
                  : "Progres ini hanya tersimpan di browser saat ini. Masuk atau daftar agar XP, badge, hasil misi, dan progres dapat disinkronkan antarperangkat. Rekaman suara tidak disimpan bersama progres."}
              </p>
            </div>
            <button className="btn danger" onClick={reset}>
              <RotateCcw size={16} /> Reset progres
            </button>
          </div>
        </>
      )}
    </div>
  );
}
export function ResultPage({ id }: { id: string }) {
  const { progress, ready, update } = useProgress();
  const router = useRouter();
  const m = missions.find((m) => m.id === id)!;
  const r = progress.results[id];
  const index = missions.findIndex((m) => m.id === id);
  if (!ready) return <div className="container section">Memuat hasil…</div>;
  if (!r)
    return (
      <div className="container section">
        <PageTitle
          eyebrow="MISSION RESULT"
          title="Hasilmu belum tersedia."
          description="Selesaikan lima aktivitas lalu kirim hasil untuk melihat pencapaian."
        />
        <Link className="btn" href={`/challenge/${id}`}>
          Buka tantangan <ArrowRight />
        </Link>
      </div>
    );
  return (
    <div className="container section result">
      <div className="card result-card">
        <div className={`result-medal ${r.passed ? "" : "retry"}`}>
          {r.passed ? <Trophy size={48} /> : <Compass size={48} />}
        </div>
        <span className="eyebrow">MISSION RESULT</span>
        <h1>
          {r.passed
            ? "Misi berhasil ditaklukkan!"
            : "Satu langkah lebih paham."}
        </h1>
        <p>{m.title}</p>
        <div className="result-stats">
          <div>
            <strong>{r.score}%</strong>
            <span>Skor percobaan ini</span>
          </div>
          <div>
            <strong>+{r.xp} XP</strong>
            <span>Bonus misi baru</span>
          </div>
          <div>
            <strong>
              {m.activities.filter((a) => progress.earned.includes(a.id))
                .length * 10}{" "}
              XP
            </strong>
            <span>Aktivitas unik terkumpul</span>
          </div>
        </div>
        <p>
          {r.passed
            ? "Kamu telah memenuhi syarat kelulusan. Teruskan petualanganmu!"
            : "Target kelulusan: 80% dan semua refleksi lisan / tulisan terpenuhi. Baca penjelasan, lalu coba lagi."}
        </p>
        <p className="text-sm muted">
          XP aktivitas diberikan saat menjawab benar, satu kali per aktivitas.
          Skor berbicara dan menulis bebas menggunakan rubrik mandiri.
        </p>
        {r.newBadges.length > 0 && (
          <div className="badge-chips">
            {r.newBadges.map((b) => (
              <span key={b}>
                <Star size={17} />
                {badgeDefs.find((x) => x.id === b)?.name}
              </span>
            ))}
          </div>
        )}
        <div className="result-review">
          {m.activities.map((a) => {
            const ans = r.answers[a.id];
            return (
              <details key={a.id}>
                <summary>
                  {ans?.correct ? "✓" : "○"} {a.prompt}
                </summary>
                <p>{a.explanation}</p>
              </details>
            );
          })}
        </div>
        <div className="actions justify-center">
          {index < 4 && (
            <Link className="btn" href={`/learn/${missions[index + 1].id}`}>
              Misi berikutnya <ArrowRight size={17} />
            </Link>
          )}
          <button
            className="btn secondary"
            onClick={() => {
              update((p) => ({
                ...p,
                last: id,
                finalized: p.finalized.filter((x) => x !== id),
                drafts: { ...p.drafts, [id]: {} },
              }));
              router.push(`/challenge/${id}`);
            }}
          >
            <RotateCcw size={17} /> Ulangi misi
          </button>
        </div>
        <Link className="text-link mt-6" href="/missions">
          <ChevronLeft size={16} /> Kembali ke Mission Map
        </Link>
      </div>
    </div>
  );
}
