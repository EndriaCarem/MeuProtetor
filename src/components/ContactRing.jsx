import { useApp } from '../context/AppContext'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function ContactRing() {
  const { contacts } = useApp()
  const navigate = useNavigate()
  const displayContacts = contacts.slice(0, 5)
  const count = displayContacts.length
  const radius = 90

  const colors = ['#6b21a8', '#dc2626', '#1d4ed8', '#059669', '#d97706']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
      <div style={{
        position: 'relative',
        width: `${(radius + 40) * 2}px`,
        height: `${(radius + 40) * 2}px`,
      }}>
        {/* Center point */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: '#1a1a2e',
          border: '2px solid #2d1b4e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b21a8',
          fontSize: '11px',
          fontWeight: '700',
          zIndex: 2,
        }}>
          <span style={{ fontSize: '10px' }}>SOS</span>
        </div>

        {/* Ring lines */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${radius * 2}px`,
          height: `${radius * 2}px`,
          borderRadius: '50%',
          border: '1px dashed #2d1b4e',
        }} />

        {/* Contacts */}
        {displayContacts.map((contact, i) => {
          const angle = (i / count) * 2 * Math.PI - Math.PI / 2
          const x = radius * Math.cos(angle)
          const y = radius * Math.sin(angle)
          const color = colors[i % colors.length]

          return (
            <div
              key={contact.id}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: `${color}20`,
                border: `2px solid ${color}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: '700',
                color: color,
                cursor: 'pointer',
                zIndex: 2,
                boxShadow: `0 0 10px ${color}40`,
              }}
              title={contact.name}
            >
              {contact.avatar}
            </div>
          )
        })}

        {/* Add button if less than 5 */}
        {count < 5 && (
          <button
            onClick={() => navigate('/settings')}
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '10px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#2d1b4e',
              border: '1px solid #6b21a8',
              color: '#a855f7',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Plus size={16} />
          </button>
        )}
      </div>
      <div style={{ color: '#6b7280', fontSize: '12px' }}>{count} contatos de emergência</div>
    </div>
  )
}
