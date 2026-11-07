# Panduan Mengaktifkan Arabic Mission Dinamis

Panduan ini menggunakan arsitektur berikut:

- **Frontend:** Next.js 16 + React 19, tetap memakai desain dan materi Arabic Mission yang sudah ada.
- **Hosting dan API perantara:** Vercel. API route Vercel menyimpan session dan meneruskan permintaan ke Apps Script.
- **Backend database:** Google Apps Script Web App.
- **Database:** Google Sheets dengan tab `Users`, `UserProgress`, `MissionResults`, dan `ActivityLogs`.

> Penting: Google Sheets adalah database aktif. File Excel yang ada di folder `database/` hanya template kosong untuk membuat Google Sheets. Jangan memasukkan data pengguna asli ke GitHub.

## A. Persiapan

1. Instal **Node.js 22 LTS atau lebih baru** dari https://nodejs.org/.
2. Instal Git dari https://git-scm.com/.
3. Siapkan akun Google, GitHub, dan Vercel.
4. Ekstrak ZIP proyek ke folder yang mudah ditemukan, misalnya `C:\Projects\arabic-mission`.

## B. Membuat Google Sheets database

1. Buka Google Drive.
2. Upload `database/ArabicMission_Database_Template.xlsx`.
3. Klik kanan file tersebut → **Open with → Google Sheets**. Jika diminta, simpan/konversi sebagai Google Sheets.
4. Beri nama spreadsheet, misalnya `Arabic Mission Database`.
5. Pastikan terdapat empat tab: `Users`, `UserProgress`, `MissionResults`, dan `ActivityLogs`.
6. Buka **Extensions → Apps Script**. Apps Script yang dibuat dari spreadsheet ini akan terikat ke database tersebut.

## C. Memasang kode Google Apps Script

1. Di Apps Script, buka file `Code.gs`.
2. Hapus kode contoh yang ada.
3. Buka file proyek `apps-script/Code.gs`, salin seluruh isinya, lalu tempel ke editor Apps Script.
4. Klik **Save**.
5. Dari dropdown fungsi, pilih `setupDatabase`, lalu klik **Run**.
6. Berikan izin yang diminta Google. Fungsi ini menyimpan ID spreadsheet dan memastikan empat tab serta header database tersedia.
7. Jika muncul peringatan aplikasi belum diverifikasi, lanjutkan hanya pada akun Google milikmu sendiri dan pastikan kode yang ditempel memang kode proyek ini.

### Membuat API secret Apps Script

1. Di Apps Script, buka **Project Settings** (ikon roda gigi).
2. Cari bagian **Script Properties** → **Add script property**.
3. Isi nama property: `API_SECRET`.
4. Isi nilainya dengan string acak minimal 32 karakter. Buat dari CMD/terminal menggunakan:

```bat
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

5. Simpan nilai itu di tempat aman. Nilai yang sama nanti dipasang sebagai `APPS_SCRIPT_SECRET` di Vercel dan `.env.local`.
6. Jangan menaruh secret tersebut di source code frontend, file publik, screenshot, atau repository GitHub.

## D. Deploy Apps Script sebagai Web App

1. Klik **Deploy → New deployment**.
2. Klik ikon gear / Select type → pilih **Web app**.
3. Description: `Arabic Mission API`.
4. **Execute as:** `Me`.
5. **Who has access:** `Anyone`.
6. Klik **Deploy**, selesaikan otorisasi, lalu salin URL Web App yang berakhiran `/exec`.
7. Simpan URL tersebut. URL akan dipakai sebagai `APPS_SCRIPT_URL`.

Mengapa akses Web App diset `Anyone`? Karena API Vercel perlu menghubungi Apps Script tanpa login Google pengguna. Akses data tetap diperiksa dengan `API_SECRET` yang hanya disimpan di server Vercel dan Apps Script. Jangan pernah mengirim secret ke browser.

Jika mengubah kode Apps Script setelah deployment, buka **Deploy → Manage deployments → Edit → New version → Deploy** agar versi Web App ikut diperbarui.

## E. Menyiapkan proyek di laptop melalui CMD

Buka CMD, lalu masuk ke folder proyek. Contoh:

```bat
cd /d C:\Projects\arabic-mission
npm ci
```

Buat file environment lokal:

```bat
copy .env.example .env.local
notepad .env.local
```

Isi tiga variabel berikut:

```env
APPS_SCRIPT_URL=https://script.google.com/macros/s/ID_DEPLOYMENT_KAMU/exec
APPS_SCRIPT_SECRET=SECRET_YANG_SAMA_DENGAN_SCRIPT_PROPERTIES
SESSION_SECRET=SECRET_ACAK_LAIN_YANG_BERBEDA_DARI_API_SECRET
```

Buat `SESSION_SECRET` yang berbeda dari API secret dengan perintah CMD yang sama:

```bat
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

Simpan `.env.local`, kemudian jalankan:

```bat
npm run dev
```

Buka `http://localhost:3000`. Coba buat akun melalui tombol **Daftar**. Setelah berhasil:

- satu baris pengguna baru muncul di tab `Users`;
- cookie session dibuat oleh server (HttpOnly);
- ketika progres berubah, progres disimpan ke tab `UserProgress`;
- hasil misi tersimpan ke `MissionResults`;
- aktivitas registrasi, login, dan simpan progres dicatat di `ActivityLogs`.

Hentikan server lokal dengan `Ctrl + C`.

## F. Mengunggah proyek ke GitHub

Buat repository baru di GitHub, lalu dari CMD jalankan:

```bat
git init
git add .
git commit -m "Add Arabic Mission dynamic backend"
git branch -M main
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

Ganti URL remote sesuai repository milikmu. Jika repository sudah ada dan sudah terhubung, cukup:

```bat
git add .
git commit -m "Add Arabic Mission dynamic backend"
git push
```

**Jangan pernah menjalankan `git add .env.local` atau mengunggah file `.env.local`.** File tersebut sudah dikecualikan melalui `.gitignore`. File `.env.example` aman diunggah karena hanya berisi contoh placeholder.

## G. Deploy ke Vercel

1. Login ke https://vercel.com/.
2. Klik **Add New → Project**.
3. Import repository GitHub Arabic Mission.
4. Framework akan terdeteksi sebagai Next.js. Build command gunakan `npm run build`.
5. Sebelum deploy, buka **Environment Variables** dan tambahkan tiga variabel berikut:

| Name | Value |
|---|---|
| `APPS_SCRIPT_URL` | URL Web App Apps Script yang berakhiran `/exec` |
| `APPS_SCRIPT_SECRET` | Nilai `API_SECRET` yang disimpan di Script Properties |
| `SESSION_SECRET` | Secret acak lain, minimal 32 karakter |

6. Pilih environment **Production**, dan tambahkan juga ke **Preview** jika ingin menguji deployment preview.
7. Klik **Deploy**.
8. Setelah deploy selesai, buka domain Vercel dan tes daftar, login, logout, serta progres.

Jika menambahkan atau mengubah Environment Variables setelah deployment, lakukan **Redeploy** agar nilainya digunakan oleh deployment baru.

## H. Alur penggunaan

1. Pengunjung membuka halaman Arabic Mission.
2. Pengunjung mendaftar dengan nama, email, dan password.
3. Password diproses menggunakan `scrypt` di server Vercel. Password asli tidak disimpan di Google Sheets.
4. Vercel membuat session bertanda tangan dan menyimpannya sebagai cookie `HttpOnly`.
5. Saat pengguna belajar, progres dikirim ke API Vercel dan diteruskan ke Apps Script.
6. Apps Script menyimpan progres sesuai `user_id`, bukan berdasarkan browser.
7. Pengguna dapat logout lalu login kembali dari perangkat lain untuk melanjutkan progres akun.

Jika browser sudah memiliki progres anonim dari versi statis sebelumnya, progres lokal akan diimpor ke akun ketika akun tersebut belum memiliki progres tersimpan. Jika akun sudah memiliki progres di database, progres database yang digunakan.

## I. Pemeriksaan dan troubleshooting

### Pendaftaran menampilkan “Periksa konfigurasi backend”

- Pastikan `APPS_SCRIPT_URL` benar dan berakhiran `/exec`.
- Pastikan `APPS_SCRIPT_SECRET` sama persis dengan Script Property `API_SECRET`.
- Pastikan fungsi `setupDatabase()` sudah berhasil dijalankan.
- Pastikan Web App sudah dideploy dengan akses `Anyone`.
- Jika kode Apps Script baru diubah, deploy versi baru.

### Error `DATABASE_NOT_INITIALIZED` atau `SHEET_NOT_FOUND`

Jalankan `setupDatabase()` dari editor Apps Script yang dibuka melalui spreadsheet database yang benar.

### Akun bisa dibuat, tetapi progres tidak tersimpan

Pastikan tab `UserProgress`, `MissionResults`, dan `ActivityLogs` ada. Periksa juga eksekusi Apps Script di menu **Executions**.

### Login gagal setelah mengubah Apps Script

Pastikan kolom tab `Users` tidak diubah urutannya. Nama dan urutan header harus sesuai template. Jangan mengedit nilai `password_salt` atau `password_hash` secara manual.

### Vercel masih menggunakan konfigurasi lama

Periksa Environment Variables pada project Vercel, lalu lakukan Redeploy. Environment lokal `.env.local` tidak otomatis masuk ke Vercel.

## J. Catatan keamanan dan batas versi ini

- Cookie session memakai `HttpOnly`, `SameSite=Lax`, `Secure` saat production, dan masa berlaku tujuh hari.
- Password di-hash dengan `scrypt` di server Vercel; secret Apps Script tidak dikirim ke frontend.
- Jangan membuka akses Google Sheets database ke publik. Bagikan hanya kepada pengelola yang memang membutuhkan akses.
- Role `student` dan `admin` sudah disediakan pada kolom database, tetapi dashboard admin dan manajemen materi/soal belum dibuat pada paket awal ini.
- Progres dan hasil belajar tetap mengikuti aturan penilaian frontend Arabic Mission yang ada. Ini bukan sistem ujian berintegritas tinggi; pengguna teknis masih dapat memodifikasi data progres di browser.
- Google Apps Script dan Google Sheets cocok untuk prototipe, kelas, atau jumlah pengguna kecil hingga menengah. Untuk trafik besar, kebutuhan transaksi kompleks, atau audit yang ketat, pertimbangkan database khusus seperti PostgreSQL/Supabase.
- Belum tersedia fitur lupa password/email verification. Tambahkan sebelum digunakan untuk layanan publik berskala besar.
