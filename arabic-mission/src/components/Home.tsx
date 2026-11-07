import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Check,
  ShieldCheck,
  Sparkles,
  Map,
  Flag,
  Headphones,
  BookOpen,
  Star,
  Target,
} from "lucide-react";
import { SkillCard } from "./Ui";
export function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="hero-tag">
              <span /> PETUALANGAN BAHASA ARAB DIMULAI
            </span>
            <h1>
              Misi kecil.
              <br />
              Kemajuan besar.
              <br />
              <em>Bahasa Arab bisa!</em>
            </h1>
            <p>
              Kenali kata, bangun percakapan, dan taklukkan tantangan. Belajar
              bahasa Arab jadi perjalanan yang ingin kamu lanjutkan.
            </p>
            <div className="actions">
              <Link className="btn" href="/missions">
                Mulai Misi <ArrowRight size={18} />
              </Link>
              <Link className="btn secondary" href="/learn">
                Jelajahi Materi <BookOpen size={18} />
              </Link>
            </div>
            <div className="hero-notes">
              <span>
                <Check size={15} /> Tanpa akun
              </span>
              <span>
                <Check size={15} /> Untuk pemula
              </span>
              <span>
                <Check size={15} /> Belajar sesuai ritmemu
              </span>
            </div>
          </div>
          <div
            className="journey-art"
            aria-label="Ilustrasi peta perjalanan belajar menuju perkenalan bahasa Arab"
          >
            <div className="art-grid" />
            <span className="art-orbit orbit-one" />
            <span className="art-orbit orbit-two" />
            <div className="art-top">
              <Compass size={18} />
              <span>YOUR NEXT ADVENTURE</span>
              <span>01 / 08</span>
            </div>
            <div className="art-greeting">
              <span lang="ar" dir="rtl">
                مَرْحَبًا!
              </span>
              <p>Dunia baru dimulai dengan “halo”.</p>
            </div>
            <svg className="trail" viewBox="0 0 440 270" aria-hidden="true">
              <path
                d="M45 235 C220 245 160 120 285 155 S400 70 340 25"
                fill="none"
                stroke="#c8d9c6"
                strokeWidth="3"
                strokeDasharray="7 9"
              />
            </svg>
            <div className="map-stop stop-one">
              <BookOpen />
            </div>
            <div className="map-stop stop-two">
              <Headphones />
            </div>
            <div className="map-stop stop-three">
              <Flag />
            </div>
            <div className="art-mission">
              <span className="mini-tag">MISI PERTAMAMU</span>
              <h3 lang="ar" dir="rtl">
                التعارف
              </h3>
              <p>Kenalan dulu, yuk!</p>
              <span>
                4 keterampilan <span className="dot">•</span> 1 petualangan
              </span>
            </div>
            <div className="art-xp">
              <span className="gold-icon">
                <Star size={20} />
              </span>
              <div>
                <strong>Setiap langkah berarti</strong>
                <small>Selesaikan aktivitas, kumpulkan XP</small>
              </div>
            </div>
            <span className="art-spark spark-one">✦</span>
            <span className="art-spark spark-two">✧</span>
          </div>
        </div>
      </section>
      <div className="proof-strip">
        <div className="container">
          <span>
            <Compass /> 1 tema lengkap untuk mulai
          </span>
          <span>
            <Target /> 25 aktivitas interaktif
          </span>
          <span>
            <BookOpen /> 4 keterampilan bahasa
          </span>
          <span>
            <ShieldCheck /> Progres tersimpan di akun
          </span>
        </div>
      </div>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">EMPAT KETERAMPILAN, SATU PERJALANAN</span>
            <h2>Lebih dari sekadar hafal kata.</h2>
          </div>
          <p>
            Dengarkan, ucapkan, baca, dan tulis.
            <br />
            Bangun kemampuanmu selangkah demi selangkah.
          </p>
        </div>
        <div className="skill-grid">
          {(["listening", "speaking", "reading", "writing"] as const).map(
            (s) => (
              <SkillCard key={s} skill={s} />
            ),
          )}
        </div>
      </section>
      <section className="section container">
        <div className="map-preview">
          <div>
            <span className="eyebrow">PETA MISIMU</span>
            <h2>
              Setiap tema,
              <br />
              sebuah dunia baru.
            </h2>
            <p>
              Mulai dari perkenalan. Kuasai dasar-dasarnya, lalu bersiap
              menjelajahi lebih banyak cerita.
            </p>
            <Link className="text-link" href="/missions">
              Lihat Mission Map <ArrowRight size={17} />
            </Link>
          </div>
          <Link className="theme-feature" href="/missions">
            <span className="mini-tag">DUNIA 01 · TERSEDIA</span>
            <span className="arabic" dir="rtl" lang="ar">
              التعارف
            </span>
            <h3>Perkenalan</h3>
            <p>4 misi + evaluasi akhir</p>
            <span className="circle-arrow">
              <ArrowRight />
            </span>
          </Link>
          <div className="theme-next">
            <Map size={28} />
            <p lang="ar" dir="rtl" className="arabic">
              الأسرة
            </p>
            <h3>Keluarga</h3>
            <span className="muted text-sm">
              Tema lanjutan · belum tersedia
            </span>
          </div>
        </div>
      </section>
      <section className="section container">
        <div className="section-heading">
          <div>
            <span className="eyebrow">CARA BELAJAR</span>
            <h2>Langkah sederhana. Hasil bermakna.</h2>
          </div>
        </div>
        <div className="steps">
          {[
            [
              "01",
              "Pilih misimu",
              "Temukan tujuan belajar dan pelajari kosakata baru.",
            ],
            [
              "02",
              "Terima tantangan",
              "Latihan langsung dengan umpan balik yang membantumu.",
            ],
            [
              "03",
              "Rayakan kemajuan",
              "Kumpulkan XP, naik level, dan buka badge pencapaian.",
            ],
          ].map(([n, t, d]) => (
            <div key={n}>
              <span>{n}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container section">
        <div className="reward-banner">
          <div>
            <span className="eyebrow">KEMAJUANMU LAYAK DIRAYAKAN</span>
            <h2>
              Dari langkah pertama
              <br />
              menjadi Mission Master.
            </h2>
            <p>
              6 badge menantimu. Raih lewat latihan yang selesai,
              <br />
              bukan sekadar membuka halaman.
            </p>
            <Link className="btn light" href="/rewards">
              Kenali pencapaian <ArrowRight size={17} />
            </Link>
          </div>
          <div className="badge-art" aria-hidden="true">
            <div>
              <ShieldCheck size={62} />
            </div>
            <span>
              <Sparkles size={28} />
            </span>
            <p>LEARN · COMPLETE · LEVEL UP</p>
          </div>
        </div>
      </section>
    </>
  );
}
