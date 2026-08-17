# MinatIn — Dokumentasi Sistem

> **MinatIn** adalah platform digital yang membantu siswa SMK/SMA yang bingung menentukan tempat kuliah. Cukup dengan menjawab survei minat & bakat, sistem langsung memberikan rekomendasi kampus dan bidang studi yang paling cocok.
>
> Dibangun oleh tim **6xKu** pada tahun 2026.

---

## 1. Ringkasan (APA)

MinatIn adalah aplikasi web untuk membantu siswa menemukan jurusan dan kampus yang sesuai dengan minat serta bakat mereka.

**Cara paling sederhana memahaminya:**
Siswa menjawab serangkaian pertanyaan tentang kebiasaan, cara berpikir, dan hal yang disukai. Dari jawaban itu, sistem menghitung "kecenderungan" siswa ke dalam beberapa bidang, lalu menampilkan bidang yang paling dominan beserta daftar kampus yang relevan.

---

## 2. Latar Belakang & Masalah (KENAPA)

Banyak siswa SMK/SMA kebingungan saat harus memilih perguruan tinggi:

- Tidak tahu jurusan apa yang cocok dengan dirinya.
- Tidak tahu kampus mana yang menyediakan jurusan tersebut.
- Keputusan sering kali hanya ikut-ikutan teman atau pilihan orang tua, tanpa memahami minat sendiri.

MinatIn hadir untuk menjawab kebingungan itu dengan pendekatan yang sederhana dan cepat.

---

## 3. Target Pengguna (UNTUK SIAPA)

- **Utama:** siswa SMK/SMA yang akan melanjutkan ke perguruan tinggi.
- **Sekunder:** guru atau pembimbing (BK) yang ingin melihat gambaran minat siswa lewat dashboard.
- **Admin:** pihak yang mengelola data kampus dan melihat rekap hasil survei.

---

## 4. Cara Penggunaan (BAGAIMANA DIGUNAKAN)

Alur yang dijalani pengguna biasa (siswa):

1. Buka halaman beranda.
2. Klik tombol **"Ikut Survei"**.
3. Isi data singkat: nama *(opsional)*, kelas *(wajib)*, dan jurusan SMK *(wajib)*.
4. Jawab **25 pertanyaan** tentang kebiasaan dan preferensi pribadi.
5. Klik **"Selesai & Kirim"**.
6. Lihat hasil: bidang paling dominan, distribusi skor, dan daftar kampus rekomendasi.

Selain survei, pengguna juga bisa langsung **menjelajahi daftar kampus** beserta fitur pencariannya.

---

## 5. Fitur Utama

| Fitur | Keterangan |
|---|---|
| Survei Minat & Bakat | 25 pertanyaan dengan 4 pilihan jawaban tiap soal |
| Penilaian Otomatis | Skor dihitung otomatis ke 5 kategori bidang |
| Rekomendasi Kampus | Menampilkan kampus yang sesuai kategori dominan |
| Daftar Kampus | Katalog kampus lengkap dengan foto, lokasi, deskripsi, dan link website |
| Pencarian Kampus | Cari kampus berdasarkan nama atau lokasi |
| Dashboard Admin | Rekap hasil survei per jurusan, grafik, dan detail per siswa |
| Login | Halaman masuk untuk admin/dashboard |

---

## 6. Cara Kerja Sistem (BAGAIMANA BEKERJA)

### 6.1 Logika Penilaian Survei

Sistem membagi minat siswa ke dalam **5 kategori**:

| Kode | Kategori |
|---|---|
| `Tek` | Teknologi & Teknik |
| `Sen` | Seni & Desain Kreatif |
| `Sos` | Sosial & Komunikasi |
| `Bis` | Bisnis & Manajemen |
| `Jas` | Jasa, Pariwisata & Kesehatan |

- Setiap jawaban memiliki **poin** yang mengarah ke satu atau beberapa kategori.
- Contoh: jawaban yang menunjukkan cara berpikir logis akan menambah poin ke `Tek`, jawaban yang artistik menambah poin ke `Sen`, dan seterusnya.
- Setelah semua pertanyaan dijawab, sistem **menjumlahkan poin per kategori**.
- Kategori dengan **poin tertinggi** menjadi **bidang dominan** siswa.

### 6.2 Logika Rekomendasi Kampus

- Setiap kategori memiliki daftar **kata kunci** (misal kategori `Tek` memakai kata kunci "teknologi", "teknik", "informatika", "komputer").
- Sistem mencari kampus yang **nama atau keterangannya** mengandung kata kunci tersebut di database.
- Hasilnya ditampilkan sebagai **rekomendasi kampus** untuk siswa.

### 6.3 Penyimpanan Data

Setiap kali survei selesai, hasilnya disimpan ke database agar bisa dilihat kembali di dashboard, berisi: nama siswa, kelas, jurusan SMK, hasil kategori dominan, dan rincian skor.

---

## 7. Arsitektur & Teknologi (TEKNOLOGI)

Aplikasi terdiri dari dua bagian utama:

**Frontend (tampilan yang dilihat pengguna):**
- React + Vite — kerangka pembangun antarmuka.
- Tailwind CSS — untuk gaya/tampilan.
- Framer Motion — animasi halus.
- Swiper — carousel (geser) kampus di beranda.
- Recharts — grafik (diagram lingkaran) di dashboard.
- React Router — pengaturan navigasi antar halaman.

**Backend (mesin di balik layar):**
- Python + Flask — server yang memproses data.
- Flask-Login — mengelola sesi login.
- Flask-CORS — mengizinkan komunikasi antar domain.

**Database & penyimpanan:**
- Supabase — layanan database berbasis cloud (tempat menyimpan data kampus, akun pengguna, hasil survei) sekaligus tempat menyimpan foto kampus.

**Cara komunikasi frontend dan backend:**
Tampilan (frontend) berkomunikasi dengan server (backend) melalui **API**, yaitu jalur komunikasi yang digunakan aplikasi untuk meminta atau mengirim data.

**Hosting/deploy:**
- Frontend dan backend disiapkan untuk di-deploy ke **Vercel** (konfigurasi `vercel.json` ada di kedua sisi).
- Backend juga disiapkan untuk berjalan dengan **Gunicorn** (penyaji aplikasi Python di server).

---

## 8. Halaman Utama

| Halaman | Fungsi |
|---|---|
| `/` (Home) | Beranda: hero, tata cara survei, carousel kampus favorit, tentang kami |
| `/daftar-kampus` | Katalog & pencarian kampus |
| `/survei` | Form 25 pertanyaan + tampilan hasil |
| `/dashboard` | Rekap hasil survei (butuh login) |
| `/login` | Halaman masuk admin |

---

## 9. API / Backend

| Endpoint | Metode | Fungsi |
|---|---|---|
| `/` | GET | Cek status server |
| `/login` | POST | Masuk dengan username & password |
| `/logout` | POST | Keluar dari sesi |
| `/check-auth` | GET | Cek apakah pengguna masih login |
| `/dashboard` | GET | Penanda halaman dashboard (butuh login) |
| `/survei/submit` | POST | Menerima jawaban, menghitung skor, mengembalikan rekomendasi |

---

## 10. Database

Tabel utama yang digunakan:

| Tabel | Isi |
|---|---|
| `user` | Akun admin (username & password) |
| `kampus` | Data kampus: nama, lokasi, keterangan, website, foto |
| `hasil_survei` | Hasil survei: nama, kelas, jurusan SMK, hasil dominan, rincian skor |

Selain tabel, ada **storage bucket** bernama `foto_kampus` untuk menyimpan foto kampus.

---

## 11. Authentication (Cara Login)

- Pengguna masuk dengan **username** dan **password**.
- Sistem memeriksa kecocokan data dengan tabel `user` di database.
- Jika cocok, sistem membuat **sesi login** (cookie) sehingga pengguna bisa mengakses dashboard.
- Halaman dashboard hanya bisa diakses saat sudah login.

---

## 12. Layanan Eksternal

| Layanan | Peran |
|---|---|
| Supabase | Database + penyimpanan foto kampus |
| Vercel | Hosting frontend & backend |
| Gunicorn (Railway/Procfile) | Penyaji aplikasi backend di server |

---

## 13. Keunggulan Project

- **Kemudahan penggunaan:** alur sangat sederhana — buka situs → isi data singkat → jawab pertanyaan → dapat rekomendasi. Tidak perlu mendaftar akun untuk mengisi survei.
- **Otomatisasi:** penilaian dan rekomendasi dihitung otomatis oleh sistem. Tidak ada proses manual — siswa langsung mendapat hasil begitu survei selesai.
- **Personalisasi:** hasil disesuaikan dengan jawaban tiap siswa. Setiap orang mendapat kategori dominan dan rekomendasi yang berbeda sesuai profilnya.
- **Efisiensi:** proses dari survei sampai rekomendasi hanya butuh beberapa menit, jauh lebih cepat dibanding riset manual satu per satu.
- **Pengalaman pengguna (UX):** tampilan modern, responsif, dan penuh animasi halus (Framer Motion, Swiper) sehingga menyenangkan digunakan. Bahasa pertanyaan dibuat santai dan dekat dengan keseharian siswa.
- **Ada sisi analitik untuk sekolah:** dashboard menyajikan rekap minat siswa per jurusan lengkap dengan grafik, berguna bagi guru/BK untuk memahami kecenderungan siswa.
- **Mengenai penggunaan AI:** **belum ditemukan** penggunaan kecerdasan buatan (machine learning/LLM) dalam project ini. Rekomendasi dihasilkan dari **aturan skor tetap + pencocokan kata kunci**, bukan dari model AI. (Ini disampaikan jujur sesuai hasil pemeriksaan kode.)

---

## 14. Keterbatasan

Keterbatasan yang ditemukan dari hasil pemeriksaan kode:

- **Bukan sistem AI.** Rekomendasi memakai aturan skor tetap dan pencocokan kata kunci. Hasilnya cenderung sama untuk jawaban dengan kategori dominan yang sama, belum "belajar" dari data.
- **Rekomendasi masih kasar.** Kampus dicocokkan hanya lewat kata kunci di nama/keterangan kampus, bukan berdasarkan jurusan spesifik. (Ada file data `kampus_jurusan.csv` dan `master_jurusan.csv` yang sebenarnya menyimpan hubungan kampus–jurusan, tapi **belum dipakai di dalam kode**.)
- **Data kampus masih terbatas.** Saat ini data yang disiapkan hanya mencakup kampus di Bali (10 kampus).
- **Keamanan login masih lemah.** Password disimpan dan dibandingkan sebagai teks biasa (belum di-hash/dienkripsi). Kunci rahasia aplikasi juga punya nilai cadangan yang tertulis langsung di kode.
- **Akses antar-domain masih terbuka.** CORS diatur untuk mengizinkan semua asal (origin), yang kurang aman untuk produksi.
- **Belum ada pendaftaran akun (sign-up).** Akun admin harus dibuat manual ke database.
- **Survei cukup panjang.** 25 pertanyaan bisa terasa melelahkan bagi sebagian pengguna.
- **Belum dioptimalkan untuk pengguna dalam jumlah sangat besar.** Pencarian rekomendasi dilakukan lewat query database per permintaan, tanpa cache.

---

## 15. Pengembangan Selanjutnya

### Yang sudah tersedia (sudah berfungsi)

- Survei minat & bakat dengan penilaian otomatis.
- Rekomendasi kampus berdasarkan kategori dominan.
- Katalog dan pencarian kampus.
- Dashboard admin dengan grafik dan detail per siswa.
- Sistem login untuk mengakses dashboard.

### Yang direncanakan / dapat dikembangkan

- **Rekomendasi berbasis jurusan spesifik.** Data `kampus_jurusan.csv` dan `master_jurusan.csv` sudah disiapkan (65 jurusan di 10 kampus), tinggal diintegrasikan agar sistem bisa merekomendasikan **jurusan** secara langsung, bukan sekadar kata kunci.
- **Peningkatan keamanan login:** enkripsi password (hashing), hapus kunci cadangan dari kode, batasi CORS ke domain tertentu.
- **Pendaftaran akun** agar pengelola tidak perlu membuat akun manual.
- **Menyempurnakan rekomendasi** dengan algoritma yang lebih cerdas (misal pencocokan berbobot atau pendekatan AI) bila data sudah cukup.
- **Memperluas cakupan data kampus** ke luar Bali.
- **Optimalisasi untuk skala besar** (caching, pengindeksan pencarian).
- **Mempersingkat survei** atau membuat survei adaptif (pertanyaan menyesuaikan jawaban sebelumnya).

---

## 16. Kesimpulan

**Apa masalahnya?**
Banyak siswa SMK/SMA bingung menentukan jurusan dan kampus yang cocok dengan minat serta bakatnya.

**Apa solusinya?**
MinatIn — platform survei minat & bakat yang langsung memberikan rekomendasi kampus dan bidang studi secara otomatis.

**Bagaimana cara kerjanya?**
Siswa menjawab 25 pertanyaan. Sistem menjumlahkan poin ke 5 kategori bidang, menentukan kategori dominan, lalu mencari kampus yang relevan berdasarkan kata kunci kategori tersebut di database.

**Apa manfaatnya?**
Siswa mendapat panduan awal yang cepat dan personal tanpa riset manual; sekolah/guru juga mendapat gambaran minat siswa lewat dashboard.

**Apa potensi project ke depan?**
Sangat besar — dengan data jurusan yang sudah disiapkan, keamanan yang diperkuat, dan algoritma rekomendasi yang lebih cerdas, MinatIn bisa berkembang menjadi alat bantu penjurusan yang lengkap untuk sekolah-sekolah, bahkan nasional.
