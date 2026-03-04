import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const statusConfig = {
  Pemeriksaan: { bg: "#fef3c7", text: "#92400e", dot: "#f59e0b" },
  Banding: { bg: "#dbeafe", text: "#1e40af", dot: "#3b82f6" },
  Kasasi: { bg: "#ede9fe", text: "#5b21b6", dot: "#8b5cf6" },
  Inkracht: { bg: "#d1fae5", text: "#065f46", dot: "#10b981" },
};

function AnimatedNumber({ target, duration = 1500 }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress === 1) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{count.toLocaleString("id-ID")}</span>;
}

const putusanBadge = (val) => {
  if (!val || val === "Belum") return <span style={{ color: "#94a3b8", fontSize: 12 }}>—</span>;
  const colors = {
    Dikabulkan: { color: "#065f46", bg: "#d1fae5" },
    Ditolak: { color: "#991b1b", bg: "#fee2e2" },
    Dikuatkan: { color: "#1e40af", bg: "#dbeafe" },
    Dibatalkan: { color: "#92400e", bg: "#fef3c7" },
    Selesai: { color: "#065f46", bg: "#d1fae5" },
    Berlangsung: { color: "#92400e", bg: "#fef3c7" },
  };
  const c = colors[val] || { color: "#334155", bg: "#f1f5f9" };
  return <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 12, background: c.bg, color: c.color }}>{val}</span>;
};

export default function Home() {
  const [dataPerkara, setDataPerkara] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("Semua");
  const [page, setPage] = useState(1);
  const [heroVisible, setHeroVisible] = useState(false);
  const perPage = 6;

  useEffect(() => {
    setTimeout(() => setHeroVisible(true), 100);
    fetchPerkara();
  }, []);

  const fetchPerkara = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/perkara`);
      const data = await res.json();
      if (data.success) setDataPerkara(data.data);
    } catch (err) {
      console.error("Gagal fetch perkara:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = dataPerkara.filter((p) => {
    const q = search.toLowerCase();
    const matchSearch = q === "" || p.no_perkara?.toLowerCase().includes(q) || p.penggugat?.toLowerCase().includes(q) || p.tergugat?.toLowerCase().includes(q);
    const matchStatus = filterStatus === "Semua" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = [
    { label: "Total Perkara", value: dataPerkara.length, icon: "⚖️", sub: "Seluruh data tercatat" },
    { label: "Sedang Berjalan", value: dataPerkara.filter((p) => p.status === "Pemeriksaan").length, icon: "🔄", sub: "Aktif diproses" },
    { label: "Telah Inkracht", value: dataPerkara.filter((p) => p.status === "Inkracht").length, icon: "✅", sub: "Berkekuatan hukum tetap" },
    { label: "Proses Banding", value: dataPerkara.filter((p) => p.status === "Banding").length, icon: "📋", sub: "Sedang banding" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4ff" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #f0f4ff; overflow-x: hidden; }
        #root { overflow-x: hidden; }
        @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-ring { 0% { transform: scale(0.8); opacity: 0.5; } 100% { transform: scale(2); opacity: 0; } }
        @keyframes scroll-bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(6px); } }
        .fade-up { opacity: 0; transform: translateY(28px); transition: all 0.7s cubic-bezier(0.16,1,0.3,1); }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .d1{transition-delay:0.1s} .d2{transition-delay:0.2s} .d3{transition-delay:0.3s} .d4{transition-delay:0.45s} .d5{transition-delay:0.55s}
        .stat-card:hover { transform: translateY(-5px) !important; box-shadow: 0 20px 40px rgba(30,64,175,0.25) !important; }
        .row-hover:hover { background: #eff6ff !important; }
        .filter-btn:hover { opacity: 0.85; }
        .search-input:focus { outline: none; }
        .info-card:hover { background: rgba(255,255,255,0.12) !important; }

        /* Responsive Fixes */
        @media (max-width: 768px) { 
          .hero-title { font-size: 28px !important; } 
          .hero-subtitle { font-size: 13px !important; } 
          .stat-grid { grid-template-columns: repeat(2,1fr) !important; } 
          .info-grid { grid-template-columns: 1fr !important; } 
          .table-section { padding: 20px 12px !important; } 
          .filter-wrap { gap: 6px !important; } 
          .footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; } 
          .nav-menu { display: none !important; } 
          .hero-search { margin: 0 16px 32px !important; }
        }
          .footer-link {
        color: #94a3b8;
        text-decoration: none;
        font-size: 13px;
        transition: all 0.3s ease;
        display: block;
        margin-bottom: 10px;
      }
      .footer-link:hover {
        color: #60a5fa;
        transform: translateX(5px);
      }
      .footer-social:hover {
        transform: translateY(-3px);
        background: rgba(255, 255, 255, 0.15) !important;
      }
      `}</style>

      <Navbar />

      {/* HERO SECTION */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
          padding: "60px 0 0", // Padding horizontal 32px dihapus di sini agar wave bisa full width
          position: "relative",
          overflow: "hidden",
          marginLeft: "calc(-50vw + 50%)",
          marginRight: "calc(-50vw + 50%)",
          width: "100vw",
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(96,165,250,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 100, right: 200, width: 200, height: 200, borderRadius: "50%", background: "rgba(167,139,250,0.05)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 80, left: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(96,165,250,0.04)", pointerEvents: "none" }} />

        {/* --- PEMBUNGKUS KONTEN DENGAN PADDING --- */}
        <div style={{ padding: "0 24px", position: "relative", zIndex: 1 }}>
          {/* ANNOUNCEMENT BAR */}
          <div className={`fade-up ${heroVisible ? "visible" : ""}`} style={{ maxWidth: 860, margin: "0 auto 20px", display: "flex", justifyContent: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "rgba(96,165,250,0.12)",
                border: "1px solid rgba(96,165,250,0.25)",
                borderRadius: 30,
                padding: "7px 18px",
              }}
            >
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399", animation: "pulse-ring 1.5s infinite" }} />
              <span style={{ color: "#93c5fd", fontSize: 12, fontWeight: 600, letterSpacing: 0.5 }}>Data diperbarui secara real-time · {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* TITLE */}
          <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center", position: "relative" }}>
            <div
              className={`fade-up d1 ${heroVisible ? "visible" : ""}`}
              style={{
                display: "inline-block",
                background: "rgba(96,165,250,0.15)",
                border: "1px solid rgba(96,165,250,0.3)",
                borderRadius: 20,
                padding: "5px 16px",
                color: "#93c5fd",
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: 2,
                marginBottom: 20,
                textTransform: "uppercase",
              }}
            >
              Pemerintah Provinsi Kalimantan Timur
            </div>

            <h1 className={`fade-up d2 hero-title ${heroVisible ? "visible" : ""}`} style={{ color: "white", fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>
              Sistem Informasi Penelusuran
              <br />
              <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Perkara Tata Usaha Negara</span>
            </h1>

            <p className={`fade-up d3 hero-subtitle ${heroVisible ? "visible" : ""}`} style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 32px" }}>
              Akses informasi perkara TUN secara transparan dan real-time. Pantau status perkara dari tahap pemeriksaan hingga putusan berkekuatan hukum tetap.
            </p>

            {/* SEARCH BAR */}
            <div
              className={`fade-up d3 hero-search ${heroVisible ? "visible" : ""}`}
              style={{
                display: "flex",
                maxWidth: 600,
                margin: "0 auto 48px",
                background: "rgba(255,255,255,0.07)",
                borderRadius: 14,
                padding: 6,
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(12px)",
              }}
            >
              <input
                className="search-input"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Cari nomor perkara, penggugat, atau tergugat..."
                style={{ flex: 1, background: "transparent", border: "none", color: "white", padding: "10px 16px", fontSize: 14 }}
              />
              <button
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                  border: "none",
                  color: "white",
                  padding: "10px 24px",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.4)",
                }}
              >
                🔍 Cari
              </button>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className={`fade-up d4 stat-grid ${heroVisible ? "visible" : ""}`} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 900, margin: "0 auto 48px" }}>
            {stats.map((s, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 14,
                  padding: "20px 18px",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
                  transition: "transform 0.25s, box-shadow 0.25s",
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ color: "white", fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>
                  <AnimatedNumber target={s.value} />
                </div>
                <div style={{ color: "#93c5fd", fontSize: 12, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>

          {/* INFO STRIP */}
          <div
            className={`fade-up d5 info-grid ${heroVisible ? "visible" : ""}`}
            style={{
              maxWidth: 900,
              margin: "0 auto 0",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 12,
              paddingBottom: 0,
            }}
          >
            {[
              { icon: "🏛️", title: "Pengadilan TUN", desc: "Kalimantan Timur & Kalimantan Utara" },
              { icon: "📅", title: "Jadwal Sidang", desc: "Tersedia setiap hari kerja Senin–Jumat" },
              { icon: "📞", title: "Layanan Informasi", desc: "Hubungi kantor untuk informasi lebih lanjut" },
            ].map((item, i) => (
              <div
                key={i}
                className="info-card"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "14px 18px",
                  cursor: "default",
                  transition: "background 0.2s",
                }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{item.icon}</span>
                <div>
                  <div style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{item.title}</div>
                  <div style={{ color: "#94a3b8", fontSize: 11, marginTop: 2 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* --- AKHIR PEMBUNGKUS KONTEN --- */}

        {/* WAVE - Sekarang beneran Full Width melampaui konten */}
        <div style={{ marginTop: 40, lineHeight: 0, overflow: "hidden" }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff" />
          </svg>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div id="perkara" className="table-section" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: -0.3 }}>Data Penanganan Perkara TUN</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>{filtered.length} perkara ditemukan</p>
          </div>
          <div className="filter-wrap" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Semua", "Pemeriksaan", "Banding", "Kasasi", "Inkracht"].map((s) => (
              <button
                key={s}
                className="filter-btn"
                onClick={() => {
                  setFilterStatus(s);
                  setPage(1);
                }}
                style={{
                  padding: "7px 14px",
                  borderRadius: 8,
                  border: "1.5px solid",
                  fontSize: 12,
                  fontWeight: 600,
                  borderColor: filterStatus === s ? "#3b82f6" : "#e2e8f0",
                  background: filterStatus === s ? "#3b82f6" : "white",
                  color: filterStatus === s ? "white" : "#64748b",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 32px rgba(15,23,42,0.08)", border: "1px solid #e8f0fe" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}>
                  {["No", "No. Perkara", "Penggugat", "Tergugat", "Obyek Sengketa", "Persiapan", "Tk. I", "Banding", "Kasasi", "PK", "Status"].map((h) => (
                    <th key={h} style={{ padding: "14px 12px", color: "white", fontWeight: 700, fontSize: 11, textAlign: "left", textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} style={{ padding: "56px", textAlign: "center", color: "#94a3b8" }}>
                      Memuat data...
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, i) => (
                    <tr key={p.id} className="row-hover" style={{ background: i % 2 === 0 ? "white" : "#f8faff", borderBottom: "1px solid #f0f4ff" }}>
                      <td style={{ padding: "13px 12px", color: "#94a3b8" }}>{(page - 1) * perPage + i + 1}</td>
                      <td style={{ padding: "13px 12px", color: "#1d4ed8", fontWeight: 700 }}>{p.no_perkara}</td>
                      <td style={{ padding: "13px 12px" }}>{p.penggugat}</td>
                      <td style={{ padding: "13px 12px" }}>{p.tergugat}</td>
                      <td style={{ padding: "13px 12px", maxWidth: 180 }}>{p.obyek_sengketa}</td>
                      <td style={{ padding: "13px 12px" }}>{putusanBadge(p.tahap_persiapan)}</td>
                      <td style={{ padding: "13px 12px" }}>{putusanBadge(p.putusan_pertama)}</td>
                      <td style={{ padding: "13px 12px" }}>{putusanBadge(p.putusan_banding)}</td>
                      <td style={{ padding: "13px 12px" }}>{putusanBadge(p.putusan_kasasi)}</td>
                      <td style={{ padding: "13px 12px" }}>{putusanBadge(p.putusan_pk)}</td>
                      <td style={{ padding: "13px 12px" }}>
                        {statusConfig[p.status] && (
                          <span
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusConfig[p.status].bg, color: statusConfig[p.status].text }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusConfig[p.status].dot }} />
                            {p.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer
        style={{
          background: "linear-gradient(to bottom, #0f172a, #020617)",
          padding: "80px 24px 30px",
          marginTop: "50px",
          borderTop: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            className="footer-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "40px",
              marginBottom: "60px",
            }}
          >
            {/* Brand Section */}
            <div style={{ maxWidth: 320 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 22,
                    boxShadow: "0 8px 16px rgba(59,130,246,0.2)",
                  }}
                >
                  ⚖️
                </div>
                <div>
                  <div style={{ color: "white", fontWeight: 800, fontSize: 16, letterSpacing: "0.5px" }}>SIPP TUN</div>
                  <div style={{ color: "#60a5fa", fontSize: 11, fontWeight: 600, letterSpacing: "1px" }}>KALTIM & KALTARA</div>
                </div>
              </div>
              <p style={{ color: "#64748b", fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>Mewujudkan transparansi peradilan tata usaha negara yang akuntabel dan mudah diakses oleh seluruh lapisan masyarakat di Kalimantan.</p>
              <div style={{ display: "flex", gap: 12 }}>
                {["🌐", "📧", "📍"].map((icon, i) => (
                  <div
                    key={i}
                    className="footer-social"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "0.3s",
                    }}
                  >
                    {icon}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div>
              <h4 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 25, textTransform: "uppercase", letterSpacing: "1px" }}>Navigasi Cepat</h4>
              {["Beranda Utama", "Penelusuran Perkara", "Jadwal Sidang", "Statistik Perkara", "Prosedur Gugatan"].map((item) => (
                <a key={item} href="#" className="footer-link">
                  / {item}
                </a>
              ))}
            </div>

            {/* Office Info */}
            <div>
              <h4 style={{ color: "white", fontSize: 15, fontWeight: 700, marginBottom: 25, textTransform: "uppercase", letterSpacing: "1px" }}>Kantor Pusat</h4>
              <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
                <span style={{ fontSize: 18 }}>🏢</span>
                <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.5 }}>
                  <strong style={{ color: "#94a3b8" }}>PTUN Samarinda</strong>
                  <br />
                  Jl. Bung Tomo No.1, Sungai Keledang, Kec. Samarinda Seberang, Kota Samarinda, Kalimantan Timur 75131
                </p>
              </div>
              <div style={{ display: "flex", gap: 15 }}>
                <span style={{ fontSize: 18 }}>📞</span>
                <p style={{ color: "#64748b", fontSize: 13 }}>Layanan Informasi: (0541) 123456</p>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div
            style={{
              paddingTop: 30,
              borderTop: "1px solid rgba(255,255,255,0.05)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 15,
            }}
          >
            <p style={{ color: "#475569", fontSize: 12 }}>© 2026 Pemerintah Provinsi Kalimantan Timur. Hak Cipta Dilindungi.</p>
            <div style={{ display: "flex", gap: 20 }}>
              <span style={{ color: "#475569", fontSize: 12, cursor: "pointer" }}>Privacy Policy</span>
              <span style={{ color: "#475569", fontSize: 12, cursor: "pointer" }}>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
