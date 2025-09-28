"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import StoreRatingsOverview from "../components/store-owner/StoreRatingsOverview"
import UserRatingsList from "../components/store-owner/UserRatingsList"
import PasswordUpdateModal from "../components/admin/PasswordUpdateModal"

const StoreOwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/stores/owner/dashboard")
      setDashboardData(response.data)
      setError("")
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch dashboard data")
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
          <button onClick={fetchDashboardData} className="ml-4 text-red-800 underline">
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Store Owner Dashboard</h1>
          <p className="text-gray-600 mt-1">Managing: {dashboardData.store.name}</p>
        </div>
        <button onClick={() => setShowPasswordModal(true)} className="btn-secondary">
          Update Password
        </button>
      </div>

      {/* Store Ratings Overview */}
      <StoreRatingsOverview
        averageRating={dashboardData.averageRating}
        totalRatings={dashboardData.totalRatings}
        storeName={dashboardData.store.name}
      />

      {/* User Ratings List */}
      <UserRatingsList userRatings={dashboardData.userRatings} />

      {/* Password Update Modal */}
      {showPasswordModal && <PasswordUpdateModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  )
}

export default StoreOwnerDashboard
