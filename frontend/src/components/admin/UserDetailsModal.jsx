"use client"

const UserDetailsModal = ({ user, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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

  const renderStarRating = (rating) => {
    if (!rating) return "No ratings yet"

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

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">User Details</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              ✕
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{user.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <p className="mt-1 text-sm text-gray-900">{user.address}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}
              >
                {user.role.replace("_", " ")}
              </span>
            </div>

            {user.role === "store_owner" && user.rating !== null && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Store Rating</label>
                <div className="mt-1">{renderStarRating(Number.parseFloat(user.rating))}</div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.created_at)}</p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDetailsModal
