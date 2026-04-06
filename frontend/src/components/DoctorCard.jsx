import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserMd, FaStar, FaRupeeSign, FaHospital, FaGraduationCap, FaClock } from 'react-icons/fa'

/**
 * DoctorCard - displays doctor info in a visually rich card.
 * Clicking the card navigates to the booking page.
 *
 * @param {Object} doctor - doctor data from API
 * @param {boolean} adminMode - if true, shows edit/delete buttons instead of book
 * @param {Function} onEdit - admin edit handler
 * @param {Function} onDelete - admin delete handler
 */
const DoctorCard = ({ doctor, adminMode = false, onEdit, onDelete }) => {
  const navigate = useNavigate()

  const slots = doctor.availableSlots
    ? doctor.availableSlots.split(',').filter(Boolean)
    : []

  const handleBook = () => {
    if (!adminMode) {
      navigate(`/book/${doctor.id}`)
    }
  }

  return (
    <div
      className="doctor-card"
      style={{ padding: '1.5rem', cursor: adminMode ? 'default' : 'pointer' }}
      onClick={adminMode ? undefined : handleBook}
    >
      {/* Header */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <img
          src={doctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=4f46e5&color=fff&size=80`}
          alt={doctor.name}
          className="doctor-avatar"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=4f46e5&color=fff&size=80`
          }}
        />
        <div>
          <h4 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.25rem' }}>
            {doctor.name}
          </h4>
          <span style={{
            background: 'linear-gradient(135deg, rgba(79,70,229,0.2) 0%, rgba(124,58,237,0.2) 100%)',
            color: '#818cf8',
            padding: '0.2rem 0.6rem',
            borderRadius: '50px',
            fontSize: '0.78rem',
            fontWeight: 600,
            border: '1px solid rgba(79,70,229,0.3)'
          }}>
            {doctor.specialization}
          </span>
        </div>
      </div>

      {/* Details */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
        {doctor.qualification && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            <FaGraduationCap style={{ color: '#4f46e5', flexShrink: 0 }} />
            <span>{doctor.qualification}</span>
          </div>
        )}
        {doctor.hospital && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.85rem' }}>
            <FaHospital style={{ color: '#06b6d4', flexShrink: 0 }} />
            <span>{doctor.hospital}</span>
          </div>
        )}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#f59e0b', fontSize: '0.85rem' }}>
            <FaStar />
            <span>{doctor.experience} yrs exp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#10b981', fontSize: '0.85rem' }}>
            <FaRupeeSign />
            <span>{doctor.fee}/-</span>
          </div>
        </div>
      </div>

      {/* Available slots preview */}
      {slots.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.78rem', marginBottom: '0.5rem' }}>
            <FaClock />
            <span>Available slots: {slots.length}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {slots.slice(0, 4).map((slot) => (
              <span key={slot} style={{
                padding: '0.2rem 0.5rem',
                background: 'rgba(16,185,129,0.1)',
                color: '#10b981',
                borderRadius: '6px',
                fontSize: '0.75rem',
                border: '1px solid rgba(16,185,129,0.2)'
              }}>
                {slot}
              </span>
            ))}
            {slots.length > 4 && (
              <span style={{ color: '#64748b', fontSize: '0.75rem', alignSelf: 'center' }}>
                +{slots.length - 4} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Availability badge */}
      <div style={{ marginBottom: '1rem' }}>
        <span style={{
          padding: '0.25rem 0.7rem',
          borderRadius: '50px',
          fontSize: '0.75rem',
          fontWeight: 600,
          ...(doctor.available
            ? { background: 'rgba(16,185,129,0.15)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
            : { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' })
        }}>
          {doctor.available ? '✓ Available' : '✗ Unavailable'}
        </span>
      </div>

      {/* Actions */}
      {adminMode ? (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="btn-secondary-custom"
            style={{ flex: 1, justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
            onClick={(e) => { e.stopPropagation(); onEdit(doctor) }}
          >
            ✏️ Edit
          </button>
          <button
            className="btn-danger-custom"
            style={{ flex: 1, padding: '0.5rem', fontSize: '0.85rem' }}
            onClick={(e) => { e.stopPropagation(); onDelete(doctor.id) }}
          >
            🗑 Delete
          </button>
        </div>
      ) : (
        <button
          className="btn-primary-custom"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={!doctor.available}
        >
          {doctor.available ? '📅 Book Appointment' : 'Not Available'}
        </button>
      )}
    </div>
  )
}

export default DoctorCard
