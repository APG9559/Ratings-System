"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const StoreManagement = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Filter and sort states
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
  })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    fetchStores()
  }, [filters, sortBy, sortOrder])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...filters,
        sortBy,
        sortOrder,
      })

      // Remove empty filters
      Object.keys(filters).forEach((key) => {
        if (!filters[key]) {
          params.delete(key)
        }
      })

      const response = await axios.get(`/api/stores/admin?${params}`)
      setStores(response.data)
      setError("")
    } catch (error) {
      setError("Failed to fetch stores")
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value,
    })
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  const clearFilters = () => {
    setFilters({
      name: "",
      email: "",
      address: "",
    })
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️"
    return sortOrder === "asc" ? "↑" : "↓"
  }

  const renderStarRating = (rating) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push("⭐")
    }

    if (hasHalfStar) {
      stars.push("⭐")
    }

    while (stars.length < 5) {
      stars.push("☆")
    }

    return (
      <div className="flex items-center">
        <span className="text-yellow-400">{stars.join("")}</span>
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="input-field"
              placeholder="Search by store name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="text"
              value={filters.email}
              onChange={(e) => handleFilterChange("email", e.target.value)}
              className="input-field"
              placeholder="Search by email..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={filters.address}
              onChange={(e) => handleFilterChange("address", e.target.value)}
              className="input-field"
              placeholder="Search by address..."
            />
          </div>
        </div>
        <button onClick={clearFilters} className="btn-secondary">
          Clear Filters
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={fetchStores} className="ml-4 text-red-800 underline">
            Retry
          </button>
        </div>
      )}

      {/* Stores Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Stores ({stores.length})</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("name")}
                >
                  Name {getSortIcon("name")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("email")}
                >
                  Email {getSortIcon("email")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("address")}
                >
                  Address {getSortIcon("address")}
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("rating")}
                >
                  Rating {getSortIcon("rating")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Ratings
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stores.map((store) => (
                <tr key={store.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{store.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{store.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{renderStarRating(Number.parseFloat(store.rating))}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.owner_name || "N/A"}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{store.total_ratings}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {stores.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">No stores found matching your criteria.</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoreManagement
