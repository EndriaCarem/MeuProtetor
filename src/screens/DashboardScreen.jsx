import { useApp } from '../context/AppContext'
import { Settings, Shield, Bell } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import StatusOrb from '../components/StatusOrb'
import SOSButton from '../components/SOSButton'
import ThreatMeter from '../components/ThreatMeter'
import ContactRing from '../components/ContactRing'
import AlertCard from '../components/AlertCard'

export default function DashboardScreen() {
  const { user, alerts } = useApp()
  const navigate = useNavigate()
  const recentAlerts = alerts.slice(0, 3)

  return (
    <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1a1a2e',
        borderBottom: '1px solid #2d1b4e',
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#6b21a820',
            border: '2px solid #6b21a8',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Shield size={18} color="#a855f7" />
          </div>
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#e2e8f0', letterSpacing: '-0.5px' }}>
              Meu<span style={{ color: '#a855f7' }}>Protetor</span>
            </div>
            <div style={{ fontSize: '11px', color: '#6b7280' }}>Olá, {user?.name || 'Usuário'}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', position: 'relative' }}
          >
            <Bell size={22} />
            <div style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
            }} />
          </button>
          <button
            onClick={() => navigate('/settings')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
          >
            <Settings size={22} />
          </button>
        </div>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* Status Orb */}
        <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '8px' }}>
          <StatusOrb />
        </div>

        {/* SOS Button */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <SOSButton />
        </div>

        {/* Threat Meter */}
        <ThreatMeter />

        {/* Contact Ring */}
        <div>
          <h3 style={{ color: '#9ca3af', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px' }}>
            Contatos de Emergência
          </h3>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <ContactRing />
          </div>
        </div>

        {/* Recent Alerts */}
        {recentAlerts.length > 0 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ color: '#9ca3af', fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Alertas Recentes
              </h3>
              <button
                onClick={() => navigate('/history')}
                style={{ color: '#a855f7', fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Ver todos
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {recentAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
