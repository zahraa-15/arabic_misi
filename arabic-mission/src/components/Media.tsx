"use client";
import { useEffect, useRef, useState } from "react";
import { Volume2, Pause, RotateCcw, Mic, Square } from "lucide-react";
export function Speech({ text }: { text: string }) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!("speechSynthesis" in window)) {
      const timer = setTimeout(
        () =>
          setError(
            "Browser ini tidak mendukung text-to-speech. Gunakan teks alternatif.",
          ),
        0,
      );
      return () => clearTimeout(timer);
    }
    const refresh = () =>
      setVoices(
        window.speechSynthesis
          .getVoices()
          .filter((v) => v.lang.startsWith("ar")),
      );
    const timer = setTimeout(refresh, 0);
    window.speechSynthesis.addEventListener("voiceschanged", refresh);
    return () => {
      clearTimeout(timer);
      window.speechSynthesis.removeEventListener("voiceschanged", refresh);
      window.speechSynthesis.cancel();
    };
  }, []);
  function play() {
    if (!voices.length) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voices[0].lang;
    u.voice = voices[0];
    u.rate = 0.8;
    u.onstart = () => setStatus("playing");
    u.onend = () => setStatus("idle");
    u.onerror = (e) => {
      setStatus("idle");
      if (e.error !== "interrupted" && e.error !== "canceled")
        setError(
          "Suara gagal diputar. Coba lagi atau gunakan teks alternatif.",
        );
    };
    setError("");
    synth.speak(u);
  }
  function pause() {
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
    } else {
      window.speechSynthesis.pause();
      setStatus("paused");
    }
  }
  return (
    <div className="audio-box">
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn small" onClick={play} disabled={!voices.length}>
          <Volume2 size={17} /> Putar suara
        </button>
        <button
          className="icon-btn"
          aria-label={status === "paused" ? "Lanjutkan audio" : "Jeda audio"}
          disabled={status === "idle"}
          onClick={pause}
        >
          <Pause size={18} />
        </button>
        <button
          className="icon-btn"
          aria-label="Putar ulang audio"
          disabled={!voices.length}
          onClick={play}
        >
          <RotateCcw size={18} />
        </button>
        <span className="muted text-sm">
          {status === "playing"
            ? "Sedang diputar…"
            : status === "paused"
              ? "Dijeda"
              : "TTS bahasa Arab"}
        </span>
      </div>
      <p className="text-sm muted" role="status">
        {error ||
          (!voices.length
            ? "Suara Arab belum tersedia. Aktifkan paket suara Arab di perangkat, atau gunakan transkrip sebagai latihan alternatif."
            : "Suara mengikuti perangkat. Beberapa penyedia TTS mungkin memerlukan internet.")}
      </p>
      <details>
        <summary>Transkrip / alternatif tanpa audio</summary>
        <p lang="ar" dir="rtl" className="arabic">
          {text}
        </p>
      </details>
    </div>
  );
}
export function Recorder() {
  const [state, setState] = useState("idle");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const recorder = useRef<MediaRecorder | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      if (timer.current) clearTimeout(timer.current);
      if (recorder.current?.state === "recording") recorder.current.stop();
      stream.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);
  useEffect(
    () => () => {
      if (url) URL.revokeObjectURL(url);
    },
    [url],
  );
  async function start() {
    if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
      setMessage(
        "Rekaman tidak didukung. Gunakan HTTPS atau localhost, atau berlatih lisan tanpa rekaman.",
      );
      return;
    }
    setState("request");
    setMessage("Izinkan mikrofon untuk merekam di perangkat ini.");
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (!alive.current) {
        s.getTracks().forEach((t) => t.stop());
        return;
      }
      stream.current = s;
      const r = new MediaRecorder(s);
      recorder.current = r;
      const chunks: BlobPart[] = [];
      r.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      r.onstop = () => {
        s.getTracks().forEach((t) => t.stop());
        recorder.current = null;
        if (timer.current) clearTimeout(timer.current);
        if (alive.current) {
          setUrl(URL.createObjectURL(new Blob(chunks, { type: r.mimeType })));
          setState("idle");
          setMessage(
            "Dengarkan ulang dan periksa menggunakan rubrik. Rekaman hilang saat meninggalkan halaman.",
          );
        }
      };
      r.onerror = () => {
        setMessage("Rekaman gagal. Coba ulang atau berlatih tanpa rekaman.");
        s.getTracks().forEach((t) => t.stop());
        setState("idle");
      };
      r.start();
      setState("recording");
      setMessage("Merekam… maksimum 60 detik.");
      timer.current = setTimeout(() => {
        if (r.state === "recording") r.stop();
      }, 60000);
    } catch {
      stream.current?.getTracks().forEach((t) => t.stop());
      setState("idle");
      setMessage(
        "Mikrofon ditolak atau tidak tersedia. Kamu tetap dapat latihan lisan dan mengisi rubrik mandiri.",
      );
    }
  }
  return (
    <div className="audio-box">
      <p className="font-semibold">Studio latihan suara</p>
      <p className="text-sm muted">
        Rekaman opsional, hanya di perangkat. Tidak diunggah dan tidak dinilai
        AI.
      </p>
      <button
        className="btn secondary small"
        disabled={state === "request"}
        onClick={() =>
          state === "recording" ? recorder.current?.stop() : start()
        }
      >
        {state === "recording" ? <Square size={16} /> : <Mic size={16} />}{" "}
        {state === "recording"
          ? "Hentikan rekaman"
          : state === "request"
            ? "Menunggu izin…"
            : "Izinkan mikrofon & rekam"}
      </button>
      <p role="status" className="text-sm muted">
        {message}
      </p>
      {url && <audio aria-label="Rekaman latihan kamu" controls src={url} />}
    </div>
  );
}
