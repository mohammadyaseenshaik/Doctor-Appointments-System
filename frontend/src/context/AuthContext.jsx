import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * AuthContext - provides authentication state and actions app-wide.
 *
 * Stores:
 * - user: { userId, name, email, role, token }
 * - isAuthenticated: boolean
 *
 * Actions:
 * - login(userData): store auth data in state + localStorage
 * - logout(): clear all auth data
 */
const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On app load, restore session from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('medbook_user')
      const savedToken = localStorage.getItem('medbook_token')
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
      }
    } catch (e) {
      console.error('Failed to restore session', e)
      localStorage.removeItem('medbook_user')
      localStorage.removeItem('medbook_token')
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Login — store user data and JWT token.
   * @param {Object} userData - { userId, name, email, role, token }
   */
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem('medbook_user', JSON.stringify(userData))
    localStorage.setItem('medbook_token', userData.token)
  }

  /**
   * Logout — clear all stored auth data.
   */
  const logout = () => {
    setUser(null)
    localStorage.removeItem('medbook_user')
    localStorage.removeItem('medbook_token')
  }

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'ADMIN'
  const isPatient = user?.role === 'PATIENT'

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      isAdmin,
      isPatient,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth hook — access auth context in any component.
 * Usage: const { user, login, logout, isAdmin } = useAuth()
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
