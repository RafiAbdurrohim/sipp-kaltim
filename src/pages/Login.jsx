import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(username, password);
    if (result.success) {
      navigate("/admin/dashboard");
    } else {
      setError(result.message || "Username atau password salah.");
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #2563eb 100%)", display: "flex", flexDirection: "column" }}>
      <style>{`
        .input-field:focus { outline: none; border-color: #3b82f6 !important; box-shadow: 0 0 0 3px rgba(59,130,246,0.2); }
        .login-card { animation: slideUp 0.6s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes slideUp { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(59,130,246,0.5) !important; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>

      {/* Back link */}
      <div style={{ padding: "20px 32px" }}>
        <Link to="/" style={{ color: "#93c5fd", fontSize: 13, textDecoration: "none", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 6 }}>
          ← Kembali ke Beranda
        </Link>
      </div>

      {/* Decorative bg */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(96,165,250,0.06)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(167,139,250,0.06)", pointerEvents: "none" }} />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px 24px" }}>
        <div
          className="login-card"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 20,
            padding: "48px 40px",
            width: "100%",
            maxWidth: 420,
            backdropFilter: "blur(20px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div
              style={{
                width: 64,
                height: 64,
                margin: "0 auto 16px",
                background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                borderRadius: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 30,
                boxShadow: "0 8px 24px rgba(96,165,250,0.3)",
              }}
            >
              ⚖️
            </div>
            <h1 style={{ color: "white", fontSize: 22, fontWeight: 800, letterSpacing: -0.3, marginBottom: 6 }}>Masuk ke Sistem</h1>
            <p style={{ color: "#ecedee", fontSize: 13 }}>SIPP TUN — Kalimantan Timur</p>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239,68,68,0.12)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10,
                padding: "12px 16px",
                marginBottom: 20,
                color: "#fca5a5",
                fontSize: 13,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: "#d8dfe8", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Username</label>
              <input
                className="input-field"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: 10,
                  background: "rgba(255,255,255,0.06)",
                  border: "1.5px solid rgba(255,255,255,0.12)",
                  color: "white",
                  fontSize: 14,
                  transition: "all 0.2s",
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ color: "#d8dfe8", fontSize: 12, fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input-field"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  required
                  style={{
                    width: "100%",
                    padding: "12px 44px 12px 16px",
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.12)",
                    color: "white",
                    fontSize: 14,
                    transition: "all 0.2s",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: 16,
                    color: "#64748b",
                  }}
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="submit-btn"
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 12,
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                border: "none",
                color: "white",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 16px rgba(59,130,246,0.35)",
                transition: "all 0.2s",
              }}
            >
              {loading ? "⏳ Memverifikasi..." : "🔐 Masuk"}
            </button>
          </form>
        </div>
      </div>

      <div style={{ textAlign: "center", padding: "20px", color: "#334155", fontSize: 12 }}>© 2025 Pemerintah Provinsi Kalimantan Timur</div>
    </div>
  );
}
