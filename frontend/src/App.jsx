import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Navbar from './components/Navbar'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import DoctorsList from './pages/DoctorsList'
import BookAppointment from './pages/BookAppointment'
import AppointmentHistory from './pages/AppointmentHistory'
import AdminDashboard from './pages/AdminDashboard'

/**
 * App - Root component with routing and auth provider.
 *
 * Routes:
 * /                → Redirect to /login
 * /login           → Login/Signup page (public)
 * /dashboard       → Patient Dashboard (PATIENT only)
 * /doctors         → Doctor Listing (PATIENT only)
 * /book/:doctorId  → Book Appointment (PATIENT only)
 * /appointments    → Appointment History (PATIENT only)
 * /admin           → Admin Dashboard (ADMIN only)
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />

              {/* Patient routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute role="PATIENT">
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/doctors" element={
                <ProtectedRoute role="PATIENT">
                  <DoctorsList />
                </ProtectedRoute>
              } />
              <Route path="/book/:doctorId" element={
                <ProtectedRoute role="PATIENT">
                  <BookAppointment />
                </ProtectedRoute>
              } />
              <Route path="/appointments" element={
                <ProtectedRoute role="PATIENT">
                  <AppointmentHistory />
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute role="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              {/* 404 fallback */}
              <Route path="*" element={
                <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                  <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🔍</div>
                  <h2 style={{ color: '#f8fafc', fontFamily: 'Outfit, sans-serif' }}>404 - Page Not Found</h2>
                  <p style={{ marginBottom: '1.5rem' }}>The page you're looking for doesn't exist.</p>
                  <a href="/login" className="btn-primary-custom" style={{ textDecoration: 'none' }}>Go to Login</a>
                </div>
              } />
            </Routes>
          </main>

          {/* Footer */}
          <footer style={{
            background: 'rgba(15,15,26,0.8)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
            padding: '1.5rem',
            textAlign: 'center',
            color: '#64748b',
            fontSize: '0.85rem'
          }}>
            <div className="container-custom">
              <p style={{ margin: 0 }}>
                🏥 <strong style={{ color: '#818cf8' }}>MedBook</strong> — Doctor Appointment System &nbsp;|&nbsp;
                Built with ❤️ using React 18 + Spring Boot 3 &nbsp;|&nbsp;
                <span style={{ color: '#4f46e5' }}>© 2024</span>
              </p>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
