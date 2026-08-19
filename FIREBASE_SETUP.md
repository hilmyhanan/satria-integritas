# Panduan Setup Firebase (Leaderboard Online) ☁️🏆

Saat ini seluruh data 51 soal KPK sudah tertanam langsung dengan aman di dalam sistem lokal. Namun, agar klasemen sementara (*Live Leaderboard*) dan klasemen akhir bisa terhubung secara **online antar-seluruh perangkat yang memindai QR Code di booth**, Anda perlu menggunakan **Firebase Firestore**. 

Karena konfigurasi ini membutuhkan akun Google Anda, ikuti langkah-langkah manual berikut ini yang sangat mudah:

## Tahap 1: Membuat Proyek Firebase
1. Buka browser dan pergi ke situs **[Firebase Console](https://console.firebase.google.com/)**. Login menggunakan akun Google Anda.
2. Klik tombol besar **"Create a project"** (Buat proyek).
3. Beri nama proyek Anda, misalnya `satria-integritas-kuis`.
4. (Opsional) Matikan Google Analytics jika tidak diperlukan agar lebih cepat, lalu klik **"Create project"**.
5. Tunggu beberapa detik hingga proyek selesai dibuat, lalu klik **"Continue"**.

## Tahap 2: Mendaftarkan Aplikasi Web
1. Di halaman utama *dashboard* proyek Anda, cari ikon bergambar lambang web **`</>`** (berada di bawah tulisan *Get started by adding Firebase to your app*) dan klik ikon tersebut.
2. Beri nama julukan aplikasi Anda (misal: `kuis-web`), lalu klik **"Register app"**.
3. Firebase akan menampilkan sebuah blok kode konfigurasi yang bernama `firebaseConfig`.
4. Salin (*copy*) seluruh bagian yang berada di dalam kurung kurawal `{ ... }` dari `firebaseConfig` tersebut. Kodenya akan terlihat kurang lebih seperti ini:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyB-xxxxxxxxxxxxxxxxxxx",
     authDomain: "satria-integritas.firebaseapp.com",
     projectId: "satria-integritas",
     storageBucket: "satria-integritas.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:xxxxxxxxxxxx"
   };
   ```

## Tahap 3: Memasukkan Kode ke Dalam Proyek
1. Buka *source code* game Anda menggunakan Visual Studio Code.
2. Cari dan buka file **`src/firebase.js`**.
3. Ganti bagian `firebaseConfig` yang kosong di baris ke-5 dengan kode yang baru saja Anda salin dari Firebase.
   ```javascript
   const firebaseConfig = {
      // PASTE KODE ANDA DI SINI
      apiKey: "AIzaSy...",
      // ... dan seterusnya
   };
   ```
4. Simpan file (`Ctrl + S`).

## Tahap 4: Mengaktifkan Firestore Database
Terakhir, Anda harus menyiapkan *database* agar aplikasi diizinkan untuk menyimpan skor.
1. Kembali ke **Firebase Console** di browser.
2. Di menu sebelah kiri, cari bagian **Build** dan klik **Firestore Database**.
3. Klik tombol **"Create database"**.
4. Akan muncul *popup*. Biarkan lokasinya *default*, lalu klik **"Next"**.
5. Pilih **"Start in test mode"** (Mulai dalam mode pengujian) agar aplikasi bisa langsung menulis data tanpa perlu login, lalu klik **"Enable"**.
6. Selesai! Kini *Live Leaderboard* Anda sudah *online* 100%!

> **Catatan Keamanan:**
> *Test mode* mengizinkan siapa saja untuk membaca/menulis selama 30 hari ke depan. Hal ini sudah sangat cukup dan aman untuk keperluan acara *booth* Anda. Setelah acara selesai, tidak perlu khawatir karena akses akan tertutup secara otomatis oleh Firebase.
