"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"

const PasswordUpdateModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const { updatePassword } = useAuth()

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

    // Current password validation
    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required"
    }

    // New password validation
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,16}$/
    if (!passwordRegex.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must be 8-16 characters with at least one uppercase letter and one special character"
    }

    // Confirm password validation
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
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

    const result = await updatePassword(formData.currentPassword, formData.newPassword)

    if (result.success) {
      setSuccess(true)
      setTimeout(() => {
        onClose()
      }, 2000)
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Update Password</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              Password updated successfully! Closing...
            </div>
          )}

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                className={`input-field ${errors.currentPassword ? "border-red-500" : ""}`}
                required
              />
              {errors.currentPassword && <p className="error-text">{errors.currentPassword}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                className={`input-field ${errors.newPassword ? "border-red-500" : ""}`}
                required
              />
              {errors.newPassword && <p className="error-text">{errors.newPassword}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`input-field ${errors.confirmPassword ? "border-red-500" : ""}`}
                required
              />
              {errors.confirmPassword && <p className="error-text">{errors.confirmPassword}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="btn-secondary" disabled={loading}>
                Cancel
              </button>
              <button type="submit" disabled={loading || success} className="btn-primary disabled:opacity-50">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PasswordUpdateModal
