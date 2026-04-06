import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDoctorById } from '../api/doctorApi'
import { bookAppointment } from '../api/appointmentApi'
import { useAuth } from '../context/AuthContext'
import PaymentModal from '../components/PaymentModal'
import toast from 'react-hot-toast'
import { FaArrowLeft, FaCalendar, FaClock, FaRupeeSign, FaExclamationCircle } from 'react-icons/fa'

/**
 * BookAppointment Page
 * Shows doctor info, date picker, time slot selector, and notes.
 * After booking, opens the PaymentModal for consultation fee.
 */
const BookAppointment = () => {
  const { doctorId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [doctor, setDoctor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)

  const [selectedDate, setSelectedDate] = useState('')
  const [selectedSlot, setSelectedSlot] = useState('')
  const [notes, setNotes] = useState('')
  const [bookedAppointment, setBookedAppointment] = useState(null)
  const [showPayment, setShowPayment] = useState(false)
  const [error, setError] = useState('')

  // Minimum date = tomorrow
  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  // Maximum date = 30 days from now
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + 30)
  const maxDateStr = maxDate.toISOString().split('T')[0]

  useEffect(() => {
    getDoctorById(doctorId)
      .then(res => setDoctor(res.data.data))
      .catch(() => { toast.error('Doctor not found'); navigate('/doctors') })
      .finally(() => setLoading(false))
  }, [doctorId])

  const slots = doctor?.availableSlots
    ? doctor.availableSlots.split(',').filter(Boolean)
    : []

  const handleBook = async () => {
    setError('')
    if (!selectedDate) { setError('Please select an appointment date'); return }
    if (!selectedSlot) { setError('Please select a time slot'); return }

    setBookingLoading(true)
    try {
      const res = await bookAppointment({
        doctorId: parseInt(doctorId),
        date: selectedDate,
        time: selectedSlot,
        notes: notes.trim(),
      })
      const appt = res.data.data
      setBookedAppointment(appt)
      toast.success('Appointment booked! Proceed to payment.')
      setShowPayment(true)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to book appointment'
      setError(msg)
      toast.error(msg)
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
    </div>
  )

  if (!doctor) return null

  return (
    <div className="container-custom fade-in-up" style={{ padding: '2rem 1.5rem', maxWidth: '900px' }}>
      {/* Back button */}
      <button
        className="btn-secondary-custom"
        style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}
        onClick={() => navigate('/doctors')}
      >
        <FaArrowLeft /> Back to Doctors
      </button>

      <h1 className="section-title" style={{ marginBottom: '0.25rem' }}>Book Appointment</h1>
      <p className="section-subtitle" style={{ marginBottom: '2rem' }}>Fill in the details to schedule your visit</p>

      <div className="grid-2" style={{ alignItems: 'start' }}>
        {/* Left: Doctor info card */}
        <div className="glass-card" style={{ padding: '1.75rem', position: 'sticky', top: '80px' }}>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem' }}>
            <img
              src={doctor.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=4f46e5&color=fff&size=100`}
              alt={doctor.name}
              className="doctor-avatar"
              style={{ width: '90px', height: '90px' }}
              onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=4f46e5&color=fff` }}
            />
            <div>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '0.375rem' }}>{doctor.name}</h3>
              <p style={{ color: '#818cf8', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{doctor.specialization}</p>
              {doctor.qualification && <p style={{ color: '#64748b', fontSize: '0.8rem' }}>{doctor.qualification}</p>}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.5rem' }}>
            {doctor.hospital && (
              <div style={{ color: '#94a3b8', fontSize: '0.875rem' }}>🏥 {doctor.hospital}</div>
            )}
            <div style={{ color: '#f59e0b', fontSize: '0.875rem' }}>⭐ {doctor.experience} years experience</div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.1) 100%)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Consultation Fee</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981', fontFamily: 'Outfit, sans-serif', margin: 0 }}>
              <FaRupeeSign style={{ fontSize: '1.25rem', verticalAlign: 'middle' }} />
              {doctor.fee}
            </p>
          </div>
        </div>

        {/* Right: Booking form */}
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1.5rem' }}>
            📅 Schedule Details
          </h3>

          {error && (
            <div className="alert-custom alert-error" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaExclamationCircle /> {error}
            </div>
          )}

          {/* Date picker */}
          <div className="form-group">
            <label className="form-label-custom">
              <FaCalendar style={{ marginRight: '6px', color: '#4f46e5' }} />
              Appointment Date
            </label>
            <input
              className="form-control-custom"
              type="date"
              min={minDateStr}
              max={maxDateStr}
              value={selectedDate}
              onChange={e => { setSelectedDate(e.target.value); setSelectedSlot('') }}
              id="appointment-date"
            />
          </div>

          {/* Time slots */}
          <div className="form-group">
            <label className="form-label-custom">
              <FaClock style={{ marginRight: '6px', color: '#4f46e5' }} />
              Available Time Slots
            </label>
            {slots.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginTop: '0.25rem' }}>
                {slots.map(slot => (
                  <button
                    key={slot}
                    type="button"
                    className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                    onClick={() => setSelectedSlot(slot)}
                    id={`slot-${slot}`}
                  >
                    🕐 {slot}
                  </button>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No slots configured for this doctor</p>
            )}
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label-custom">📝 Notes / Symptoms (optional)</label>
            <textarea
              className="form-control-custom"
              rows={3}
              placeholder="Describe your symptoms or reason for visit..."
              value={notes}
              onChange={e => setNotes(e.target.value)}
              style={{ resize: 'vertical' }}
              id="appointment-notes"
            />
          </div>

          {/* Summary */}
          {selectedDate && selectedSlot && (
            <div style={{
              background: 'rgba(79,70,229,0.1)',
              border: '1px solid rgba(79,70,229,0.2)',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1rem'
            }} className="fade-in">
              <h4 style={{ fontSize: '0.875rem', color: '#818cf8', marginBottom: '0.5rem', fontWeight: 600 }}>
                📋 Booking Summary
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0' }}>
                📅 Date: <strong style={{ color: '#f8fafc' }}>{new Date(selectedDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0' }}>
                🕐 Time: <strong style={{ color: '#f8fafc' }}>{selectedSlot}</strong>
              </p>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '0.2rem 0' }}>
                💰 Fee: <strong style={{ color: '#10b981' }}>₹{doctor.fee}</strong>
              </p>
            </div>
          )}

          <button
            className="btn-primary-custom"
            style={{ width: '100%', justifyContent: 'center', padding: '0.875rem' }}
            onClick={handleBook}
            disabled={bookingLoading || !selectedDate || !selectedSlot}
            id="book-appointment-btn"
          >
            {bookingLoading ? '⏳ Booking...' : '📅 Confirm & Proceed to Payment'}
          </button>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && bookedAppointment && (
        <PaymentModal
          appointment={bookedAppointment}
          fee={doctor.fee}
          onClose={() => { setShowPayment(false); navigate('/appointments') }}
          onSuccess={() => setTimeout(() => navigate('/appointments'), 2000)}
        />
      )}
    </div>
  )
}

export default BookAppointment
