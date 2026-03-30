import { useApp } from '../context/AppContext'

export default function StatusOrb() {
  const { status, threatLevel } = useApp()

  const colors = {
    safe: { main: '#22c55e', glow: '#22c55e40', text: 'Seguro' },
    alert: { main: '#eab308', glow: '#eab30840', text: 'Alerta' },
    danger: { main: '#dc2626', glow: '#dc262640', text: 'Perigo' },
  }

  const { main, glow, text } = colors[status]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      <style>{`
        @keyframes pulse-orb {
          0%, 100% { transform: scale(1); box-shadow: 0 0 30px ${glow}, 0 0 60px ${glow}, 0 0 90px ${glow}; }
          50% { transform: scale(1.08); box-shadow: 0 0 50px ${glow}, 0 0 100px ${glow}, 0 0 150px ${glow}; }
        }
        @keyframes rotate-ring {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ position: 'relative', width: '140px', height: '140px' }}>
        {/* Outer ring */}
        <div style={{
          position: 'absolute',
          inset: '-10px',
          borderRadius: '50%',
          border: `2px solid ${main}30`,
          animation: 'rotate-ring 8s linear infinite',
        }}>
          <div style={{
            position: 'absolute',
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            backgroundColor: main,
          }} />
        </div>
        {/* Main orb */}
        <div style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          backgroundColor: `${main}20`,
          border: `3px solid ${main}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse-orb 2s ease-in-out infinite',
          flexDirection: 'column',
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: `${main}40`,
            border: `2px solid ${main}80`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: main,
              boxShadow: `0 0 20px ${main}`,
            }} />
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: main, fontSize: '18px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>{text}</div>
        <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>Nível de ameaça: {threatLevel}%</div>
      </div>
    </div>
  )
}
