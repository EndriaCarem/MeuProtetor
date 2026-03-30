import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Save, LogOut } from 'lucide-react'
import BottomNav from '../components/BottomNav'

export default function SettingsScreen() {
  const { contacts, keywords, sensitivity, dataRetention, saveContacts, saveKeywords, saveSettings, logout } = useApp()
  const navigate = useNavigate()

  const [localContacts, setLocalContacts] = useState([...contacts])
  const [localKeywords, setLocalKeywords] = useState([...keywords])
  const [localSensitivity, setLocalSensitivity] = useState(sensitivity)
  const [localRetention, setLocalRetention] = useState(dataRetention)
  const [newKeyword, setNewKeyword] = useState('')
  const [newContact, setNewContact] = useState({ name: '', phone: '' })
  const [saved, setSaved] = useState(false)

  const addKeyword = () => {
    if (newKeyword.trim() && !localKeywords.includes(newKeyword.trim())) {
      setLocalKeywords([...localKeywords, newKeyword.trim().toLowerCase()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (kw) => {
    setLocalKeywords(localKeywords.filter(k => k !== kw))
  }

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      const initials = newContact.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      setLocalContacts([...localContacts, {
        id: Date.now(),
        name: newContact.name,
        phone: newContact.phone,
        avatar: initials,
      }])
      setNewContact({ name: '', phone: '' })
    }
  }

  const removeContact = (id) => {
    setLocalContacts(localContacts.filter(c => c.id !== id))
  }

  const handleSave = () => {
    saveContacts(localContacts)
    saveKeywords(localKeywords)
    saveSettings({ sensitivity: localSensitivity, dataRetention: localRetention })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = {
    backgroundColor: '#0a0a0f',
    border: '1px solid #2d1b4e',
    borderRadius: '8px',
    padding: '10px 14px',
    color: '#e2e8f0',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  }

  const sectionStyle = {
    backgroundColor: '#1a1a2e',
    border: '1px solid #2d1b4e',
    borderRadius: '12px',
    padding: '18px',
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
        <h1 style={{ color: '#e2e8f0', fontSize: '18px', fontWeight: '800', letterSpacing: '-0.5px' }}>Configurações</h1>
      </div>

      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Keywords */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#a855f7', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: '700' }}>
            Palavras-chave de Ativação
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {localKeywords.map(kw => (
              <div
                key={kw}
                style={{
                  backgroundColor: '#6b21a820',
                  border: '1px solid #6b21a8',
                  borderRadius: '20px',
                  padding: '4px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  color: '#a855f7',
                }}
              >
                {kw}
                <button onClick={() => removeKeyword(kw)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 0, display: 'flex' }}>
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={newKeyword}
              onChange={e => setNewKeyword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addKeyword()}
              placeholder="Nova palavra-chave"
            />
            <button
              onClick={addKeyword}
              style={{
                backgroundColor: '#6b21a8',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 14px',
                cursor: 'pointer',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Contacts */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#a855f7', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: '700' }}>
            Contatos de Emergência
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            {localContacts.map(contact => (
              <div
                key={contact.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  backgroundColor: '#0a0a0f',
                  borderRadius: '8px',
                  padding: '10px 12px',
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#6b21a820',
                  border: '1px solid #6b21a8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#a855f7',
                  flexShrink: 0,
                }}>
                  {contact.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: '600' }}>{contact.name}</div>
                  <div style={{ color: '#6b7280', fontSize: '12px' }}>{contact.phone}</div>
                </div>
                <button onClick={() => removeContact(contact.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input
              style={inputStyle}
              value={newContact.name}
              onChange={e => setNewContact({ ...newContact, name: e.target.value })}
              placeholder="Nome do contato"
            />
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                style={{ ...inputStyle, flex: 1 }}
                value={newContact.phone}
                onChange={e => setNewContact({ ...newContact, phone: e.target.value })}
                placeholder="Telefone"
              />
              <button
                onClick={addContact}
                style={{
                  backgroundColor: '#6b21a8',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* AI Sensitivity */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#a855f7', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: '700' }}>
            Sensibilidade da IA
          </h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['low', 'medium', 'high'].map(level => (
              <button
                key={level}
                onClick={() => setLocalSensitivity(level)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '8px',
                  border: localSensitivity === level ? '1px solid #6b21a8' : '1px solid #2d1b4e',
                  backgroundColor: localSensitivity === level ? '#6b21a820' : '#0a0a0f',
                  color: localSensitivity === level ? '#a855f7' : '#6b7280',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: localSensitivity === level ? '600' : '400',
                }}
              >
                {level === 'low' ? 'Baixa' : level === 'medium' ? 'Média' : 'Alta'}
              </button>
            ))}
          </div>
        </div>

        {/* Data Retention */}
        <div style={sectionStyle}>
          <h2 style={{ color: '#a855f7', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '14px', fontWeight: '700' }}>
            Retenção de Dados
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { value: '24h', label: '24 horas' },
              { value: '7d', label: '7 dias' },
              { value: '30d', label: '30 dias' },
              { value: 'forever', label: 'Sempre' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setLocalRetention(value)}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: localRetention === value ? '1px solid #6b21a8' : '1px solid #2d1b4e',
                  backgroundColor: localRetention === value ? '#6b21a820' : '#0a0a0f',
                  color: localRetention === value ? '#a855f7' : '#9ca3af',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: localRetention === value ? '600' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <div style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: `2px solid ${localRetention === value ? '#6b21a8' : '#2d1b4e'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {localRetention === value && (
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#6b21a8' }} />
                  )}
                </div>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Save & Logout */}
        <button
          onClick={handleSave}
          style={{
            backgroundColor: saved ? '#22c55e' : '#6b21a8',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '15px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: `0 0 20px ${saved ? '#22c55e40' : '#6b21a840'}`,
            transition: 'background-color 0.3s',
          }}
        >
          <Save size={18} />
          {saved ? 'Salvo!' : 'Salvar Configurações'}
        </button>

        <button
          onClick={logout}
          style={{
            backgroundColor: 'transparent',
            color: '#dc2626',
            border: '1px solid #dc262640',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <LogOut size={18} />
          Sair da Conta
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
