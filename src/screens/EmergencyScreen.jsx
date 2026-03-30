import { useState, useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, Mic, X } from 'lucide-react'

const MOCK_TRANSCRIPTION = [
  "... detectando áudio...",
  "Ruído ambiente detectado",
  "Voz humana identificada",
  "Palavra-chave: 'socorro' detectada com 94% de confiança",
  "Analisando contexto emocional...",
  "Tom de voz: angústia/medo",
  "Padrão de ameaça: ALTO",
  "Acionando protocolo de emergência...",
  "Contatos sendo notificados...",
]

export default function EmergencyScreen({ overlay }) {
  const { cancelEmergency, confirmEmergency } = useApp()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(30)
  const [transcription, setTranscription] = useState([MOCK_TRANSCRIPTION[0]])
  const transcriptRef = useRef(null)
  const confirmed = useRef(false)

  const confirmEmergencyRef = useRef(confirmEmergency)
  const navigateRef = useRef(navigate)
  const overlayRef = useRef(overlay)
  useEffect(() => { confirmEmergencyRef.current = confirmEmergency }, [confirmEmergency])
  useEffect(() => { navigateRef.current = navigate }, [navigate])
  useEffect(() => { overlayRef.current = overlay }, [overlay])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          if (!confirmed.current) {
            confirmed.current = true
            confirmEmergencyRef.current()
            if (!overlayRef.current) navigateRef.current('/')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const idx = Math.floor((30 - countdown) / (30 / MOCK_TRANSCRIPTION.length))
    setTranscription(prev => {
      if (idx < MOCK_TRANSCRIPTION.length && idx >= prev.length) {
        return MOCK_TRANSCRIPTION.slice(0, idx + 1)
      }
      return prev
    })
  }, [countdown])

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight
    }
  }, [transcription])

  const handleCancel = () => {
    cancelEmergency()
    if (!overlay) navigate('/')
  }

  const handleConfirm = () => {
    confirmed.current = true
    confirmEmergency()
    if (!overlay) navigate('/')
  }

  const progress = ((30 - countdown) / 30) * 100

  const containerStyle = overlay ? {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    backgroundColor: '#0a0a0f',
    display: 'flex',
    flexDirection: 'column',
  } : {
    minHeight: '100vh',
    backgroundColor: '#0a0a0f',
    display: 'flex',
    flexDirection: 'column',
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes emergency-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes warning-glow {
          0%, 100% { box-shadow: 0 0 30px #dc262660, 0 0 60px #dc262640; }
          50% { box-shadow: 0 0 60px #dc2626, 0 0 120px #dc262680; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        backgroundColor: '#1a0000',
        borderBottom: '2px solid #dc2626',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        animation: 'emergency-pulse 1s ease-in-out infinite',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#dc2626', fontSize: '13px', letterSpacing: '3px', fontWeight: '700' }}>
            ⚠ EMERGÊNCIA DETECTADA ⚠
          </div>
        </div>
        <button
          onClick={handleCancel}
          style={{
            position: 'absolute',
            right: '20px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#6b7280',
          }}
        >
          <X size={24} />
        </button>
      </div>

      <div style={{ flex: 1, padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto' }}>
        {/* Warning Icon */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            backgroundColor: '#dc262620',
            border: '3px solid #dc2626',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'warning-glow 1s ease-in-out infinite',
          }}>
            <AlertTriangle size={50} color="#dc2626" />
          </div>
        </div>

        {/* Countdown */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '8px', letterSpacing: '1px' }}>
            CONFIRMAÇÃO AUTOMÁTICA EM
          </div>
          <div style={{
            fontSize: '56px',
            fontWeight: '900',
            color: countdown <= 10 ? '#dc2626' : '#e2e8f0',
            lineHeight: 1,
            animation: countdown <= 10 ? 'emergency-pulse 0.5s ease-in-out infinite' : 'none',
          }}>
            {countdown}
          </div>
          <div style={{ color: '#6b7280', fontSize: '12px', marginTop: '4px' }}>segundos</div>
          {/* Progress bar */}
          <div style={{
            height: '6px',
            backgroundColor: '#1a1a2e',
            borderRadius: '3px',
            marginTop: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: progress > 70 ? '#dc2626' : '#eab308',
              borderRadius: '3px',
              transition: 'width 1s linear',
              boxShadow: `0 0 8px ${progress > 70 ? '#dc2626' : '#eab308'}`,
            }} />
          </div>
        </div>

        {/* Transcription */}
        <div style={{
          backgroundColor: '#1a1a2e',
          border: '1px solid #2d1b4e',
          borderRadius: '12px',
          padding: '16px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              animation: 'emergency-pulse 1s ease-in-out infinite',
            }} />
            <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '600', letterSpacing: '1px' }}>
              TRANSCRIÇÃO AO VIVO
            </span>
            <Mic size={14} color="#dc2626" />
          </div>
          <div
            ref={transcriptRef}
            style={{
              height: '150px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            {transcription.map((line, i) => (
              <div
                key={i}
                style={{
                  color: i === transcription.length - 1 ? '#e2e8f0' : '#6b7280',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: i === transcription.length - 1 ? '#dc262615' : 'transparent',
                }}
              >
                {'> '}{line}
              </div>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button
            onClick={handleConfirm}
            style={{
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '18px',
              fontSize: '16px',
              fontWeight: '800',
              letterSpacing: '1px',
              cursor: 'pointer',
              boxShadow: '0 0 30px #dc262660',
            }}
          >
            CONFIRMAR EMERGÊNCIA
          </button>
          <button
            onClick={handleCancel}
            style={{
              backgroundColor: '#374151',
              color: '#9ca3af',
              border: '1px solid #4b5563',
              borderRadius: '12px',
              padding: '16px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
            }}
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  )
}
