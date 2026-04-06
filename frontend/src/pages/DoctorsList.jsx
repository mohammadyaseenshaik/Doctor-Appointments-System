import React, { useEffect, useState } from 'react'
import { getAllDoctors } from '../api/doctorApi'
import DoctorCard from '../components/DoctorCard'
import { FaSearch, FaFilter } from 'react-icons/fa'

/**
 * DoctorsList Page - browse and search all available doctors.
 * Supports: search by name, filter by specialization.
 */
const DoctorsList = () => {
  const [doctors, setDoctors] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [specialization, setSpecialization] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllDoctors()
      .then(res => {
        const data = res.data.data || []
        setDoctors(data)
        setFiltered(data)
      })
      .catch(err => console.error('Failed to load doctors:', err))
      .finally(() => setLoading(false))
  }, [])

  // Get unique specializations for filter dropdown
  const specializations = ['All', ...new Set(doctors.map(d => d.specialization))]

  // Filter/search logic
  useEffect(() => {
    let result = doctors
    if (specialization !== 'All') {
      result = result.filter(d => d.specialization === specialization)
    }
    if (search.trim()) {
      result = result.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase()) ||
        d.hospital?.toLowerCase().includes(search.toLowerCase())
      )
    }
    setFiltered(result)
  }, [search, specialization, doctors])

  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
      <p style={{ color: '#64748b' }}>Loading doctors...</p>
    </div>
  )

  return (
    <div className="container-custom fade-in-up" style={{ padding: '2rem 1.5rem' }}>
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">🩺 Our Specialists</h1>
        <p className="section-subtitle">
          Find and book appointments with {doctors.length} top doctors
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div style={{
        background: 'rgba(22,33,62,0.8)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <FaSearch style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5' }} />
          <input
            className="form-control-custom"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search by name, specialty, hospital..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            id="doctor-search"
          />
        </div>

        {/* Specialization filter */}
        <div style={{ position: 'relative', minWidth: '180px' }}>
          <FaFilter style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#4f46e5', pointerEvents: 'none' }} />
          <select
            className="form-control-custom"
            style={{ paddingLeft: '2.5rem', cursor: 'pointer' }}
            value={specialization}
            onChange={e => setSpecialization(e.target.value)}
            id="specialization-filter"
          >
            {specializations.map(s => (
              <option key={s} value={s} style={{ background: '#1a1a2e' }}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Specialization pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
        {specializations.map(s => (
          <button
            key={s}
            onClick={() => setSpecialization(s)}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '50px',
              border: `1px solid ${specialization === s ? '#4f46e5' : 'rgba(255,255,255,0.08)'}`,
              background: specialization === s ? 'rgba(79,70,229,0.2)' : 'transparent',
              color: specialization === s ? '#818cf8' : '#64748b',
              fontSize: '0.82rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results count */}
      <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.25rem' }}>
        Showing {filtered.length} of {doctors.length} doctors
        {search && ` for "${search}"`}
        {specialization !== 'All' && ` in ${specialization}`}
      </p>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No doctors found</h3>
          <p>Try adjusting your search or filter criteria</p>
          <button className="btn-secondary-custom" style={{ marginTop: '1rem' }} onClick={() => { setSearch(''); setSpecialization('All') }}>
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-3" id="doctors-grid">
          {filtered.map(doctor => (
            <DoctorCard key={doctor.id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  )
}

export default DoctorsList
