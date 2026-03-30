import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Clock, Settings } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const items = [
    { icon: Home, label: 'Início', path: '/' },
    { icon: Clock, label: 'Histórico', path: '/history' },
    { icon: Settings, label: 'Config', path: '/settings' },
  ]

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#1a1a2e',
      borderTop: '1px solid #2d1b4e',
      display: 'flex',
      justifyContent: 'space-around',
      padding: '10px 0',
      zIndex: 50,
    }}>
      {items.map(({ icon: Icon, label, path }) => {
        const active = location.pathname === path || (path === '/' && location.pathname === '/dashboard')
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '4px',
              padding: '8px 20px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? '#a855f7' : '#6b7280',
              transition: 'color 0.2s',
            }}
          >
            <Icon size={24} />
            <span style={{ fontSize: '11px', fontWeight: active ? '600' : '400' }}>{label}</span>
          </button>
        )
      })}
    </nav>
  )
}
