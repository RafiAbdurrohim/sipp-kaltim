import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
      padding: '0 32px',
      height: 68,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 4px 24px rgba(15,23,42,0.4)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <div style={{
          width: 40, height: 40,
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, boxShadow: '0 4px 12px rgba(96,165,250,0.4)',
          flexShrink: 0,
        }}>⚖️</div>
        <div>
          <div style={{ color: 'white', fontWeight: 700, fontSize: 14, letterSpacing: 0.3 }}>SIPP TUN</div>
          <div style={{ color: '#93c5fd', fontSize: 10, fontWeight: 500, letterSpacing: 1 }}>KALIMANTAN TIMUR</div>
        </div>
      </Link>

      <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
        {[
          { label: 'Beranda', to: '/' },
          { label: 'Data Perkara', to: '/#perkara' },
          { label: 'Jadwal Sidang', to: '/' },
          { label: 'Statistik', to: '/' },
        ].map(item => (
          <Link key={item.label} to={item.to} style={{
            color: '#bfdbfe', fontSize: 13, fontWeight: 500,
            textDecoration: 'none', padding: '6px 12px', borderRadius: 6,
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >{item.label}</Link>
        ))}
      </div>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/admin/dashboard" style={{
            color: '#93c5fd', fontSize: 13, fontWeight: 600, textDecoration: 'none',
            padding: '8px 16px', borderRadius: 8,
            background: 'rgba(96,165,250,0.15)',
            border: '1.5px solid rgba(96,165,250,0.3)',
          }}>🛡️ Admin Panel</Link>
          <button onClick={handleLogout} style={{
            background: 'rgba(239,68,68,0.15)',
            border: '1.5px solid rgba(239,68,68,0.3)',
            color: '#fca5a5',
            padding: '8px 16px',
            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>Logout</button>
        </div>
      ) : (
        <Link to="/login">
          <button style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1.5px solid rgba(255,255,255,0.3)',
            color: 'white',
            padding: '8px 20px',
            borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.target.style.background = 'white'; e.target.style.color = '#1e3a8a' }}
            onMouseLeave={e => { e.target.style.background = 'rgba(255,255,255,0.12)'; e.target.style.color = 'white' }}
          >🔐 Login</button>
        </Link>
      )}
    </nav>
  )
}
