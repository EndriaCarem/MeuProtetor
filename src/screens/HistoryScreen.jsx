import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, AlertTriangle, Phone, Play, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import BottomNav from '../components/BottomNav'

export default function HistoryScreen() {
  const { alerts } = useApp()
  const navigate = useNavigate()

  const formatDate = (iso) => {
    const d = new Date(iso)
    return {
      date: d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
      time: d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const typeConfig = {
    keyword: { icon: AlertTriangle, color: '#eab308', label: 'Palavra-chave' },
    sos: { icon: Phone, color: '#dc2626', label: 'SOS Manual' },
    threat: { icon: AlertTriangle, color: '#f97316', label: 'Nível de Ameaça' },
  }

  return (
    <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a1a2e',
        borderBottom: '1px solid #2d1b4e',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}>
        <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}>
          <ArrowLeft size={22} />
        </button>
        <div>
          <h1 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>Histórico</h1>
          <div style={{ color: '#6b7280', fontSize: '11px' }}>{alerts.length} registros</div>
        </div>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {alerts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <CheckCircle size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <div>Nenhum alerta registrado</div>
          </div>
        ) : (
          alerts.map(alert => {
            const config = typeConfig[alert.type] || typeConfig.keyword
            const Icon = config.icon
            const { date, time } = formatDate(alert.date)

            return (
              <div
                key={alert.id}
                style={{
                  backgroundColor: '#1a1a2e',
                  border: '1px solid #2d1b4e',
                  borderRadius: '14px',
                  overflow: 'hidden',
                }}
              >
                {/* Alert Header */}
                <div style={{
                  borderBottom: '1px solid #2d1b4e',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      backgroundColor: `${config.color}20`,
                      border: `1px solid ${config.color}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Icon size={16} color={config.color} />
                    </div>
                    <div>
                      <div style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '600' }}>{config.label}</div>
                      <div style={{ color: '#6b7280', fontSize: '11px' }}>{alert.description}</div>
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 10px',
                    borderRadius: '10px',
                    backgroundColor: alert.status === 'resolved' ? '#22c55e20' : '#eab30820',
                    color: alert.status === 'resolved' ? '#22c55e' : '#eab308',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}>
                    {alert.status === 'resolved' ? <CheckCircle size={11} /> : <AlertCircle size={11} />}
                    {alert.status === 'resolved' ? 'Resolvido' : 'Pendente'}
                  </div>
                </div>

                <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {/* Date/Time */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '12px' }}>
                    <Clock size={13} />
                    {date} às {time}
                  </div>

                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#9ca3af', fontSize: '12px' }}>
                    <MapPin size={13} />
                    {alert.location}
                  </div>

                  {/* Map placeholder */}
                  <div style={{
                    height: '80px',
                    backgroundColor: '#0a0a0f',
                    borderRadius: '8px',
                    border: '1px solid #2d1b4e',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '4px',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {/* Fake map grid */}
                    <div style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(#2d1b4e20 1px, transparent 1px), linear-gradient(90deg, #2d1b4e20 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />
                    <div style={{ color: '#6b7280', fontSize: '12px', zIndex: 1, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={14} color="#6b21a8" />
                      Mapa não disponível offline
                    </div>
                  </div>

                  {/* Audio player */}
                  <div style={{
                    backgroundColor: '#0a0a0f',
                    borderRadius: '8px',
                    border: '1px solid #2d1b4e',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}>
                    <button style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '50%',
                      backgroundColor: '#6b21a820',
                      border: '1px solid #6b21a8',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Play size={12} color="#a855f7" style={{ marginLeft: '2px' }} />
                    </button>
                    <div style={{ flex: 1 }}>
                      <div style={{ height: '3px', backgroundColor: '#2d1b4e', borderRadius: '2px', position: 'relative' }}>
                        <div style={{ width: '35%', height: '100%', backgroundColor: '#6b21a8', borderRadius: '2px' }} />
                      </div>
                    </div>
                    <span style={{ color: '#6b7280', fontSize: '11px' }}>0:23</span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <BottomNav />
    </div>
  )
}
