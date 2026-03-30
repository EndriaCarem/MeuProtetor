import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

const MOCK_CONTACTS = [
  { id: 1, name: 'Maria Silva', phone: '(11) 99999-0001', avatar: 'MS' },
  { id: 2, name: 'João Santos', phone: '(11) 99999-0002', avatar: 'JS' },
  { id: 3, name: 'Ana Costa', phone: '(11) 99999-0003', avatar: 'AC' },
]

const MOCK_KEYWORDS = ['socorro', 'ajuda', 'perigo', 'emergência', 'help']

const MOCK_ALERTS = [
  {
    id: 1,
    type: 'keyword',
    date: new Date(Date.now() - 86400000).toISOString(),
    location: 'Rua das Flores, 123 - São Paulo, SP',
    status: 'resolved',
    description: 'Palavra-chave detectada: "socorro"',
  },
  {
    id: 2,
    type: 'sos',
    date: new Date(Date.now() - 172800000).toISOString(),
    location: 'Av. Paulista, 1578 - São Paulo, SP',
    status: 'resolved',
    description: 'SOS acionado manualmente',
  },
  {
    id: 3,
    type: 'threat',
    date: new Date(Date.now() - 259200000).toISOString(),
    location: 'Rua Augusta, 456 - São Paulo, SP',
    status: 'pending',
    description: 'Nível de ameaça elevado detectado',
  },
]

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return !!localStorage.getItem('mp_auth') } catch { return false }
  })
  const [user, setUser] = useState(() => {
    try {
      const auth = localStorage.getItem('mp_auth')
      return auth ? JSON.parse(auth).user : null
    } catch { return null }
  })
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(() => {
    try { return !!localStorage.getItem('mp_onboarding') } catch { return false }
  })
  const [threatLevel, setThreatLevel] = useState(15)
  const [status, setStatus] = useState('safe') // safe, alert, danger
  const [contacts, setContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_contacts')
      return saved ? JSON.parse(saved) : MOCK_CONTACTS
    } catch { return MOCK_CONTACTS }
  })
  const [keywords, setKeywords] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_keywords')
      return saved ? JSON.parse(saved) : MOCK_KEYWORDS
    } catch { return MOCK_KEYWORDS }
  })
  const [alerts, setAlerts] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_alerts')
      return saved ? JSON.parse(saved) : MOCK_ALERTS
    } catch { return MOCK_ALERTS }
  })
  const [sensitivity, setSensitivity] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_settings')
      return saved ? (JSON.parse(saved).sensitivity || 'medium') : 'medium'
    } catch { return 'medium' }
  })
  const [dataRetention, setDataRetention] = useState(() => {
    try {
      const saved = localStorage.getItem('mp_settings')
      return saved ? (JSON.parse(saved).dataRetention || '7d') : '7d'
    } catch { return '7d' }
  })
  const [emergencyActive, setEmergencyActive] = useState(false)

  const login = (email, password) => {
    if (!email || !password || password.length < 6) return false
    const userData = { email, name: email.split('@')[0] }
    localStorage.setItem('mp_auth', JSON.stringify({ user: userData }))
    setUser(userData)
    setIsAuthenticated(true)
    return true
  }

  const register = (name, email, password) => {
    if (!name || !email || !password || password.length < 6) return false
    const userData = { email, name }
    localStorage.setItem('mp_auth', JSON.stringify({ user: userData }))
    setUser(userData)
    setIsAuthenticated(true)
    return true
  }

  const logout = () => {
    localStorage.removeItem('mp_auth')
    setIsAuthenticated(false)
    setUser(null)
  }

  const completeOnboarding = () => {
    localStorage.setItem('mp_onboarding', 'true')
    setHasSeenOnboarding(true)
  }

  const saveContacts = (newContacts) => {
    setContacts(newContacts)
    localStorage.setItem('mp_contacts', JSON.stringify(newContacts))
  }

  const saveKeywords = (newKeywords) => {
    setKeywords(newKeywords)
    localStorage.setItem('mp_keywords', JSON.stringify(newKeywords))
  }

  const saveSettings = (newSettings) => {
    setSensitivity(newSettings.sensitivity)
    setDataRetention(newSettings.dataRetention)
    localStorage.setItem('mp_settings', JSON.stringify(newSettings))
  }

  const triggerEmergency = () => {
    setEmergencyActive(true)
    setStatus('danger')
    setThreatLevel(95)
  }

  const cancelEmergency = () => {
    setEmergencyActive(false)
    setStatus('safe')
    setThreatLevel(15)
  }

  const confirmEmergency = () => {
    const newAlert = {
      id: Date.now(),
      type: 'sos',
      date: new Date().toISOString(),
      location: 'Localização atual - São Paulo, SP',
      status: 'pending',
      description: 'SOS acionado - Emergência confirmada',
    }
    setAlerts(prev => {
      const updated = [newAlert, ...prev]
      try { localStorage.setItem('mp_alerts', JSON.stringify(updated)) } catch (err) {
        console.error('[MeuProtetor] Falha ao persistir alerta de emergência:', err)
      }
      return updated
    })
    setEmergencyActive(false)
    setStatus('alert')
    setThreatLevel(60)
  }

  return (
    <AppContext.Provider value={{
      isAuthenticated, user, hasSeenOnboarding,
      threatLevel, setThreatLevel,
      status, setStatus,
      contacts, saveContacts,
      keywords, saveKeywords,
      alerts,
      sensitivity, dataRetention,
      saveSettings,
      emergencyActive,
      triggerEmergency, cancelEmergency, confirmEmergency,
      login, register, logout, completeOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext)
