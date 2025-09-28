"use client"

import { useState } from "react"
import StoreList from "../components/user/StoreList"
import PasswordUpdateModal from "../components/admin/PasswordUpdateModal"

const UserDashboard = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Store Directory</h1>
        <button onClick={() => setShowPasswordModal(true)} className="btn-secondary">
          Update Password
        </button>
      </div>

      <div className="text-gray-600">
        <p>
          Browse and rate stores in our directory. You can search by name or address, and submit ratings from 1 to 5
          stars.
        </p>
      </div>

      <StoreList />

      {/* Password Update Modal */}
      {showPasswordModal && <PasswordUpdateModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  )
}

export default UserDashboard
