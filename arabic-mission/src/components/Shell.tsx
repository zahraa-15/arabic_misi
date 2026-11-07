"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Compass, Menu, X, ArrowUpRight, Sparkles } from "lucide-react";
import { useProgress } from "./ProgressProvider";
import { useAuth } from "./AuthProvider";
import { xpOf } from "@/lib/progress";
const nav = [
  ["/missions", "Peta Misi"],
  ["/learn", "Materi"],
  ["/dashboard", "Dashboard"],
  ["/rewards", "Pencapaian"],
  ["/progress", "Progres"],
];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const { progress, ready, notice } = useProgress();
  const { user, loading: authLoading, logout } = useAuth();
  const [accountBusy, setAccountBusy] = useState(false);
  async function handleLogout() {
    setAccountBusy(true);
    try {
      await logout();
      setOpen(false);
    } catch {
      // Keep the current session UI if the logout request fails.
    } finally {
      setAccountBusy(false);
    }
  }
  return (
    <>
      <a className="skip" href="#main">
        Lewati ke konten
      </a>
      <header className="header">
        <div className="container nav">
          <Link href="/" className="brand" aria-label="Arabic Mission beranda">
            <span className="logo">
              <Compass size={26} />
            </span>
            <span>
              arabic<span className="brand-light">mission</span>
              <small>LEARN. EXPLORE. GROW.</small>
            </span>
          </Link>
          <nav
            aria-label="Navigasi utama"
            className={open ? "nav-links open" : "nav-links"}
          >
            {nav.map(([href, label]) => (
              <Link
                onClick={() => setOpen(false)}
                aria-current={path === href ? "page" : undefined}
                className={path === href ? "active" : ""}
                key={href}
                href={href}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="nav-right">
            <span className="xp-pill">
              <Sparkles size={15} />
              {ready ? xpOf(progress) : "—"} XP
            </span>
            {!authLoading && (user ? (
              <div className="account-actions">
                <span className="account-name" title={user.name}>{user.name}</span>
                <button className="btn secondary small account-logout" onClick={() => void handleLogout()} disabled={accountBusy}>
                  {accountBusy ? "Keluar..." : "Keluar"}
                </button>
              </div>
            ) : (
              <div className="account-actions">
                <Link className="btn secondary small" href="/login">Masuk</Link>
                <Link className="btn small account-register" href="/register">Daftar</Link>
              </div>
            ))}
            <button
              className="mobile-toggle icon-btn"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-label={open ? "Tutup menu" : "Buka menu"}
            >
              {open ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      {notice && (
        <div role="status" className="notice container">
          {notice}
        </div>
      )}
      <main id="main">{children}</main>
      <footer>
        <div className="container footer-grid">
          <div>
            <Link className="brand" href="/">
              <Compass />
              <span>arabic mission</span>
            </Link>
            <p>Your Mission, Your Arabic Journey.</p>
            <p className="text-sm">
              Langkah kecil hari ini. Percakapan baru esok hari.
            </p>
          </div>
          <div>
            <strong>Jelajahi perjalananmu</strong>
            <div className="footer-links">
              {nav.map(([h, l]) => (
                <Link key={h} href={h}>
                  {l}
                  <ArrowUpRight size={14} />
                </Link>
              ))}
            </div>
          </div>
          <div>
            <strong>Perjalanan belajar tersimpan</strong>
            <p className="text-sm">
              Masuk ke akunmu untuk menyimpan XP, badge, hasil misi, dan progres
              agar dapat dilanjutkan dari perangkat lain.
            </p>
            <Link href={user ? "/progress" : "/register"} className="text-link">
              {user ? "Lihat progres belajar →" : "Buat akun gratis →"}
            </Link>
          </div>
        </div>
        <div className="container footer-bottom">
          Arabic Mission · Bahasa Arab fusha untuk pemula{" "}
          <span>Dibuat untuk langkah pertamamu.</span>
        </div>
      </footer>
    </>
  );
}
