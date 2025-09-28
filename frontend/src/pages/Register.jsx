"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: "",
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Name validation
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = "Name must be between 20 and 60 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please provide a valid email"
    }

    // Password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/
    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8-16 characters with at least one uppercase letter and one special character"
    }

    // Address validation
    if (formData.address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters"
    }

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForm()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setErrors({})
    setLoading(true)

    const result = await register(formData)

    if (result.success) {
      navigate("/")
    } else {
      if (result.errors && result.errors.length > 0) {
        const errorObj = {}
        result.errors.forEach((error) => {
          errorObj[error.path] = error.msg
        })
        setErrors(errorObj)
      } else {
        setErrors({ general: result.message })
      }
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`input-field ${errors.name ? "border-red-500" : ""}`}
              required
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`input-field ${errors.email ? "border-red-500" : ""}`}
              required
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`input-field ${errors.password ? "border-red-500" : ""}`}
              required
            />
            {errors.password && <p className="error-text">{errors.password}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className={`input-field ${errors.address ? "border-red-500" : ""}`}
              required
            />
            {errors.address && <p className="error-text">{errors.address}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full btn-primary disabled:opacity-50">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-primary-600 hover:text-primary-800">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
