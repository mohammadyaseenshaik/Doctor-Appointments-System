import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * ProtectedRoute - wraps routes that require authentication.
 * Redirects to /login if user is not authenticated.
 *
 * @param {string} role - optional required role ('ADMIN' or 'PATIENT')
 */
export const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth()

  // Show nothing while restoring session from localStorage
  if (loading) return (
    <div className="page-loader">
      <div className="spinner" />
    </div>
  )

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Redirect if wrong role (e.g., patient accessing admin page)
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/dashboard'} replace />
  }

  return children
}

export default ProtectedRoute
