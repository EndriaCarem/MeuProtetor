import { createContext, useContext, useState, useEffect } from 'react'

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
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false)
  const [threatLevel, setThreatLevel] = useState(15)
  const [status, setStatus] = useState('safe') // safe, alert, danger
  const [contacts, setContacts] = useState(MOCK_CONTACTS)
  const [keywords, setKeywords] = useState(MOCK_KEYWORDS)
  const [alerts, setAlerts] = useState(MOCK_ALERTS)
  const [sensitivity, setSensitivity] = useState('medium')
  const [dataRetention, setDataRetention] = useState('7d')
  const [emergencyActive, setEmergencyActive] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem('mp_auth')
    const onboarding = localStorage.getItem('mp_onboarding')
    const savedContacts = localStorage.getItem('mp_contacts')
    const savedKeywords = localStorage.getItem('mp_keywords')
    const savedSettings = localStorage.getItem('mp_settings')
    
    if (auth) {
      const authData = JSON.parse(auth)
      setIsAuthenticated(true)
      setUser(authData.user)
    }
    if (onboarding) setHasSeenOnboarding(true)
    if (savedContacts) setContacts(JSON.parse(savedContacts))
    if (savedKeywords) setKeywords(JSON.parse(savedKeywords))
    if (savedSettings) {
      const s = JSON.parse(savedSettings)
      setSensitivity(s.sensitivity || 'medium')
      setDataRetention(s.dataRetention || '7d')
    }
  }, [])

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
    setAlerts(prev => [newAlert, ...prev])
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

export const useApp = () => useContext(AppContext)
