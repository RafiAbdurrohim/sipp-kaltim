import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const statusConfig = {
  Pemeriksaan: { bg: "#fef3c7", text: "#92400e" },
  Banding: { bg: "#dbeafe", text: "#1e40af" },
  Kasasi: { bg: "#ede9fe", text: "#5b21b6" },
  Inkracht: { bg: "#d1fae5", text: "#065f46" },
};

export default function AdminPerkara() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const perPage = 7;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/perkara`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Gagal fetch:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/perkara/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setData((d) => d.filter((p) => p.id !== id));
      setDeleteId(null);
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  const filtered = data.filter((p) => {
    const q = search.toLowerCase();
    return q === "" || p.no_perkara?.toLowerCase().includes(q) || p.penggugat?.toLowerCase().includes(q) || p.tergugat?.toLowerCase().includes(q);
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <AdminLayout>
      <div style={{ padding: "32px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0f172a", letterSpacing: -0.3 }}>Manajemen Perkara</h1>
            <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>Kelola seluruh data perkara tata usaha negara</p>
          </div>
          <Link to="/admin/perkara/tambah">
            <button
              style={{
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                border: "none",
                color: "white",
                padding: "11px 22px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
              }}
            >
              + Tambah Perkara
            </button>
          </Link>
        </div>

        <div style={{ background: "white", borderRadius: 12, padding: "16px 20px", marginBottom: 20, boxShadow: "0 2px 12px rgba(15,23,42,0.05)", border: "1px solid #e8f0fe" }}>
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="🔍  Cari nomor perkara, penggugat, atau tergugat..."
            style={{ width: "100%", border: "1.5px solid #e2e8f0", borderRadius: 8, padding: "9px 14px", fontSize: 13, outline: "none" }}
            onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
            onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
          />
        </div>

        <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 4px 20px rgba(15,23,42,0.06)", border: "1px solid #e8f0fe" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8)" }}>
                  {["No", "No. Perkara", "Penggugat", "Tergugat", "Status", "Tgl. Daftar", "Aksi"].map((h) => (
                    <th key={h} style={{ padding: "13px 14px", color: "white", fontWeight: 700, fontSize: 11, textAlign: "left", letterSpacing: 0.4, textTransform: "uppercase", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>
                      ⏳ Memuat data...
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "48px", textAlign: "center", color: "#94a3b8" }}>
                      Tidak ada data ditemukan
                    </td>
                  </tr>
                ) : (
                  paginated.map((p, i) => (
                    <tr
                      key={p.id}
                      style={{ borderBottom: "1px solid #f0f4ff", background: i % 2 === 0 ? "white" : "#f8faff", transition: "background 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#eff6ff")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 0 ? "white" : "#f8faff")}
                    >
                      <td style={{ padding: "13px 14px", color: "#94a3b8", fontWeight: 600 }}>{(page - 1) * perPage + i + 1}</td>
                      <td style={{ padding: "13px 14px", color: "#1d4ed8", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap" }}>{p.no_perkara}</td>
                      <td style={{ padding: "13px 14px", color: "#1e293b", fontWeight: 500 }}>{p.penggugat}</td>
                      <td style={{ padding: "13px 14px", color: "#475569" }}>{p.tergugat}</td>
                      <td style={{ padding: "13px 14px" }}>
                        {statusConfig[p.status] && <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: statusConfig[p.status].bg, color: statusConfig[p.status].text }}>{p.status}</span>}
                      </td>
                      <td style={{ padding: "13px 14px", color: "#94a3b8", fontSize: 12, whiteSpace: "nowrap" }}>
                        {p.tgl_daftar ? new Date(p.tgl_daftar).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }) : "-"}
                      </td>
                      <td style={{ padding: "13px 14px" }}>
                        <div style={{ display: "flex", gap: 6 }}>
                          <Link to={`/admin/perkara/edit/${p.id}`}>
                            <button style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #3b82f6", background: "transparent", color: "#3b82f6", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>
                          </Link>
                          <button
                            onClick={() => setDeleteId(p.id)}
                            style={{ padding: "5px 12px", borderRadius: 6, border: "1.5px solid #ef4444", background: "transparent", color: "#ef4444", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #f0f4ff", background: "#fafbff" }}>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>
              Halaman {page} dari {totalPages || 1} · {filtered.length} data
            </span>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "6px 12px", borderRadius: 7, border: "1.5px solid #e2e8f0", background: "white", color: page === 1 ? "#cbd5e1" : "#1d4ed8", fontWeight: 600, fontSize: 12, cursor: page === 1 ? "default" : "pointer" }}
              >
                ← Prev
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    border: "1.5px solid",
                    borderColor: page === n ? "#3b82f6" : "#e2e8f0",
                    background: page === n ? "#3b82f6" : "white",
                    color: page === n ? "white" : "#64748b",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages || totalPages === 0}
                style={{
                  padding: "6px 12px",
                  borderRadius: 7,
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

        {deleteId && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
            <div style={{ background: "white", borderRadius: 16, padding: "32px", maxWidth: 380, width: "90%", textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Hapus Perkara?</h3>
              <p style={{ color: "#64748b", fontSize: 14, marginBottom: 24 }}>Data akan dihapus permanen dan tidak dapat dikembalikan.</p>
              <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                <button onClick={() => setDeleteId(null)} style={{ padding: "10px 24px", borderRadius: 8, border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
                  Batal
                </button>
                <button onClick={() => handleDelete(deleteId)} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: "#ef4444", color: "white", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                  Ya, Hapus
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
