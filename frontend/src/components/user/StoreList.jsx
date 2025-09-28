"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import StoreCard from "./StoreCard"

const StoreList = () => {
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Search and sort states
  const [searchFilters, setSearchFilters] = useState({
    name: "",
    address: "",
  })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    fetchStores()
  }, [searchFilters, sortBy, sortOrder])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...searchFilters,
        sortBy,
        sortOrder,
      })

      // Remove empty filters
      Object.keys(searchFilters).forEach((key) => {
        if (!searchFilters[key]) {
          params.delete(key)
        }
      })

      const response = await axios.get(`/api/stores?${params}`)
      setStores(response.data)
      setError("")
    } catch (error) {
      setError("Failed to fetch stores")
      console.error("Error fetching stores:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (field, value) => {
    setSearchFilters({
      ...searchFilters,
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

  const clearSearch = () => {
    setSearchFilters({
      name: "",
      address: "",
    })
  }

  const handleRatingUpdate = (storeId, newRating) => {
    setStores(
      stores.map((store) =>
        store.id === storeId
          ? {
              ...store,
              user_rating: newRating,
              // Optionally update average rating (would need to refetch for accuracy)
            }
          : store,
      ),
    )
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️"
    return sortOrder === "asc" ? "↑" : "↓"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Stores</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input
              type="text"
              value={searchFilters.name}
              onChange={(e) => handleSearchChange("name", e.target.value)}
              className="input-field"
              placeholder="Search by store name..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              value={searchFilters.address}
              onChange={(e) => handleSearchChange("address", e.target.value)}
              className="input-field"
              placeholder="Search by address..."
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Sort by:</span>
            <button
              onClick={() => handleSort("name")}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === "name" ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-700"
              }`}
            >
              Name {getSortIcon("name")}
            </button>
            <button
              onClick={() => handleSort("address")}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === "address" ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-700"
              }`}
            >
              Address {getSortIcon("address")}
            </button>
            <button
              onClick={() => handleSort("average_rating")}
              className={`px-3 py-1 rounded text-sm ${
                sortBy === "average_rating" ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-700"
              }`}
            >
              Rating {getSortIcon("average_rating")}
            </button>
          </div>
          <button onClick={clearSearch} className="btn-secondary text-sm">
            Clear Search
          </button>
        </div>
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

      {/* Store Results */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {stores.length} {stores.length === 1 ? "Store" : "Stores"} Found
          </h3>
        </div>

        {stores.length === 0 && !loading ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4">🏪</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
            <p>Try adjusting your search criteria or clear the filters to see all stores.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map((store) => (
              <StoreCard key={store.id} store={store} onRatingUpdate={handleRatingUpdate} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreList
