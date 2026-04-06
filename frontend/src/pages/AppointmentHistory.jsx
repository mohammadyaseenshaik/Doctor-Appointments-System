import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserAppointments } from '../api/appointmentApi'
import { FaCalendarAlt, FaUserMd, FaClock, FaSync, FaNotesMedical } from 'react-icons/fa'

/**
 * AppointmentHistory Page - patient views all their appointments.
 * Supports filtering by status.
 */
const AppointmentHistory = () => {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [filtered, setFiltered] = useState([])
  const [filter, setFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)

  const fetchAppointments = async () => {
    setLoading(true)
    try {
      const res = await getUserAppointments(user.userId)
      const data = (res.data.data || []).sort((a, b) => new Date(b.date) - new Date(a.date))
      setAppointments(data)
      setFiltered(data)
    } catch (err) {
      console.error('Failed to fetch appointments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAppointments() }, [user.userId])

  useEffect(() => {
    if (filter === 'ALL') setFiltered(appointments)
    else setFiltered(appointments.filter(a => a.status === filter))
  }, [filter, appointments])

  const getStatusBadge = (status) => {
    const classes = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected', COMPLETED: 'badge-completed' }
    return <span className={classes[status] || 'badge-pending'}>{status}</span>
  }

  const getPaymentBadge = (status) => {
    if (status === 'PAID') return <span style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>💳 Paid</span>
    if (status === 'FAILED') return <span style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>❌ Failed</span>
    return <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', padding: '0.2rem 0.6rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 600 }}>⏳ Pending</span>
  }

  const counts = {
    ALL: appointments.length,
    PENDING: appointments.filter(a => a.status === 'PENDING').length,
    APPROVED: appointments.filter(a => a.status === 'APPROVED').length,
    COMPLETED: appointments.filter(a => a.status === 'COMPLETED').length,
    REJECTED: appointments.filter(a => a.status === 'REJECTED').length,
  }

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
      <p style={{ color: '#64748b' }}>Loading your appointments...</p>
    </div>
  )

  return (
    <div className="container-custom fade-in-up" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <h1 className="section-title">📋 My Appointments</h1>
          <p className="section-subtitle">Track all your doctor visits in one place</p>
        </div>
        <button
          className="btn-secondary-custom"
          onClick={fetchAppointments}
          style={{ fontSize: '0.875rem' }}
          id="refresh-appointments"
        >
          <FaSync /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {[
          { key: 'ALL', label: '📋 All', emoji: '' },
          { key: 'PENDING', label: '⏳ Pending', emoji: '' },
          { key: 'APPROVED', label: '✅ Approved', emoji: '' },
          { key: 'COMPLETED', label: '🏆 Completed', emoji: '' },
          { key: 'REJECTED', label: '❌ Rejected', emoji: '' },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '50px',
              border: `1px solid ${filter === key ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`,
              background: filter === key ? 'rgba(79,70,229,0.2)' : 'transparent',
              color: filter === key ? '#818cf8' : '#64748b',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {label} ({counts[key]})
          </button>
        ))}
      </div>

      {/* Appointment cards */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><FaCalendarAlt /></div>
          <h3>No appointments found</h3>
          <p>{filter === 'ALL' ? 'You have not booked any appointments yet.' : `No ${filter.toLowerCase()} appointments.`}</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} id="appointments-list">
          {filtered.map(appt => (
            <div
              key={appt.id}
              className="glass-card"
              style={{ padding: '1.5rem', cursor: 'default' }}
            >
              <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                {/* Doctor info */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1 }}>
                  <img
                    src={appt.doctor?.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(appt.doctor?.name || 'Dr')}&background=4f46e5&color=fff`}
                    alt={appt.doctor?.name}
                    style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(79,70,229,0.3)', flexShrink: 0 }}
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=Dr&background=4f46e5&color=fff` }}
                  />
                  <div>
                    <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {appt.doctor?.name}
                    </h4>
                    <p style={{ color: '#818cf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                      {appt.doctor?.specialization}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>
                      {appt.doctor?.hospital}
                    </p>
                  </div>
                </div>

                {/* Appointment details */}
                <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.25rem' }}>Date & Time</div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                      <FaCalendarAlt style={{ marginRight: '4px', color: '#4f46e5' }} />
                      {new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                      <FaClock style={{ marginRight: '4px', color: '#06b6d4' }} />
                      {appt.time}
                    </div>
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.375rem' }}>Status</div>
                    {getStatusBadge(appt.status)}
                  </div>

                  <div>
                    <div style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.375rem' }}>Payment</div>
                    {getPaymentBadge(appt.paymentStatus)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {appt.notes && (
                <div style={{
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '8px',
                  borderLeft: '3px solid rgba(79,70,229,0.4)',
                  display: 'flex', gap: '0.5rem', alignItems: 'flex-start'
                }}>
                  <FaNotesMedical style={{ color: '#818cf8', flexShrink: 0, marginTop: '2px' }} />
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                    <strong style={{ color: '#f8fafc' }}>Notes: </strong>{appt.notes}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AppointmentHistory
