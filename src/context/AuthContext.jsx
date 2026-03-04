import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('sipp_user')
    return saved ? JSON.parse(saved) : null
  })

  const [token, setToken] = useState(() => localStorage.getItem('sipp_token') || null)

  const login = async (username, password) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (data.success) {
      setUser(data.user)
      setToken(data.token)
      localStorage.setItem('sipp_user', JSON.stringify(data.user))
      localStorage.setItem('sipp_token', data.token)
      return { success: true }
    }
    return { success: false, message: data.message }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('sipp_user')
    localStorage.removeItem('sipp_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)