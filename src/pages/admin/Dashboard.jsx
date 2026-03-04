import AdminLayout from '../../components/AdminLayout'
import { dataPerkara } from '../../data/perkara'

const statCards = [
  { label: 'Total Perkara', value: dataPerkara.length, icon: '⚖️', color: '#3b82f6', bg: '#dbeafe' },
  { label: 'Sedang Pemeriksaan', value: dataPerkara.filter(p => p.status === 'Pemeriksaan').length, icon: '🔄', color: '#f59e0b', bg: '#fef3c7' },
  { label: 'Proses Banding', value: dataPerkara.filter(p => p.status === 'Banding').length, icon: '📤', color: '#8b5cf6', bg: '#ede9fe' },
  { label: 'Inkracht', value: dataPerkara.filter(p => p.status === 'Inkracht').length, icon: '✅', color: '#10b981', bg: '#d1fae5' },
]

export default function AdminDashboard() {
  const recent = [...dataPerkara].reverse().slice(0, 5)

  return (
    <AdminLayout>
      <div style={{ padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: -0.3 }}>Dashboard Admin</h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 4 }}>
            Selamat datang! Berikut ringkasan data perkara terkini.
          </p>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 32 }}>
          {statCards.map((s, i) => (
            <div key={i} style={{
              background: 'white', borderRadius: 16, padding: '24px',
              boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
              border: '1px solid #e8f0fe',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(15,23,42,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.06)' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 32, fontWeight: 800, color: '#0f172a', letterSpacing: -1 }}>{s.value}</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginTop: 4, fontWeight: 500 }}>{s.label}</div>
                </div>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent perkara */}
        <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 4px 20px rgba(15,23,42,0.06)', border: '1px solid #e8f0fe', overflow: 'hidden' }}>
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f0f4ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#0f172a' }}>Perkara Terbaru</h2>
              <p style={{ color: '#94a3b8', fontSize: 12, marginTop: 2 }}>5 entri terakhir yang didaftarkan</p>
            </div>
            <a href="/admin/perkara" style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}>Lihat Semua →</a>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ background: '#f8faff' }}>
                {['No. Perkara', 'Penggugat', 'Tergugat', 'Tgl. Daftar', 'Status'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: '#64748b', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.4 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((p, i) => (
                <tr key={p.id} style={{ borderTop: '1px solid #f0f4ff' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f8faff'}
                  onMouseLeave={e => e.currentTarget.style.background = 'white'}
                >
                  <td style={{ padding: '13px 16px', color: '#1d4ed8', fontWeight: 700, fontSize: 12 }}>{p.noPerkara}</td>
                  <td style={{ padding: '13px 16px', color: '#1e293b' }}>{p.penggugat}</td>
                  <td style={{ padding: '13px 16px', color: '#475569' }}>{p.tergugat}</td>
                  <td style={{ padding: '13px 16px', color: '#94a3b8', fontSize: 12 }}>{new Date(p.tglDaftar).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}</td>
                  <td style={{ padding: '13px 16px' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: p.status === 'Inkracht' ? '#d1fae5' : p.status === 'Pemeriksaan' ? '#fef3c7' : p.status === 'Banding' ? '#dbeafe' : '#ede9fe',
                      color: p.status === 'Inkracht' ? '#065f46' : p.status === 'Pemeriksaan' ? '#92400e' : p.status === 'Banding' ? '#1e40af' : '#5b21b6',
                    }}>{p.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}
