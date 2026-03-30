import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Shield, Eye, EyeOff } from 'lucide-react'

export default function AuthScreen() {
  const [tab, setTab] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login, register } = useApp()

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [regForm, setRegForm] = useState({ name: '', email: '', password: '', confirm: '' })

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    if (!loginForm.email || !loginForm.password) {
      setError('Preencha todos os campos')
      return
    }
    login(loginForm.email, loginForm.password)
  }

  const handleRegister = (e) => {
    e.preventDefault()
    setError('')
    if (!regForm.name || !regForm.email || !regForm.password) {
      setError('Preencha todos os campos')
      return
    }
    if (regForm.password !== regForm.confirm) {
      setError('Senhas não coincidem')
      return
    }
    register(regForm.name, regForm.email, regForm.password)
  }

  const inputStyle = {
    width: '100%',
    backgroundColor: '#0a0a0f',
    border: '1px solid #2d1b4e',
    borderRadius: '10px',
    padding: '12px 16px',
    color: '#e2e8f0',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0a0a0f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#6b21a820',
          border: '3px solid #6b21a8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 40px #6b21a840',
        }}>
          <Shield size={40} color="#a855f7" />
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#e2e8f0', letterSpacing: '-1px' }}>
          Meu<span style={{ color: '#a855f7' }}>Protetor</span>
        </h1>
        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '4px' }}>Sua segurança, nossa missão</p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: '380px',
        backgroundColor: '#1a1a2e',
        border: '1px solid #2d1b4e',
        borderRadius: '20px',
        padding: '28px',
      }}>
        {/* Tabs */}
        <div style={{
          display: 'flex',
          backgroundColor: '#0a0a0f',
          borderRadius: '10px',
          padding: '4px',
          marginBottom: '24px',
        }}>
          {['login', 'register'].map(t => (
            <button
              key={t}
              onClick={() => { setTab(t); setError('') }}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: tab === t ? '#6b21a8' : 'transparent',
                color: tab === t ? 'white' : '#6b7280',
                fontWeight: tab === t ? '600' : '400',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'all 0.2s',
              }}
            >
              {t === 'login' ? 'Entrar' : 'Cadastrar'}
            </button>
          ))}
        </div>

        {error && (
          <div style={{
            backgroundColor: '#dc262620',
            border: '1px solid #dc2626',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Email</label>
              <input
                type="email"
                style={inputStyle}
                value={loginForm.email}
                onChange={e => setLoginForm({ ...loginForm, email: e.target.value })}
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Senha</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  style={{ ...inputStyle, paddingRight: '44px' }}
                  value={loginForm.password}
                  onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#6b21a8',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '4px',
                boxShadow: '0 0 20px #6b21a840',
              }}
            >
              Entrar
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Nome</label>
              <input type="text" style={inputStyle} value={regForm.name} onChange={e => setRegForm({ ...regForm, name: e.target.value })} placeholder="Seu nome" />
            </div>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Email</label>
              <input type="email" style={inputStyle} value={regForm.email} onChange={e => setRegForm({ ...regForm, email: e.target.value })} placeholder="seu@email.com" />
            </div>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Senha</label>
              <input type="password" style={inputStyle} value={regForm.password} onChange={e => setRegForm({ ...regForm, password: e.target.value })} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '6px', display: 'block' }}>Confirmar Senha</label>
              <input type="password" style={inputStyle} value={regForm.confirm} onChange={e => setRegForm({ ...regForm, confirm: e.target.value })} placeholder="••••••••" />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#6b21a8',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '15px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '4px',
                boxShadow: '0 0 20px #6b21a840',
              }}
            >
              Cadastrar
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
