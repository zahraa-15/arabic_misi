"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { emptyProgress, parseProgress, type Progress } from "@/lib/progress";
import { useAuth } from "./AuthProvider";

const KEY = "arabic-mission:v1";
const Context = createContext<{
  progress: Progress;
  ready: boolean;
  notice: string;
  update: (f: (p: Progress) => Progress) => void;
  reset: () => void;
} | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [progress, setProgress] = useState(emptyProgress);
  const [loadedIdentity, setLoadedIdentity] = useState<string | null>(null);
  const [migrateGuest, setMigrateGuest] = useState(false);
  const [notice, setNotice] = useState("");
  const identity = authLoading ? "loading" : user ? `user:${user.id}` : "guest";
  const ready = identity !== "loading" && loadedIdentity === identity;

  useEffect(() => {
    if (authLoading) return;
    let active = true;
    setLoadedIdentity(null);
    setMigrateGuest(false);

    async function load() {
      let next = emptyProgress();
      let storageNotice = "";
      if (user) {
        try {
          const response = await fetch("/api/progress", { cache: "no-store" });
          if (!response.ok) throw new Error("PROGRESS_LOAD_FAILED");
          const data = (await response.json()) as { progress?: Progress | null };
          if (data.progress) {
            next = parseProgress(JSON.stringify(data.progress));
          } else {
            // Import old anonymous browser progress into a newly used account.
            next = parseProgress(localStorage.getItem(KEY));
            if (active) setMigrateGuest(true);
          }
        } catch {
          next = parseProgress(localStorage.getItem(KEY));
          storageNotice = "Progres akun belum dapat dimuat dari server. Data lokal sementara ditampilkan.";
        }
      } else {
        try {
          const raw = localStorage.getItem(KEY);
          next = parseProgress(raw);
          if (
            raw &&
            raw !== JSON.stringify(emptyProgress()) &&
            JSON.stringify(next) === JSON.stringify(emptyProgress())
          ) {
            storageNotice = "Progres tersimpan tidak terbaca. Kamu bisa mulai kembali.";
          }
        } catch {
          storageNotice = "Penyimpanan browser tidak tersedia. Progres hanya berlaku selama halaman ini terbuka.";
        }
      }
      if (active) {
        setProgress(next);
        setNotice(storageNotice);
        setLoadedIdentity(identity);
      }
    }

    void load();
    return () => {
      active = false;
    };
  }, [authLoading, identity, user]);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(async () => {
      if (!user) {
        try {
          localStorage.setItem(KEY, JSON.stringify(progress));
        } catch {
          setNotice("Progres tidak dapat disimpan. Jangan tutup halaman sebelum selesai.");
        }
        return;
      }
      try {
        const response = await fetch("/api/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ progress }),
        });
        if (!response.ok) throw new Error("PROGRESS_SAVE_FAILED");
        if (migrateGuest) {
          try { localStorage.removeItem(KEY); } catch { /* Ignore unavailable browser storage. */ }
          setMigrateGuest(false);
        }
        setNotice("");
      } catch {
        setNotice("Sinkronisasi akun tertunda. Periksa koneksi internet sebelum meninggalkan halaman.");
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [migrateGuest, progress, ready, user]);

  const update = useCallback((f: (p: Progress) => Progress) => setProgress(f), []);

  function reset() {
    if (
      window.confirm(
        user
          ? "Hapus seluruh XP, badge, hasil, dan progres pada akun ini? Tindakan ini tidak dapat dibatalkan."
          : "Hapus seluruh XP, badge, hasil, dan progres di browser ini? Tindakan ini tidak dapat dibatalkan.",
      )
    ) {
      setProgress(emptyProgress());
      setNotice("Progres berhasil direset. Siap untuk perjalanan baru!");
    }
  }

  return (
    <Context.Provider value={{ progress, ready, notice, update, reset }}>
      {children}
    </Context.Provider>
  );
}

export function useProgress() {
  const ctx = useContext(Context);
  if (!ctx) throw Error("ProgressProvider missing");
  return ctx;
}
