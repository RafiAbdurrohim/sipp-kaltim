# SIPP TUN — Kalimantan Timur
Sistem Informasi Penelusuran Perkara Tata Usaha Negara

## 🚀 Cara Menjalankan

### Prasyarat
- Node.js versi 18 ke atas
- npm atau yarn

### Langkah-langkah

1. **Extract** file zip ini ke folder yang diinginkan

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Jalankan development server**
   ```bash
   npm run dev
   ```

4. **Buka browser** ke `http://localhost:5173`

---

## 🔐 Login Admin (Demo)
- **Username:** `admin`
- **Password:** `admin123`

---

## 📁 Struktur Project

```
src/
├── pages/
│   ├── Home.jsx              ← Halaman publik utama
│   ├── Login.jsx             ← Halaman login
│   └── admin/
│       ├── Dashboard.jsx     ← Dashboard admin
│       ├── Perkara.jsx       ← Manajemen data perkara
│       ├── TambahPerkara.jsx ← Form tambah perkara baru
│       └── EditPerkara.jsx   ← Form edit perkara
├── components/
│   ├── Navbar.jsx            ← Navbar publik
│   ├── AdminLayout.jsx       ← Layout sidebar admin
│   └── ProtectedRoute.jsx    ← Guard route admin
├── context/
│   └── AuthContext.jsx       ← State management auth
├── data/
│   └── perkara.js            ← Data dummy perkara
└── App.jsx                   ← Routing utama
```

---

## 🛠️ Tech Stack
- **React 18** + Vite
- **React Router DOM v6** — routing
- **Pure CSS-in-JS** — styling (tanpa library tambahan)

## 📌 Catatan
- Data saat ini masih **dummy/hardcode**
- Untuk production, sambungkan ke **API backend** (Node.js + Express + PostgreSQL)
- Login menggunakan **localStorage** sementara, ganti dengan JWT dari backend

---

© 2025 Pemerintah Provinsi Kalimantan Timur
