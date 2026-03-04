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
      `}</style>

      <Navbar />

      {/* HERO */}
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)",
          padding: "60px 32px 0",
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

          <h1 className={`fade-up d2 ${heroVisible ? "visible" : ""}`} style={{ color: "white", fontSize: 42, fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: -0.5 }}>
            Sistem Informasi Penelusuran
            <br />
            <span style={{ background: "linear-gradient(90deg, #60a5fa, #a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Perkara Tata Usaha Negara</span>
          </h1>

          <p className={`fade-up d3 ${heroVisible ? "visible" : ""}`} style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.7, maxWidth: 540, margin: "0 auto 32px" }}>
            Akses informasi perkara TUN secara transparan dan real-time. Pantau status perkara dari tahap pemeriksaan hingga putusan berkekuatan hukum tetap.
          </p>

          {/* SEARCH BAR */}
          <div
            className={`fade-up d3 ${heroVisible ? "visible" : ""}`}
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
        <div className={`fade-up d4 ${heroVisible ? "visible" : ""}`} style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, maxWidth: 900, margin: "0 auto 48px" }}>
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
          className={`fade-up d5 ${heroVisible ? "visible" : ""}`}
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

        {/* WAVE */}
        {/* WAVE */}
        <div style={{ marginTop: 40, lineHeight: 0, overflow: "hidden" }}>
          <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 80 }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f0f4ff" />
          </svg>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div id="perkara" style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: "#0f172a", letterSpacing: -0.3 }}>Data Penanganan Perkara TUN</h2>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>
              Pembaruan: {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {filtered.length} perkara
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
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
                  cursor: "pointer",
                  transition: "all 0.2s",
                  borderColor: filterStatus === s ? "#3b82f6" : "#e2e8f0",
                  background: filterStatus === s ? "#3b82f6" : "white",
                  color: filterStatus === s ? "white" : "#64748b",
                  boxShadow: filterStatus === s ? "0 4px 12px rgba(59,130,246,0.25)" : "none",
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
                  {["No", "No. Perkara", "Penggugat", "Tergugat", "Obyek Sengketa", "Thn. Persiapan", "Tk. Pertama", "Banding", "Kasasi", "PK", "Status"].map((h) => (
                    <th key={h} style={{ padding: "14px 12px", color: "white", fontWeight: 700, fontSize: 11, textAlign: "left", letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={11} style={{ padding: "56px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>⏳</div>Memuat data...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={11} style={{ padding: "56px", textAlign: "center", color: "#94a3b8" }}>
                      <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>Tidak ada data perkara yang sesuai
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, i) => (
                    <tr key={p.id} className="row-hover" style={{ background: i % 2 === 0 ? "white" : "#f8faff", borderBottom: "1px solid #f0f4ff", transition: "background 0.15s" }}>
                      <td style={{ padding: "13px 12px", color: "#94a3b8", fontWeight: 600 }}>{(page - 1) * perPage + i + 1}</td>
                      <td style={{ padding: "13px 12px", color: "#1d4ed8", fontWeight: 700, whiteSpace: "nowrap", fontSize: 12 }}>{p.no_perkara}</td>
                      <td style={{ padding: "13px 12px", color: "#1e293b", fontWeight: 500 }}>{p.penggugat}</td>
                      <td style={{ padding: "13px 12px", color: "#1e293b", fontWeight: 500 }}>{p.tergugat}</td>
                      <td style={{ padding: "13px 12px", color: "#475569", maxWidth: 180, lineHeight: 1.5 }}>{p.obyek_sengketa}</td>
                      <td style={{ padding: "13px 12px", textAlign: "center" }}>{putusanBadge(p.tahap_persiapan)}</td>
                      <td style={{ padding: "13px 12px", textAlign: "center" }}>{putusanBadge(p.putusan_pertama)}</td>
                      <td style={{ padding: "13px 12px", textAlign: "center" }}>{putusanBadge(p.putusan_banding)}</td>
                      <td style={{ padding: "13px 12px", textAlign: "center" }}>{putusanBadge(p.putusan_kasasi)}</td>
                      <td style={{ padding: "13px 12px", textAlign: "center" }}>{putusanBadge(p.putusan_pk)}</td>
                      <td style={{ padding: "13px 12px" }}>
                        {statusConfig[p.status] && (
                          <span
                            style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusConfig[p.status].bg, color: statusConfig[p.status].text }}
                          >
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusConfig[p.status].dot, display: "inline-block" }} />
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

          <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f4ff", background: "#fafbff" }}>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>
              Halaman {page} dari {totalPages || 1} · {filtered.length} perkara
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", color: page === 1 ? "#cbd5e1" : "#1d4ed8", fontWeight: 600, fontSize: 12, cursor: page === 1 ? "default" : "pointer" }}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    border: "1.5px solid",
                    borderColor: page === n ? "#3b82f6" : "#e2e8f0",
                    background: page === n ? "#3b82f6" : "white",
                    color: page === n ? "white" : "#64748b",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    boxShadow: page === n ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: "1.5px solid #e2e8f0",
                  background: "white",
                  color: page === totalPages || totalPages === 0 ? "#cbd5e1" : "#1d4ed8",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: page === totalPages || totalPages === 0 ? "default" : "pointer",
                }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: "linear-gradient(135deg, #0f172a, #1e3a8a)", padding: "48px 32px 28px", marginTop: 24 }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          {/* Top */}
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 40, paddingBottom: 32, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            {/* Brand */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, background: "linear-gradient(135deg, #60a5fa, #a78bfa)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚖️</div>
                <div>
                  <div style={{ color: "white", fontWeight: 700, fontSize: 14 }}>SIPP TUN</div>
                  <div style={{ color: "#60a5fa", fontSize: 10, letterSpacing: 1 }}>KALIMANTAN TIMUR</div>
                </div>
              </div>
              <p style={{ color: "#64748b", fontSize: 13, lineHeight: 1.7, maxWidth: 280 }}>Sistem Informasi Penelusuran Perkara Tata Usaha Negara Provinsi Kalimantan Timur. Transparansi data untuk keadilan yang lebih baik.</p>
            </div>
            {/* Links */}
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Navigasi</div>
              {["Beranda", "Data Perkara", "Jadwal Sidang", "Statistik"].map((item) => (
                <div key={item} style={{ color: "#64748b", fontSize: 13, marginBottom: 8, cursor: "pointer" }} onMouseEnter={(e) => (e.target.style.color = "#93c5fd")} onMouseLeave={(e) => (e.target.style.color = "#64748b")}>
                  {item}
                </div>
              ))}
            </div>
            {/* Info */}
            <div>
              <div style={{ color: "white", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>Informasi</div>
              {[
                { icon: "🏛️", text: "PTUN Samarinda" },
                { icon: "📅", text: "Senin – Jumat" },
                { icon: "🕐", text: "08.00 – 16.00 WITA" },
                { icon: "📍", text: "Kalimantan Timur" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", fontSize: 13, marginBottom: 8 }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Bottom */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ color: "#64748b", fontSize: 12 }}>© 2025 Pemerintah Provinsi Kalimantan Timur · Hak Cipta Dilindungi</div>
            <div style={{ color: "#64748b", fontSize: 12 }}>Dikembangkan untuk transparansi peradilan TUN 🔵</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
