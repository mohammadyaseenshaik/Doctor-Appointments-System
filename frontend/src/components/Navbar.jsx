import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FaStethoscope, FaBars, FaTimes, FaUser, FaSignOutAlt, FaTachometerAlt, FaCalendarAlt, FaUserMd, FaShieldAlt } from 'react-icons/fa'

/**
 * Navbar - responsive navigation for all pages.
 * Shows different links based on user role (PATIENT vs ADMIN).
 */
const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMenuOpen(false)
  }

  return (
    <nav style={{
      background: 'rgba(15, 15, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 999,
      padding: '0.875rem 0',
    }}>
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div style={{
            width: '36px', height: '36px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(79,70,229,0.4)'
          }}>
            <FaStethoscope style={{ color: 'white', fontSize: '1rem' }} />
          </div>
          <span style={{
            fontFamily: 'Outfit, sans-serif',
            fontWeight: 800,
            fontSize: '1.25rem',
            background: 'linear-gradient(135deg, #818cf8 0%, #4f46e5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>MedBook</span>
        </Link>

        {/* Desktop Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="desktop-nav">
          {isAuthenticated ? (
            <>
              {isAdmin ? (
                // Admin links
                <Link to="/admin" className="nav-link-custom">
                  <FaShieldAlt /> Admin Panel
                </Link>
              ) : (
                // Patient links
                <>
                  <Link to="/dashboard" className="nav-link-custom">
                    <FaTachometerAlt /> Dashboard
                  </Link>
                  <Link to="/doctors" className="nav-link-custom">
                    <FaUserMd /> Doctors
                  </Link>
                  <Link to="/appointments" className="nav-link-custom">
                    <FaCalendarAlt /> My Appointments
                  </Link>
                </>
              )}

              {/* User info + Logout */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '1rem', paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{user?.name}</div>
                  <div style={{ fontSize: '0.75rem', color: isAdmin ? '#818cf8' : '#10b981' }}>
                    {isAdmin ? '🛡 Admin' : '👤 Patient'}
                  </div>
                </div>
                <button onClick={handleLogout} className="btn-danger-custom" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-secondary-custom" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>Login</Link>
              <Link to="/login?tab=register" className="btn-primary-custom" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ background: 'none', border: 'none', color: '#f8fafc', fontSize: '1.25rem', cursor: 'pointer', display: 'none' }}
          className="mobile-menu-btn"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          background: 'rgba(26, 26, 46, 0.98)',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '1rem',
          animation: 'fadeInUp 0.2s ease'
        }}>
          {isAuthenticated ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {isAdmin ? (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="nav-link-custom">Admin Panel</Link>
              ) : (
                <>
                  <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="nav-link-custom">Dashboard</Link>
                  <Link to="/doctors" onClick={() => setMenuOpen(false)} className="nav-link-custom">Doctors</Link>
                  <Link to="/appointments" onClick={() => setMenuOpen(false)} className="nav-link-custom">My Appointments</Link>
                </>
              )}
              <button onClick={handleLogout} className="btn-danger-custom" style={{ marginTop: '0.5rem' }}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="nav-link-custom">Login</Link>
              <Link to="/login?tab=register" onClick={() => setMenuOpen(false)} className="btn-primary-custom" style={{ textDecoration: 'none', textAlign: 'center' }}>Sign Up</Link>
            </div>
          )}
        </div>
      )}

      <style>{`
        .nav-link-custom {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 0.875rem;
          color: #94a3b8;
          text-decoration: none;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .nav-link-custom:hover {
          color: #f8fafc;
          background: rgba(79,70,229,0.15);
        }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}

export default Navbar
