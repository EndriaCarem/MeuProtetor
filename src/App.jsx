import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import OnboardingScreen from './screens/OnboardingScreen'
import AuthScreen from './screens/AuthScreen'
import DashboardScreen from './screens/DashboardScreen'
import EmergencyScreen from './screens/EmergencyScreen'
import SettingsScreen from './screens/SettingsScreen'
import HistoryScreen from './screens/HistoryScreen'

function AppRoutes() {
  const { isAuthenticated, hasSeenOnboarding, emergencyActive } = useApp()

  if (!hasSeenOnboarding) {
    return (
      <Routes>
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    )
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    )
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<DashboardScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/emergency" element={<EmergencyScreen />} />
        <Route path="/settings" element={<SettingsScreen />} />
        <Route path="/history" element={<HistoryScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {emergencyActive && <EmergencyScreen overlay />}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ backgroundColor: '#0a0a0f', minHeight: '100vh', color: '#e2e8f0' }}>
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}
