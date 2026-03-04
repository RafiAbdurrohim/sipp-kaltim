import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const menuItems = [
  { icon: '📊', label: 'Dashboard', path: '/admin/dashboard' },
  { icon: '⚖️', label: 'Data Perkara', path: '/admin/perkara' },
]

export default function AdminLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4ff' }}>
      {/* SIDEBAR */}
      <div style={{
        width: 240, background: 'linear-gradient(180deg, #0f172a 0%, #1e3a8a 100%)',
        display: 'flex', flexDirection: 'column',
        boxShadow: '4px 0 24px rgba(15,23,42,0.3)',
        position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, background: 'linear-gradient(135deg, #60a5fa, #a78bfa)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
            }}>⚖️</div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>BANKUM</div>
              <div style={{ color: '#60a5fa', fontSize: 10, letterSpacing: 1 }}>ADMIN PANEL</div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #3b82f6, #6366f1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 14 }}>
              {user?.name?.[0] || 'A'}
            </div>
            <div>
              <div style={{ color: 'white', fontSize: 13, fontWeight: 600 }}>{user?.name}</div>
              <div style={{ color: '#64748b', fontSize: 11 }}>{user?.role}</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          <div style={{ color: '#475569', fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: 'uppercase', padding: '0 8px', marginBottom: 8 }}>Menu</div>
          {menuItems.map(item => {
            const active = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                textDecoration: 'none', transition: 'all 0.2s',
                background: active ? 'rgba(59,130,246,0.2)' : 'transparent',
                border: active ? '1px solid rgba(59,130,246,0.35)' : '1px solid transparent',
                color: active ? '#93c5fd' : '#64748b',
              }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
              >
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                <span style={{ fontSize: 13, fontWeight: active ? 600 : 500 }}>{item.label}</span>
                {active && <span style={{ marginLeft: 'auto', width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, textDecoration: 'none', color: '#64748b', fontSize: 13, marginBottom: 4 }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >🌐 Lihat Situs Publik</Link>
          <button onClick={handleLogout} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            padding: '8px 12px', borderRadius: 8, border: 'none',
            background: 'rgba(239,68,68,0.1)', color: '#fca5a5',
            fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >🚪 Logout</button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ marginLeft: 240, flex: 1 }}>
        {children}
      </div>
    </div>
  )
}
