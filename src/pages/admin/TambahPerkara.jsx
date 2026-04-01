import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";

const initialForm = {
  noTingkatPertama: "",
  noBanding: "",
  noKasasi: "",
  noPk: "",
  penggugat: "",
  tergugat: "",
  obyek: "",
  persiapan: "Berlangsung",
  pertama: "Belum",
  banding: "Belum",
  kasasi: "Belum",
  pk: "Belum",
  status: "Pemeriksaan",
  statusData: "TUN",
  tglDaftar: "",
  tglDiajukanPertama: "",
  tglDiputuskanPertama: "",
  tglDiajukanBanding: "",
  tglDiputuskanBanding: "",
  tglDiajukanKasasi: "",
  tglDiputuskanKasasi: "",
  tglDiajukanPk: "",
  tglDiputuskanPk: "",
  tglDiajukanInkracht: "",
  tglDiputuskanInkracht: "",
  ketPertama: "",
  ketBanding: "",
  ketKasasi: "",
  ketPk: "",
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
          no_tingkat_pertama: form.noTingkatPertama || null,
          no_banding: form.noBanding || null,
          no_kasasi: form.noKasasi || null,
          no_pk: form.noPk || null,
          penggugat: form.penggugat,
          tergugat: form.tergugat,
          obyek_sengketa: form.obyek,
          tahap_persiapan: form.persiapan,
          putusan_pertama: form.pertama,
          putusan_banding: form.banding,
          putusan_kasasi: form.kasasi,
          putusan_pk: form.pk,
          status: form.status,
          status_data: form.statusData,
          tgl_daftar: form.tglDaftar,
          tgl_diajukan_pertama: form.tglDiajukanPertama || null,
          tgl_diputuskan_pertama: form.tglDiputuskanPertama || null,
          tgl_diajukan_banding: form.tglDiajukanBanding || null,
          tgl_diputuskan_banding: form.tglDiputuskanBanding || null,
          tgl_diajukan_kasasi: form.tglDiajukanKasasi || null,
          tgl_diputuskan_kasasi: form.tglDiputuskanKasasi || null,
          tgl_diajukan_pk: form.tglDiajukanPk || null,
          tgl_diputuskan_pk: form.tglDiputuskanPk || null,
          tgl_diajukan_inkracht: form.tglDiajukanInkracht || null,
          tgl_diputuskan_inkracht: form.tglDiputuskanInkracht || null,
          ket_pertama: form.ketPertama || null,
          ket_banding: form.ketBanding || null,
          ket_kasasi: form.ketKasasi || null,
          ket_pk: form.ketPk || null,
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
          {/* IDENTITAS */}
          <div style={{ background: "white", borderRadius: 16, padding: "28px", marginBottom: 20, boxShadow: "0 4px 20px rgba(15,23,42,0.05)", border: "1px solid #e8f0fe" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a8a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f0f4ff" }}>📋 Identitas Perkara</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <Field label="No. Tingkat Pertama" required>
                <input
                  style={inputStyle}
                  value={form.noTingkatPertama}
                  onChange={(e) => set("noTingkatPertama", e.target.value)}
                  placeholder="Contoh: 011/G/2025/PTUN.SMD"
                  required
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </Field>
              <Field label="No. Banding">
                <input
                  style={inputStyle}
                  value={form.noBanding}
                  onChange={(e) => set("noBanding", e.target.value)}
                  placeholder="Contoh: 011/B/2025/PT.TUN.SMD"
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </Field>
              <Field label="No. Kasasi">
                <input
                  style={inputStyle}
                  value={form.noKasasi}
                  onChange={(e) => set("noKasasi", e.target.value)}
                  placeholder="Contoh: 011/K/TUN/2025"
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </Field>
              <Field label="No. PK">
                <input
                  style={inputStyle}
                  value={form.noPk}
                  onChange={(e) => set("noPk", e.target.value)}
                  placeholder="Contoh: 011/PK/TUN/2025"
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
              <Field label="Status Data">
                <select
                  style={{ ...inputStyle, cursor: "pointer" }}
                  value={form.statusData}
                  onChange={(e) => set("statusData", e.target.value)}
                  onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                >
                  <option value="TUN">TUN</option>
                  <option value="TERDATA">TERDATA</option>
                </select>
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

          {/* TAHAP PEMERIKSAAN */}
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

          {/* TANGGAL & KETERANGAN */}
          <div style={{ background: "white", borderRadius: 16, padding: "28px", marginBottom: 20, boxShadow: "0 4px 20px rgba(15,23,42,0.05)", border: "1px solid #e8f0fe" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#1e3a8a", marginBottom: 20, paddingBottom: 12, borderBottom: "1px solid #f0f4ff" }}>📅 Tanggal & Keterangan Per Tahap</h2>

            {[
              { label: "Tingkat Pertama", diajukan: "tglDiajukanPertama", diputuskan: "tglDiputuskanPertama", ket: "ketPertama", ketLabel: "Putusan Tingkat Pertama" },
              { label: "Tingkat Banding", diajukan: "tglDiajukanBanding", diputuskan: "tglDiputuskanBanding", ket: "ketBanding", ketLabel: "Putusan Banding" },
              { label: "Tingkat Kasasi", diajukan: "tglDiajukanKasasi", diputuskan: "tglDiputuskanKasasi", ket: "ketKasasi", ketLabel: "Putusan Kasasi" },
              { label: "Tingkat PK", diajukan: "tglDiajukanPk", diputuskan: "tglDiputuskanPk", ket: "ketPk", ketLabel: "Putusan PK" },
              { label: "Tingkat Inkracht", diajukan: "tglDiajukanInkracht", diputuskan: "tglDiputuskanInkracht", ket: null, ketLabel: null },
            ].map((t, i) => (
              <div key={i} style={{ marginBottom: 24, paddingBottom: 24, borderBottom: i < 4 ? "1px solid #f0f4ff" : "none" }}>
                <div style={{ fontWeight: 700, color: "#1e3a8a", fontSize: 13, marginBottom: 12 }}>📌 {t.label}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
                  <Field label="Tanggal Diajukan">
                    <input
                      type="date"
                      style={inputStyle}
                      value={form[t.diajukan] || ""}
                      onChange={(e) => set(t.diajukan, e.target.value)}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </Field>
                  <Field label="Tanggal Diputuskan">
                    <input
                      type="date"
                      style={inputStyle}
                      value={form[t.diputuskan] || ""}
                      onChange={(e) => set(t.diputuskan, e.target.value)}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </Field>
                </div>
                {t.ket && (
                  <Field label={t.ketLabel}>
                    <textarea
                      style={{ ...inputStyle, minHeight: 70, resize: "vertical" }}
                      value={form[t.ket] || ""}
                      onChange={(e) => set(t.ket, e.target.value)}
                      placeholder={`Penjelasan ${t.ketLabel.toLowerCase()}...`}
                      onFocus={(e) => (e.target.style.borderColor = "#3b82f6")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                  </Field>
                )}
              </div>
            ))}
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
