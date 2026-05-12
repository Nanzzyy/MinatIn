# MinatIn 🎓

> *Temukan kampus impianmu berdasarkan minat dan bakatmu!*

**MinatIn** adalah platform digital interaktif yang dirancang untuk membantu siswa/i menentukan langkah selanjutnya dalam pendidikan tinggi. Seringkali siswa merasa bingung dalam memilih jurusan dan kampus. MinatIn hadir dengan solusi cerdas: cukup dengan menjawab serangkaian pertanyaan survei terkait minat dan bakat, sistem kami akan langsung memberikan **rekomendasi kampus dan bidang studi** yang paling sesuai dengan profilmu!

---

## ✨ Fitur Utama

- **Survei Minat & Bakat Berbasis Poin**: Algoritma cerdas yang menghitung skor berdasarkan preferensi siswa pada berbagai bidang (Teknologi, Seni, Sosial, Bisnis, Jasa).
- **Rekomendasi Kampus Otomatis**: Integrasi dengan database untuk memberikan rekomendasi instan dan relevan berdasarkan hasil survei pengguna.
- **Visualisasi Hasil (Grafik)**: Menyediakan visualisasi skor minat bakat untuk pemahaman yang lebih baik dan interaktif.
- **Sistem Akun Pengguna**: Fitur autentikasi dan login yang aman didukung oleh Supabase.
- **Desain UI/UX Modern & Responsif**: Antarmuka memukau yang dibangun dengan React dan Tailwind CSS untuk pengalaman pengguna terbaik di semua perangkat (Mobile & Desktop).

---

## 🛠️ Tech Stack

Proyek ini dibangun menggunakan teknologi web modern:

**Frontend:**
- **[React.js](https://reactjs.org/)** (v18)
- **[Vite](https://vitejs.dev/)** - Build tool super cepat
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework CSS untuk styling yang responsif
- **[React Router DOM](https://reactrouter.com/)** - Manajemen navigasi (SPA)
- **[Framer Motion](https://www.framer.com/motion/)** - Transisi dan animasi halus
- **[Recharts](https://recharts.org/)** - Render grafik data survei
- **[Swiper](https://swiperjs.com/)** - Komponen slider karosel

**Backend:**
- **[Python](https://www.python.org/)** (dengan micro-framework **Flask**)
- **[Supabase](https://supabase.com/)** (Database PostgreSQL & Client SDK)
- **Flask-Login** & **Flask-CORS** untuk manajemen sesi dan lintas domain.

---

## 📂 Struktur Direktori Proyek

```text
MinatIn/
├── backend-python/       # API Server & Logika Bisnis
│   ├── app.py            # Entry point aplikasi (Routing & Logika)
│   ├── question.json     # Bank soal pertanyaan survei
│   └── requirements.txt  # Daftar dependensi Python 
│
└── frontend-react/       # Antarmuka Pengguna Utama
    ├── src/
    │   ├── components/   # Komponen UI (Navbar, Footer, Card, dll.)
    │   ├── pages/        # Halaman utama (Home, Survei, Daftar Kampus)
    │   └── assets/       # Gambar, icon, dan font statis
    ├── package.json      # Dependensi Node.js
    ├── tailwind.config.js# Aturan dan tema CSS
    └── vite.config.js    # Konfigurasi Vite
```

---

## 🚀 Panduan Instalasi Lokal

Ingin menjalankan proyek ini di komputermu? Ikuti langkah-langkah berikut:

### Prasyarat:
1. **Node.js** (versi 18 atau lebih baru)
2. **Python** (versi 3.8 atau lebih baru)
3. Akun **[Supabase](https://supabase.com/)** dengan skema tabel yang sudah disiapkan (`user`, `hasil_survei`, `kampus`).

### 1. Setup Backend (API Python)
Buka terminal dan masuk ke direktori backend:
```bash
cd backend-python
```

Buat *virtual environment* dan aktifkan:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

Instal dependensi Python:
```bash
pip install -r requirements.txt
```

Buat file `.env` di dalam folder `backend-python` dan isi dengan kredensial Supabase milikmu:
```env
SUPABASE_URL=url_project_supabase_anda
SUPABASE_ANON_KEY=anon_key_project_supabase_anda
FLASK_SECRET_KEY=kunci_rahasia_untuk_sesi
```

Jalankan server backend:
```bash
python app.py
```
*(Server backend akan berjalan di `http://localhost:5000`)*

### 2. Setup Frontend (React App)
Buka terminal baru dan masuk ke direktori frontend:
```bash
cd frontend-react
```

Instal paket dependensi Node.js:
```bash
npm install
```

Jalankan server pengembangan:
```bash
npm run dev
```
*(Aplikasi React akan berjalan di `http://localhost:5173`)*

Akses URL tersebut di browsermu dan nikmati aplikasinya!
