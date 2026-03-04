import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  noPerkara: "",
  penggugat: "",
  tergugat: "",
  obyek: "",
  persiapan: "Berlangsung",
  pertama: "Belum",
  banding: "Belum",
  kasasi: "Belum",
  pk: "Belum",
  status: "Pemeriksaan",
  tglDaftar: "",
};

const inputStyle = { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 14, color: "#0f172a", outline: "none", transition: "border-color 0.2s", background: "white" };
const Field = ({ label, children, required }) => (
  <div style={{ marginBottom: 20 }}>
    <label style={{ display: "block", color: "#374151", fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
      {label} {required && <span style={{ color: "#ef4444" }}>*</span>}
    </label>
    {children}
  </div>
);

export default function TambahPerkara() {
  const { token } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/perkara`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          no_perkara: form.noPerkara,
          penggugat: form.penggugat,
          tergugat: form.tergugat,
          obyek_sengketa: form.obyek,
          tahap_persiapan: form.persiapan,
          putusan_pertama: form.pertama,
          putusan_banding: form.banding,
          putusan_kasasi: form.kasasi,
          putusan_pk: form.pk,
          status: form.status,
          tgl_daftar: form.tglDaftar,
        }),
      });
      const data = await res.json();
      if (data.success) navigate("/admin/perkara");
      else setError(data.message || "Gagal menyimpan.");
    } catch {
      setError("Terjadi kesalahan koneksi.");
    }
    setSaving(false);
  };

  const putusanOptions = ["Belum", "Berlangsung", "Selesai", "Dikabulkan", "Ditolak", "Dikuatkan", "Dibatalkan"];
  const statusOptions = ["Pemeriksaan", "Banding", "Kasasi", "Inkracht"];

  return (
    <AdminLayout>
      <div style={{ padding: "32px", maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}>
          <Link to="/admin/perkara" style={{ color: "#64748b", textDecoration: "none", fontSize: 22 }}>
            ←
          </Link>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0f172a" }}>Tambah Perkara Baru</h1>
            <p style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>Isi data perkara tata usaha negara baru</p>
          </div>
        </div>

        {error && <div style={{ background: "#fee2e2", border: "1px solid #fca5a5", borderRadius: 10, padding: "12px 16px", marginBottom: 20, color: "#991b1b", fontSize: 13 }}>⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ background: "white", borderRadius: 16, padding: "28px", marginBottom: 20, boxShadow: "0 4px 20px rgba(15,23,42,0.05)", border: "1px solid #e8f0fe" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a8a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f0f4ff" }}>📋 Identitas Perkara</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <Field label="Nomor Perkara" required>
                <input
                  style={inputStyle}
                  value={form.noPerkara}
                  onChange={(e) => set("noPerkara", e.target.value)}
                  placeholder="Contoh: 011/G/2025/PTUN.SMD"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </Field>
              <Field label="Tanggal Daftar" required>
                <input
                  type="date"
                  style={inputStyle}
                  value={form.tglDaftar}
                  onChange={(e) => set("tglDaftar", e.target.value)}
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </Field>
              <Field label="Penggugat" required>
                <input
                  style={inputStyle}
                  value={form.penggugat}
                  onChange={(e) => set("penggugat", e.target.value)}
                  placeholder="Nama penggugat"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </Field>
              <Field label="Tergugat" required>
                <input
                  style={inputStyle}
                  value={form.tergugat}
                  onChange={(e) => set("tergugat", e.target.value)}
                  placeholder="Nama tergugat / instansi"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </Field>
            </div>
            <Field label="Obyek Sengketa" required>
              <textarea
                style={{ ...inputStyle, minHeight: 80, resize: "vertical" }}
                value={form.obyek}
                onChange={(e) => set("obyek", e.target.value)}
                placeholder="Deskripsikan obyek sengketa..."
                required
                onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
              />
            </Field>
          </div>

          <div style={{ background: "white", borderRadius: 16, padding: "28px", marginBottom: 20, boxShadow: "0 4px 20px rgba(15,23,42,0.05)", border: "1px solid #e8f0fe" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a8a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f0f4ff" }}>⚖️ Tahap Pemeriksaan & Putusan</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0 20px" }}>
              {[
                { label: "Tahap Persiapan", key: "persiapan" },
                { label: "Putusan Tk. Pertama", key: "pertama" },
                { label: "Putusan Banding", key: "banding" },
                { label: "Putusan Kasasi", key: "kasasi" },
                { label: "Putusan PK", key: "pk" },
              ].map((f) => (
                <Field key={f.key} label={f.label}>
                  <select
                    style={{ ...inputStyle, cursor: "pointer" }}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  >
                    {putusanOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
              ))}
              <Field label="Status Perkara">
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                >
                  {statusOptions.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Link to="/admin/perkara">
              <button type="button" style={{ padding: "11px 24px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
                Batal
              </button>
            </Link>
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "11px 28px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                opacity: saving ? 0.8 : 1,
              }}
            >
              {saving ? "⏳ Menyimpan..." : "💾 Simpan Perkara"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
