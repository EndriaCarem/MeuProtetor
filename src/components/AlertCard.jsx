import { AlertTriangle, Phone, MapPin, CheckCircle, Clock } from 'lucide-react'

export default function AlertCard({ alert }) {
  const typeIcons = {
    keyword: AlertTriangle,
    sos: Phone,
    threat: AlertTriangle,
  }

  const Icon = typeIcons[alert.type] || AlertTriangle

  const formatDate = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('pt-BR') + ' ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      border: '1px solid #2d1b4e',
      borderRadius: '12px',
      padding: '14px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: alert.status === 'resolved' ? '#22c55e20' : '#dc262620',
        border: `1px solid ${alert.status === 'resolved' ? '#22c55e' : '#dc2626'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color={alert.status === 'resolved' ? '#22c55e' : '#dc2626'} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{alert.description}</span>
          <span style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: '10px',
            backgroundColor: alert.status === 'resolved' ? '#22c55e20' : '#eab30820',
            color: alert.status === 'resolved' ? '#22c55e' : '#eab308',
            whiteSpace: 'nowrap',
            marginLeft: '8px',
          }}>
            {alert.status === 'resolved' ? 'Resolvido' : 'Pendente'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '11px', marginBottom: '2px' }}>
          <Clock size={11} />
          {formatDate(alert.date)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6b7280', fontSize: '11px' }}>
          <MapPin size={11} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.location}</span>
        </div>
      </div>
    </div>
  )
}
