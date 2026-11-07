# Arabic Mission — Dynamic Edition

**Your Mission, Your Arabic Journey.**

Arabic Mission adalah website pembelajaran bahasa Arab fusha untuk pemula. Paket ini mengembangkan website Next.js yang sebelumnya statis menjadi aplikasi dengan akun pengguna dan penyimpanan progres lintas perangkat.

## Fitur

- Seluruh halaman, desain, materi, aktivitas, dan gamifikasi dari versi statis tetap dipertahankan.
- Registrasi, login, logout, dan session cookie HttpOnly.
- Password di-hash menggunakan `scrypt` pada server Vercel.
- Data pengguna, progres, XP, badge, hasil misi, dan log disimpan di Google Sheets.
- Google Apps Script bertindak sebagai backend database.
- Vercel API Routes menjadi perantara server-side agar secret Apps Script tidak pernah dikirim ke browser.
- Progres anonim dari versi statis dapat diimpor ke akun saat akun belum memiliki progres database.

## Teknologi

- Next.js 16 + React 19 + TypeScript
- Vercel (hosting + API routes)
- Google Apps Script (backend)
- Google Sheets (database)

## Mulai lokal

Gunakan Node.js 22 LTS atau lebih baru.

```bash
npm ci
copy .env.example .env.local
```

Isi `.env.local` dengan URL Apps Script, secret Apps Script, dan session secret. Kemudian:

```bash
npm run dev
```

Buka `http://localhost:3000`.

## Pemeriksaan

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Struktur tambahan

```text
apps-script/Code.gs                 Google Apps Script API
src/app/api/auth/                   Register, login, logout, session check
src/app/api/progress/               Baca dan simpan progres akun
src/lib/server/                     Helper Apps Script dan session/password
src/components/AuthProvider.tsx     State autentikasi
src/components/AuthForms.tsx        Form login dan registrasi
database/ArabicMission_Database_Template.xlsx
 database/schema.json
 docs/SETUP_DYNAMIC.md              Tutorial lengkap CMD, Google Sheets, Apps Script, GitHub, Vercel
```

## Panduan instalasi

Baca [`docs/SETUP_DYNAMIC.md`](docs/SETUP_DYNAMIC.md) dari awal sampai akhir.

## Penting

- Template Excel adalah template kosong, bukan database online yang otomatis tersinkron ke GitHub.
- Database aktif berada di Google Sheets dan harus dijaga privat.
- Jangan commit `.env.local`, API secret, session secret, atau data pengguna.
- Versi ini belum mencakup dashboard admin, verifikasi email, dan reset password.
