import { useApp } from '../context/AppContext'

export default function ThreatMeter() {
  const { threatLevel } = useApp()

  const getColor = () => {
    if (threatLevel < 30) return '#22c55e'
    if (threatLevel < 60) return '#eab308'
    return '#dc2626'
  }

  const color = getColor()

  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      border: '1px solid #2d1b4e',
      borderRadius: '12px',
      padding: '16px',
      width: '100%',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
        <span style={{ color: '#9ca3af', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>Nível de Ameaça</span>
        <span style={{ color, fontWeight: '700', fontSize: '13px' }}>{threatLevel}%</span>
      </div>
      <div style={{
        height: '10px',
        backgroundColor: '#0a0a0f',
        borderRadius: '5px',
        overflow: 'hidden',
        border: '1px solid #2d1b4e',
      }}>
        <div style={{
          height: '100%',
          width: `${threatLevel}%`,
          backgroundColor: color,
          borderRadius: '5px',
          boxShadow: `0 0 10px ${color}80`,
          transition: 'width 0.5s ease, background-color 0.5s ease',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
        <span style={{ fontSize: '11px', color: '#22c55e' }}>Baixo</span>
        <span style={{ fontSize: '11px', color: '#eab308' }}>Médio</span>
        <span style={{ fontSize: '11px', color: '#dc2626' }}>Alto</span>
      </div>
    </div>
  )
}
