"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const CreateStoreModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    owner_id: "",
  })
  const [storeOwners, setStoreOwners] = useState([])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingOwners, setLoadingOwners] = useState(true)

  useEffect(() => {
    fetchStoreOwners()
  }, [])

  const fetchStoreOwners = async () => {
    try {
      setLoadingOwners(true)
      const response = await axios.get("/api/users?role=store_owner")
      setStoreOwners(response.data)
    } catch (error) {
      console.error("Error fetching store owners:", error)
    } finally {
      setLoadingOwners(false)
    }
  }

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
    if (!formData.name.trim()) {
      newErrors.name = "Store name is required"
    } else if (formData.name.length > 255) {
      newErrors.name = "Store name must not exceed 255 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please provide a valid email"
    }

    // Address validation
    if (formData.address.length > 400) {
      newErrors.address = "Address must not exceed 400 characters"
    }

    // Owner validation
    if (!formData.owner_id) {
      newErrors.owner_id = "Please select a store owner"
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

    try {
      await axios.post("/api/stores", {
        ...formData,
        owner_id: Number.parseInt(formData.owner_id),
      })
      onSuccess()
      onClose()
    } catch (error) {
      if (error.response?.data?.errors) {
        const errorObj = {}
        error.response.data.errors.forEach((err) => {
          errorObj[err.path] = err.msg
        })
        setErrors(errorObj)
      } else {
        setErrors({ general: error.response?.data?.message || "Failed to create store" })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Create New Store</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{errors.general}</div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Store Name
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

            <div className="mb-6">
              <label htmlFor="owner_id" className="block text-sm font-medium text-gray-700 mb-2">
                Store Owner
              </label>
              {loadingOwners ? (
                <div className="input-field bg-gray-100">Loading store owners...</div>
              ) : (
                <select
                  id="owner_id"
                  name="owner_id"
                  value={formData.owner_id}
                  onChange={handleChange}
                  className={`input-field ${errors.owner_id ? "border-red-500" : ""}`}
                  required
                >
                  <option value="">Select a store owner</option>
                  {storeOwners.map((owner) => (
                    <option key={owner.id} value={owner.id}>
                      {owner.name} ({owner.email})
                    </option>
                  ))}
                </select>
              )}
              {errors.owner_id && <p className="error-text">{errors.owner_id}</p>}
            </div>

            <div className="flex justify-end space-x-3">
              <button type="button" onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button type="submit" disabled={loading || loadingOwners} className="btn-primary disabled:opacity-50">
                {loading ? "Creating..." : "Create Store"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateStoreModal
