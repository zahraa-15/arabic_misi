import Link from "next/link";
import { Compass } from "lucide-react";
export default function NotFound() {
  return (
    <div className="container section empty">
      <Compass size={60} />
      <span className="eyebrow">404 · DI LUAR PETA</span>
      <h1>Sepertinya kita salah jalur.</h1>
      <p>
        Misi yang kamu cari tidak ditemukan. Ayo kembali ke jalur petualangan.
      </p>
      <Link className="btn" href="/">
        Kembali ke beranda
      </Link>
    </div>
  );
}
