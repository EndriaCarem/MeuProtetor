import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

export default function SOSButton() {
  const { triggerEmergency } = useApp()
  const navigate = useNavigate()

  const handleSOS = () => {
    triggerEmergency()
    navigate('/emergency')
  }

  return (
    <>
      <style>{`
        @keyframes sos-pulse {
          0%, 100% { box-shadow: 0 0 20px #dc262660, 0 0 40px #dc262640, inset 0 0 20px #dc262620; transform: scale(1); }
          50% { box-shadow: 0 0 40px #dc2626, 0 0 80px #dc262680, inset 0 0 30px #dc262640; transform: scale(1.03); }
        }
        .sos-btn:active { transform: scale(0.96) !important; }
      `}</style>
      <button
        className="sos-btn"
        onClick={handleSOS}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          backgroundColor: '#dc2626',
          border: '4px solid #ef4444',
          color: 'white',
          fontSize: '28px',
          fontWeight: '900',
          letterSpacing: '3px',
          cursor: 'pointer',
          animation: 'sos-pulse 1.5s ease-in-out infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute',
          inset: '-12px',
          borderRadius: '50%',
          border: '2px solid #dc262650',
          animation: 'sos-pulse 1.5s ease-in-out infinite',
          animationDelay: '0.3s',
        }} />
        SOS
      </button>
    </>
  )
}
