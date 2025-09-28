"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import UserDetailsModal from "./UserDetailsModal"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  // Filter and sort states
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    address: "",
    role: "",
  })
  const [sortBy, setSortBy] = useState("name")
  const [sortOrder, setSortOrder] = useState("asc")

  useEffect(() => {
    fetchUsers()
  }, [filters, sortBy, sortOrder])

  const fetchUsers = async () => {
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

      const response = await axios.get(`/api/users?${params}`)
      setUsers(response.data)
      setError("")
    } catch (error) {
      setError("Failed to fetch users")
      console.error("Error fetching users:", error)
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
      role: "",
    })
  }

  const viewUserDetails = async (userId) => {
    try {
      const response = await axios.get(`/api/users/${userId}`)
      setSelectedUser(response.data)
      setShowDetailsModal(true)
    } catch (error) {
      console.error("Error fetching user details:", error)
    }
  }

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "system_admin":
        return "bg-red-100 text-red-800"
      case "store_owner":
        return "bg-blue-100 text-blue-800"
      case "normal_user":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={filters.name}
              onChange={(e) => handleFilterChange("name", e.target.value)}
              className="input-field"
              placeholder="Search by name..."
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={filters.role}
              onChange={(e) => handleFilterChange("role", e.target.value)}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value="system_admin">System Admin</option>
              <option value="store_owner">Store Owner</option>
              <option value="normal_user">Normal User</option>
            </select>
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
          <button onClick={fetchUsers} className="ml-4 text-red-800 underline">
            Retry
          </button>
        </div>
      )}

      {/* Users Table */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Users ({users.length})</h3>
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
                  onClick={() => handleSort("role")}
                >
                  Role {getSortIcon("role")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{user.address}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
                    >
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => viewUserDetails(user.id)}
                      className="text-primary-600 hover:text-primary-900"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">No users found matching your criteria.</div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showDetailsModal && selectedUser && (
        <UserDetailsModal user={selectedUser} onClose={() => setShowDetailsModal(false)} />
      )}
    </div>
  )
}

export default UserManagement
