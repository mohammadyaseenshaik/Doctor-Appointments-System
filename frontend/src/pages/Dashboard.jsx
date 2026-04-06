import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getUserAppointments } from '../api/appointmentApi'
import { getAllDoctors } from '../api/doctorApi'
import { FaCalendarAlt, FaUserMd, FaCheckCircle, FaClock, FaArrowRight, FaHeartbeat } from 'react-icons/fa'

/**
 * Patient Dashboard - home page after patient login.
 * Shows: welcome message, quick stats, recent appointments, and quick actions.
 */
const Dashboard = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [apptRes, docRes] = await Promise.all([
          getUserAppointments(user.userId),
          getAllDoctors()
        ])
        setAppointments(apptRes.data.data || [])
        setDoctors(docRes.data.data || [])
      } catch (err) {
        console.error('Dashboard fetch error:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user.userId])

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    approved: appointments.filter(a => a.status === 'APPROVED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
  }

  const getStatusBadge = (status) => {
    const cls = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected', COMPLETED: 'badge-completed' }
    return <span className={cls[status] || 'badge-pending'}>{status}</span>
  }

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
      <p style={{ color: '#64748b' }}>Loading your dashboard...</p>
    </div>
  )

  return (
    <div className="container-custom fade-in-up" style={{ padding: '2rem 1.5rem' }}>
      {/* Welcome Hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(124,58,237,0.15) 50%, rgba(6,182,212,0.1) 100%)',
        border: '1px solid rgba(79,70,229,0.2)',
        borderRadius: '20px',
        padding: '2.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-20px', right: '-20px',
          width: '200px', height: '200px',
          background: 'radial-gradient(circle, rgba(79,70,229,0.15) 0%, transparent 70%)',
          borderRadius: '50%'
        }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{
            width: '56px', height: '56px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem', boxShadow: '0 8px 20px rgba(79,70,229,0.3)'
          }}>
            <FaHeartbeat style={{ color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.25rem' }}>
              Welcome back, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p style={{ color: '#94a3b8', margin: 0 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link to="/doctors" className="btn-primary-custom" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
            <FaUserMd /> Book Appointment
          </Link>
          <Link to="/appointments" className="btn-secondary-custom" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
            <FaCalendarAlt /> View History
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        {[
          { label: 'Total Appointments', value: stats.total, icon: '📅', color: '#4f46e5' },
          { label: 'Pending', value: stats.pending, icon: '⏳', color: '#f59e0b' },
          { label: 'Approved', value: stats.approved, icon: '✅', color: '#10b981' },
          { label: 'Completed', value: stats.completed, icon: '🏆', color: '#818cf8' },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
            <div className="stat-number" style={{ background: `${color}`, WebkitBackgroundClip: 'initial', WebkitTextFillColor: color, backgroundClip: 'initial' }}>
              {value}
            </div>
            <div className="stat-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2">
        {/* Recent Appointments */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700 }}>
              📅 Recent Appointments
            </h3>
            <Link to="/appointments" style={{ color: '#818cf8', fontSize: '0.85rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              View all <FaArrowRight style={{ fontSize: '0.7rem' }} />
            </Link>
          </div>
          {appointments.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📋</div>
              <p>No appointments yet</p>
              <Link to="/doctors" className="btn-primary-custom" style={{ textDecoration: 'none', marginTop: '1rem', display: 'inline-flex', fontSize: '0.85rem' }}>
                Book your first one
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {appointments.slice(0, 4).map(appt => (
                <div key={appt.id} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: '10px',
                  padding: '0.875rem',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                      Dr. {appt.doctor?.name}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
                      {appt.date} • {appt.time}
                    </div>
                  </div>
                  {getStatusBadge(appt.status)}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick actions + Available doctors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              ⚡ Quick Actions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/doctors" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(79,70,229,0.15) 0%, rgba(124,58,237,0.1) 100%)',
                  border: '1px solid rgba(79,70,229,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>🩺</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Find a Doctor</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>Browse {doctors.length} specialists</div>
                  </div>
                </div>
              </Link>
              <Link to="/appointments" style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'linear-gradient(135deg, rgba(6,182,212,0.1) 0%, rgba(79,70,229,0.1) 100%)',
                  border: '1px solid rgba(6,182,212,0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex', alignItems: 'center', gap: '0.875rem',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                  <span style={{ fontSize: '1.5rem' }}>📋</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>Appointment History</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{stats.total} total appointments</div>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Health tip */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '16px',
            padding: '1.25rem',
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>💡</div>
            <h4 style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.375rem' }}>
              Health Tip of the Day
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0 }}>
              Regular health check-ups help detect potential problems early. Book an appointment with a specialist today!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
