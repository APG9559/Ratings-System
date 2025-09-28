"use client"

import { useState } from "react"
import DashboardStats from "../components/admin/DashboardStats"
import UserManagement from "../components/admin/UserManagement"
import StoreManagement from "../components/admin/StoreManagement"
import CreateUserModal from "../components/admin/CreateUserModal"
import CreateStoreModal from "../components/admin/CreateStoreModal"
import PasswordUpdateModal from "../components/admin/PasswordUpdateModal"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [showCreateUserModal, setShowCreateUserModal] = useState(false)
  const [showCreateStoreModal, setShowCreateStoreModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "stores", label: "Stores", icon: "🏪" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex space-x-3">
          <button onClick={() => setShowPasswordModal(true)} className="btn-secondary">
            Update Password
          </button>
          {activeTab === "users" && (
            <button onClick={() => setShowCreateUserModal(true)} className="btn-primary">
              Add New User
            </button>
          )}
          {activeTab === "stores" && (
            <button onClick={() => setShowCreateStoreModal(true)} className="btn-primary">
              Add New Store
            </button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === "dashboard" && <DashboardStats />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "stores" && <StoreManagement />}
      </div>

      {/* Modals */}
      {showCreateUserModal && (
        <CreateUserModal onClose={() => setShowCreateUserModal(false)} onSuccess={() => setActiveTab("users")} />
      )}

      {showCreateStoreModal && (
        <CreateStoreModal onClose={() => setShowCreateStoreModal(false)} onSuccess={() => setActiveTab("stores")} />
      )}

      {showPasswordModal && <PasswordUpdateModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  )
}

export default AdminDashboard
