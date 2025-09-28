"use client"

import { useState, useEffect } from "react"
import axios from "axios"

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await axios.get("/api/users/dashboard-stats")
      setStats(response.data)
      setError("")
    } catch (error) {
      setError("Failed to fetch dashboard statistics")
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
        <button onClick={fetchStats} className="ml-4 text-red-800 underline">
          Retry
        </button>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Total Stores",
      value: stats.totalStores,
      icon: "🏪",
      color: "bg-green-500",
    },
    {
      title: "Total Ratings",
      value: stats.totalRatings,
      icon: "⭐",
      color: "bg-yellow-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card">
            <div className="flex items-center">
              <div className={`${stat.color} rounded-full p-3 mr-4`}>
                <span className="text-white text-2xl">{stat.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Overview</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">Average ratings per store</span>
            <span className="font-semibold">
              {stats.totalStores > 0 ? (stats.totalRatings / stats.totalStores).toFixed(1) : "0"}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600">User engagement rate</span>
            <span className="font-semibold">
              {stats.totalUsers > 0 ? ((stats.totalRatings / stats.totalUsers) * 100).toFixed(1) : "0"}%
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600">Platform activity</span>
            <span className="font-semibold text-green-600">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
