import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Shield, Radar, Users, ChevronRight } from 'lucide-react'

const slides = [
  {
    icon: Shield,
    title: 'Proteção que nunca dorme',
    subtitle: 'MeuProtetor monitora seu ambiente 24/7, detectando palavras-chave e situações de risco enquanto você vive sua vida.',
    color: '#6b21a8',
  },
  {
    icon: Radar,
    title: 'Detectamos ameaças, você permanece seguro',
    subtitle: 'Tecnologia de IA avançada analisa padrões de áudio e comportamento para identificar perigos antes que se tornem emergências.',
    color: '#dc2626',
  },
  {
    icon: Users,
    title: 'Sua segurança, nossos contatos',
    subtitle: 'Em uma emergência, seus contatos de confiança são notificados instantaneamente com sua localização e situação.',
    color: '#7c3aed',
  },
]

export default function OnboardingScreen() {
  const [current, setCurrent] = useState(0)
  const { completeOnboarding } = useApp()

  const next = () => {
    if (current < slides.length - 1) {
      setCurrent(current + 1)
    } else {
      completeOnboarding()
    }
  }

  const skip = () => completeOnboarding()
  const slide = slides[current]
  const Icon = slide.icon

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        left: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: `${slide.color}10`,
        filter: 'blur(80px)',
        transition: 'background-color 0.5s',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        backgroundColor: `${slide.color}08`,
        filter: 'blur(60px)',
        transition: 'background-color 0.5s',
      }} />

      {/* Skip button */}
      {current < slides.length - 1 && (
        <button
          onClick={skip}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            color: '#6b7280',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Pular
        </button>
      )}

      {/* Icon */}
      <div style={{
        width: '160px',
        height: '160px',
        borderRadius: '50%',
        backgroundColor: `${slide.color}20`,
        border: `3px solid ${slide.color}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '48px',
        boxShadow: `0 0 60px ${slide.color}40`,
        transition: 'all 0.5s',
      }}>
        <Icon size={80} color={slide.color} />
      </div>

      {/* Text */}
      <div style={{ textAlign: 'center', maxWidth: '340px', zIndex: 1, marginBottom: '48px' }}>
        <h1 style={{
          fontSize: '26px',
          fontWeight: '800',
          color: '#e2e8f0',
          marginBottom: '16px',
          lineHeight: '1.2',
          letterSpacing: '-0.5px',
        }}>
          {slide.title}
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '15px', lineHeight: '1.6' }}>
          {slide.subtitle}
        </p>
      </div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '40px' }}>
        {slides.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i === current ? slide.color : '#2d1b4e',
              transition: 'all 0.3s',
              cursor: 'pointer',
            }}
          />
        ))}
      </div>

      {/* Next button */}
      <button
        onClick={next}
        style={{
          backgroundColor: slide.color,
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '16px 48px',
          fontSize: '16px',
          fontWeight: '700',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: `0 0 30px ${slide.color}60`,
          transition: 'all 0.3s',
        }}
      >
        {current === slides.length - 1 ? 'Começar' : 'Próximo'}
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
