"use client"

import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setLoading(false)
  }, [])

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/login`, { email, password })
      const { token, user: userData } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userData))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(userData)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/register`, userData)
      const { token, user: newUser } = response.data

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(newUser))
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

      setUser(newUser)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
        errors: error.response?.data?.errors || [],
      }
    }
  }

  const updatePassword = async (currentPassword, newPassword) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/auth/update-password`, { currentPassword, newPassword })
      return { success: true, message: "Password updated successfully" }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Password update failed",
        errors: error.response?.data?.errors || [],
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
  }

  const value = {
    user,
    loading,
    login,
    register,
    updatePassword,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
