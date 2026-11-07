"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ArrowRight, Compass, LoaderCircle, ShieldCheck } from "lucide-react";
import { useAuth } from "./AuthProvider";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Tidak dapat masuk.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthFrame eyebrow="WELCOME BACK" title="Lanjutkan misi belajarmu." subtitle="Masuk untuk membuka kembali progres, XP, badge, dan hasil latihan yang tersimpan di akunmu.">
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-field">
          <span>Email</span>
          <input type="email" autoComplete="email" required maxLength={150} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" />
        </label>
        <label className="auth-field">
          <span>Password</span>
          <input type="password" autoComplete="current-password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Masukkan password" />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="btn auth-submit" type="submit" disabled={busy}>
          {busy ? <LoaderCircle className="spin" size={17} /> : <ArrowRight size={17} />}
          {busy ? "Memeriksa akun..." : "Masuk ke Arabic Mission"}
        </button>
      </form>
      <p className="auth-switch">Belum punya akun? <Link href="/register">Daftar gratis</Link></p>
    </AuthFrame>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Konfirmasi password belum sama.");
      return;
    }
    setBusy(true);
    try {
      await register(name, email, password);
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran belum berhasil.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthFrame eyebrow="START YOUR JOURNEY" title="Buat akun pertamamu." subtitle="Simpan perjalanan belajar bahasa Arab dan lanjutkan dari perangkat mana pun dengan akun yang sama.">
      <form className="auth-form" onSubmit={submit}>
        <label className="auth-field">
          <span>Nama lengkap</span>
          <input type="text" autoComplete="name" required minLength={2} maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="Nama kamu" />
        </label>
        <label className="auth-field">
          <span>Email</span>
          <input type="email" autoComplete="email" required maxLength={150} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" />
        </label>
        <label className="auth-field">
          <span>Password <small>(minimal 8 karakter)</small></span>
          <input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Buat password" />
        </label>
        <label className="auth-field">
          <span>Ulangi password</span>
          <input type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={confirm} onChange={(event) => setConfirm(event.target.value)} placeholder="Ulangi password" />
        </label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        <button className="btn auth-submit" type="submit" disabled={busy}>
          {busy ? <LoaderCircle className="spin" size={17} /> : <ArrowRight size={17} />}
          {busy ? "Membuat akun..." : "Buat akun gratis"}
        </button>
      </form>
      <p className="auth-switch">Sudah punya akun? <Link href="/login">Masuk di sini</Link></p>
    </AuthFrame>
  );
}

function AuthFrame({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="auth-wrap container">
      <div className="auth-card card">
        <div className="auth-mark"><Compass size={25} /></div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
        <div className="auth-privacy"><ShieldCheck size={16} /><span>Password dienkripsi sebelum disimpan. Jangan gunakan password yang sama dengan akun penting lainnya.</span></div>
      </div>
    </section>
  );
}
