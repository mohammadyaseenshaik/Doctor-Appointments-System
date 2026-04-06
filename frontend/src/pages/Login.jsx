import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register as registerApi, login as loginApi } from '../api/authApi'
import toast from 'react-hot-toast'
import { FaStethoscope, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash, FaUserMd, FaShieldAlt } from 'react-icons/fa'

/**
 * Login/Signup Page
 * Dual-tab interface for Patient & Admin login and new user registration.
 * Uses JWT auth — on success, stores token and redirects based on role.
 */
const Login = () => {
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') === 'register' ? 'register' : 'login')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Login form state
  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  // Register form state
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', role: 'PATIENT' })

  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    }
  }, [isAuthenticated])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginApi(loginForm)
      login(res.data.data)
      toast.success(`Welcome back, ${res.data.data.name}! 👋`)
      navigate(res.data.data.role === 'ADMIN' ? '/admin' : '/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setError('All fields are required')
      return
    }
    setLoading(true)
    try {
      const res = await registerApi(registerForm)
      login(res.data.data)
      toast.success(`Welcome to MedBook, ${res.data.data.name}! 🎉`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const fillDemoCredentials = (type) => {
    if (type === 'admin') {
      setLoginForm({ email: 'admin@hospital.com', password: 'admin123' })
    } else {
      setLoginForm({ email: 'patient@example.com', password: 'patient123' })
    }
    setActiveTab('login')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at top, rgba(79,70,229,0.15) 0%, transparent 70%), var(--bg-primary)',
      padding: '2rem 1rem',
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Logo + Heading */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '64px', height: '64px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '18px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 32px rgba(79,70,229,0.4)',
            animation: 'pulse-glow 2s infinite'
          }}>
            <FaStethoscope style={{ color: 'white', fontSize: '1.75rem' }} />
          </div>
          <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '2rem', fontWeight: 800, marginBottom: '0.25rem' }}>
            MedBook
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Your trusted doctor appointment platform</p>
        </div>

        {/* Card */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '4px', marginBottom: '1.75rem' }}>
            {['login', 'register'].map(tab => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setError('') }}
                style={{
                  flex: 1,
                  padding: '0.625rem',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: activeTab === tab ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent',
                  color: activeTab === tab ? 'white' : '#64748b',
                  boxShadow: activeTab === tab ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
                }}
              >
                {tab === 'login' ? '🔑 Login' : '✨ Sign Up'}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && <div className="alert-custom alert-error">{error}</div>}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="fade-in">
              <div className="form-group">
                <label className="form-label-custom">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }} />
                  <input
                    className="form-control-custom"
                    style={{ paddingLeft: '2.5rem' }}
                    type="email"
                    placeholder="you@example.com"
                    value={loginForm.email}
                    onChange={e => setLoginForm(p => ({ ...p, email: e.target.value }))}
                    required
                    id="login-email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label-custom">Password</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }} />
                  <input
                    className="form-control-custom"
                    style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                    required
                    id="login-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                className="btn-primary-custom"
                style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginTop: '0.5rem' }}
                type="submit"
                disabled={loading}
                id="login-submit"
              >
                {loading ? '⏳ Signing in...' : '🔑 Login'}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegister} className="fade-in">
              <div className="form-group">
                <label className="form-label-custom">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <FaUser style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }} />
                  <input
                    className="form-control-custom"
                    style={{ paddingLeft: '2.5rem' }}
                    type="text"
                    placeholder="John Doe"
                    value={registerForm.name}
                    onChange={e => setRegisterForm(p => ({ ...p, name: e.target.value }))}
                    required
                    id="register-name"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label-custom">Email Address</label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }} />
                  <input
                    className="form-control-custom"
                    style={{ paddingLeft: '2.5rem' }}
                    type="email"
                    placeholder="you@example.com"
                    value={registerForm.email}
                    onChange={e => setRegisterForm(p => ({ ...p, email: e.target.value }))}
                    required
                    id="register-email"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label-custom">Password</label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }} />
                  <input
                    className="form-control-custom"
                    style={{ paddingLeft: '2.5rem' }}
                    type="password"
                    placeholder="Min 6 characters"
                    value={registerForm.password}
                    onChange={e => setRegisterForm(p => ({ ...p, password: e.target.value }))}
                    required
                    id="register-password"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label-custom">Register As</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  {[
                    { value: 'PATIENT', icon: <FaUserMd />, label: 'Patient' },
                    { value: 'ADMIN', icon: <FaShieldAlt />, label: 'Admin' }
                  ].map(({ value, icon, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRegisterForm(p => ({ ...p, role: value }))}
                      style={{
                        padding: '0.75rem',
                        border: `2px solid ${registerForm.role === value ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '10px',
                        background: registerForm.role === value ? 'rgba(79,70,229,0.15)' : 'transparent',
                        color: registerForm.role === value ? '#818cf8' : '#64748b',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      {icon} {label}
                    </button>
                  ))}
                </div>
              </div>
              <button
                className="btn-primary-custom"
                style={{ width: '100%', justifyContent: 'center', padding: '0.875rem', marginTop: '0.5rem' }}
                type="submit"
                disabled={loading}
                id="register-submit"
              >
                {loading ? '⏳ Creating account...' : '✨ Create Account'}
              </button>
            </form>
          )}

          {/* Demo credentials */}
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginBottom: '0.75rem' }}>
              🧪 Quick Demo Login
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                className="btn-secondary-custom"
                style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                onClick={() => fillDemoCredentials('patient')}
                id="demo-patient-btn"
              >
                👤 Patient Demo
              </button>
              <button
                className="btn-secondary-custom"
                style={{ justifyContent: 'center', fontSize: '0.8rem', padding: '0.5rem' }}
                onClick={() => fillDemoCredentials('admin')}
                id="demo-admin-btn"
              >
                🛡 Admin Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
