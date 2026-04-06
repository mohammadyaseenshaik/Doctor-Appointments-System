import React, { useEffect, useState } from 'react'
import { getAllAppointments, updateAppointmentStatus } from '../api/appointmentApi'
import { getAllDoctors, addDoctor, updateDoctor, deleteDoctor } from '../api/doctorApi'
import DoctorCard from '../components/DoctorCard'
import toast from 'react-hot-toast'
import { FaUserMd, FaCalendarAlt, FaChartBar, FaPlus, FaTimes, FaSync } from 'react-icons/fa'

/**
 * AdminDashboard Page - full control panel for administrators.
 *
 * Tabs:
 * 1. Overview - stats and recent appointments
 * 2. Appointments - all appointments with status update
 * 3. Doctors - add/edit/delete doctors
 */
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [appointments, setAppointments] = useState([])
  const [doctors, setDoctors] = useState([])
  const [loading, setLoading] = useState(true)
  const [showDoctorForm, setShowDoctorForm] = useState(false)
  const [editingDoctor, setEditingDoctor] = useState(null)
  const [statusFilter, setStatusFilter] = useState('ALL')

  const defaultDoctorForm = {
    name: '', specialization: '', experience: '', fee: '',
    qualification: '', hospital: '', imageUrl: '',
    availableSlots: '09:00,10:00,11:00,14:00,15:00,16:00,17:00',
    available: true
  }
  const [doctorForm, setDoctorForm] = useState(defaultDoctorForm)

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [apptRes, docRes] = await Promise.all([getAllAppointments(), getAllDoctors()])
      setAppointments(apptRes.data.data || [])
      setDoctors(docRes.data.data || [])
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  // ===== Status update =====
  const handleStatusUpdate = async (id, status) => {
    try {
      await updateAppointmentStatus(id, status)
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a))
      toast.success(`Status updated to ${status}`)
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  // ===== Doctor form =====
  const openAddForm = () => { setDoctorForm(defaultDoctorForm); setEditingDoctor(null); setShowDoctorForm(true) }
  const openEditForm = (doc) => {
    setDoctorForm({ ...doc, experience: doc.experience?.toString(), fee: doc.fee?.toString() })
    setEditingDoctor(doc)
    setShowDoctorForm(true)
  }

  const handleDoctorSubmit = async (e) => {
    e.preventDefault()
    const payload = { ...doctorForm, experience: parseInt(doctorForm.experience), fee: parseFloat(doctorForm.fee) }
    try {
      if (editingDoctor) {
        await updateDoctor(editingDoctor.id, payload)
        toast.success('Doctor updated!')
      } else {
        await addDoctor(payload)
        toast.success('Doctor added!')
      }
      setShowDoctorForm(false)
      fetchAll()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save doctor')
    }
  }

  const handleDeleteDoctor = async (id) => {
    if (!confirm('Are you sure you want to delete this doctor?')) return
    try {
      await deleteDoctor(id)
      toast.success('Doctor deleted')
      setDoctors(prev => prev.filter(d => d.id !== id))
    } catch (err) {
      toast.error('Failed to delete doctor')
    }
  }

  // ===== Stats =====
  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === 'PENDING').length,
    approved: appointments.filter(a => a.status === 'APPROVED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    doctors: doctors.length,
  }

  const filteredAppointments = statusFilter === 'ALL' ? appointments : appointments.filter(a => a.status === statusFilter)

  const getStatusBadge = (status) => {
    const cls = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected', COMPLETED: 'badge-completed' }
    return <span className={cls[status] || 'badge-pending'}>{status}</span>
  }

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
      <p style={{ color: '#64748b' }}>Loading admin panel...</p>
    </div>
  )

  return (
    <div className="container-custom fade-in-up" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="section-title">🛡 Admin Dashboard</h1>
          <p className="section-subtitle">Manage doctors, appointments, and system settings</p>
        </div>
        <button className="btn-secondary-custom" onClick={fetchAll} style={{ fontSize: '0.875rem' }}>
          <FaSync /> Refresh
        </button>
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '4px', marginBottom: '2rem', width: 'fit-content' }}>
        {[
          { key: 'overview', icon: <FaChartBar />, label: 'Overview' },
          { key: 'appointments', icon: <FaCalendarAlt />, label: `Appointments (${stats.total})` },
          { key: 'doctors', icon: <FaUserMd />, label: `Doctors (${stats.doctors})` },
        ].map(({ key, icon, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            style={{
              padding: '0.625rem 1.25rem',
              border: 'none',
              borderRadius: '10px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              transition: 'all 0.2s',
              background: activeTab === key ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' : 'transparent',
              color: activeTab === key ? 'white' : '#64748b',
              boxShadow: activeTab === key ? '0 4px 12px rgba(79,70,229,0.3)' : 'none',
            }}
            id={`admin-tab-${key}`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* ===== OVERVIEW TAB ===== */}
      {activeTab === 'overview' && (
        <div className="fade-in">
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {[
              { label: 'Total Appointments', value: stats.total, emoji: '📅', color: '#4f46e5' },
              { label: 'Pending', value: stats.pending, emoji: '⏳', color: '#f59e0b' },
              { label: 'Approved', value: stats.approved, emoji: '✅', color: '#10b981' },
              { label: 'Doctors', value: stats.doctors, emoji: '👨‍⚕️', color: '#818cf8' },
            ].map(({ label, value, emoji, color }) => (
              <div key={label} className="stat-card">
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{emoji}</div>
                <div className="stat-number" style={{ color, WebkitTextFillColor: color }}>{value}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>

          {/* Recent appointments preview */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700, marginBottom: '1.25rem' }}>
              🕐 Recent Appointments
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="table-custom">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.slice(0, 5).map(appt => (
                    <tr key={appt.id}>
                      <td>{appt.user?.name}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{appt.doctor?.name}</div>
                        <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{appt.doctor?.specialization}</div>
                      </td>
                      <td>
                        <div>{appt.date}</div>
                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{appt.time}</div>
                      </td>
                      <td>{getStatusBadge(appt.status)}</td>
                      <td>
                        <span style={{ fontSize: '0.8rem', color: appt.paymentStatus === 'PAID' ? '#10b981' : '#f59e0b' }}>
                          {appt.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ===== APPOINTMENTS TAB ===== */}
      {activeTab === 'appointments' && (
        <div className="fade-in">
          {/* Status filter */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {['ALL', 'PENDING', 'APPROVED', 'COMPLETED', 'REJECTED'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '0.4rem 1rem', borderRadius: '50px',
                  border: `1px solid ${statusFilter === s ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`,
                  background: statusFilter === s ? 'rgba(79,70,229,0.2)' : 'transparent',
                  color: statusFilter === s ? '#818cf8' : '#64748b',
                  fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', overflowX: 'auto' }}>
            <table className="table-custom" id="admin-appointments-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Date & Time</th>
                  <th>Status</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appt => (
                  <tr key={appt.id}>
                    <td style={{ color: '#64748b' }}>#{appt.id}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{appt.user?.name}</div>
                      <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{appt.user?.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{appt.doctor?.name}</div>
                      <div style={{ color: '#818cf8', fontSize: '0.78rem' }}>{appt.doctor?.specialization}</div>
                    </td>
                    <td>
                      <div>{appt.date}</div>
                      <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{appt.time}</div>
                    </td>
                    <td>{getStatusBadge(appt.status)}</td>
                    <td>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: appt.paymentStatus === 'PAID' ? '#10b981' : '#f59e0b' }}>
                        {appt.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
                        {appt.status === 'PENDING' && (
                          <>
                            <button
                              className="btn-success-custom"
                              style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
                              onClick={() => handleStatusUpdate(appt.id, 'APPROVED')}
                            >
                              ✅ Approve
                            </button>
                            <button
                              className="btn-danger-custom"
                              style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
                              onClick={() => handleStatusUpdate(appt.id, 'REJECTED')}
                            >
                              ❌ Reject
                            </button>
                          </>
                        )}
                        {appt.status === 'APPROVED' && (
                          <button
                            className="btn-primary-custom"
                            style={{ padding: '0.3rem 0.7rem', fontSize: '0.78rem' }}
                            onClick={() => handleStatusUpdate(appt.id, 'COMPLETED')}
                          >
                            🏆 Complete
                          </button>
                        )}
                        {(appt.status === 'COMPLETED' || appt.status === 'REJECTED') && (
                          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredAppointments.length === 0 && (
              <div className="empty-state"><div className="empty-state-icon">📋</div><h3>No appointments found</h3></div>
            )}
          </div>
        </div>
      )}

      {/* ===== DOCTORS TAB ===== */}
      {activeTab === 'doctors' && (
        <div className="fade-in">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
            <button className="btn-primary-custom" onClick={openAddForm} id="add-doctor-btn">
              <FaPlus /> Add New Doctor
            </button>
          </div>

          <div className="grid-3" id="admin-doctors-grid">
            {doctors.map(doctor => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                adminMode={true}
                onEdit={openEditForm}
                onDelete={handleDeleteDoctor}
              />
            ))}
          </div>

          {doctors.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">👨‍⚕️</div>
              <h3>No doctors added yet</h3>
              <button className="btn-primary-custom" style={{ marginTop: '1rem' }} onClick={openAddForm}>
                Add First Doctor
              </button>
            </div>
          )}
        </div>
      )}

      {/* ===== Doctor Form Modal ===== */}
      {showDoctorForm && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setShowDoctorForm(false)}>
          <div className="modal-box" style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 700 }}>
                {editingDoctor ? '✏️ Edit Doctor' : '➕ Add New Doctor'}
              </h3>
              <button onClick={() => setShowDoctorForm(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleDoctorSubmit}>
              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label-custom">Doctor Name *</label>
                  <input className="form-control-custom" placeholder="Dr. Full Name" required
                    value={doctorForm.name} onChange={e => setDoctorForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label-custom">Specialization *</label>
                  <input className="form-control-custom" placeholder="e.g. Cardiologist" required
                    value={doctorForm.specialization} onChange={e => setDoctorForm(p => ({ ...p, specialization: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label-custom">Experience (years) *</label>
                  <input className="form-control-custom" type="number" min="0" placeholder="8" required
                    value={doctorForm.experience} onChange={e => setDoctorForm(p => ({ ...p, experience: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label-custom">Consultation Fee (₹) *</label>
                  <input className="form-control-custom" type="number" min="0" placeholder="500" required
                    value={doctorForm.fee} onChange={e => setDoctorForm(p => ({ ...p, fee: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label-custom">Qualification</label>
                  <input className="form-control-custom" placeholder="MBBS, MD" 
                    value={doctorForm.qualification} onChange={e => setDoctorForm(p => ({ ...p, qualification: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label-custom">Hospital</label>
                  <input className="form-control-custom" placeholder="Hospital Name" 
                    value={doctorForm.hospital} onChange={e => setDoctorForm(p => ({ ...p, hospital: e.target.value }))} />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label-custom">Profile Image URL</label>
                <input className="form-control-custom" placeholder="https://..." 
                  value={doctorForm.imageUrl} onChange={e => setDoctorForm(p => ({ ...p, imageUrl: e.target.value }))} />
              </div>

              <div className="form-group">
                <label className="form-label-custom">Available Time Slots (comma-separated)</label>
                <input className="form-control-custom" placeholder="09:00,10:00,11:00,14:00,15:00"
                  value={doctorForm.availableSlots} onChange={e => setDoctorForm(p => ({ ...p, availableSlots: e.target.value }))} />
                <small style={{ color: '#64748b', fontSize: '0.78rem' }}>Format: HH:MM,HH:MM (e.g., 09:00,10:00,14:00)</small>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <input
                  type="checkbox" id="doctor-available"
                  checked={doctorForm.available}
                  onChange={e => setDoctorForm(p => ({ ...p, available: e.target.checked }))}
                  style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
                />
                <label htmlFor="doctor-available" className="form-label-custom" style={{ margin: 0 }}>
                  Available for appointments
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button className="btn-secondary-custom" type="button" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowDoctorForm(false)}>
                  Cancel
                </button>
                <button className="btn-primary-custom" type="submit" style={{ flex: 1, justifyContent: 'center' }} id="submit-doctor-form">
                  {editingDoctor ? '✅ Update Doctor' : '➕ Add Doctor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
