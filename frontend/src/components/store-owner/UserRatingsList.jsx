"use client"

import { useState } from "react"

const UserRatingsList = ({ userRatings }) => {
  const [sortBy, setSortBy] = useState("created_at")
  const [sortOrder, setSortOrder] = useState("desc")
  const [filterRating, setFilterRating] = useState("")

  // Filter and sort the ratings
  const processedRatings = userRatings
    .filter((rating) => {
      if (!filterRating) return true
      return rating.rating === Number.parseInt(filterRating)
    })
    .sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "created_at") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getSortIcon = (field) => {
    if (sortBy !== field) return "↕️"
    return sortOrder === "asc" ? "↑" : "↓"
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const renderStarRating = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? "⭐" : "☆")
    }
    return <span className="text-yellow-400">{stars.join("")}</span>
  }

  const getRatingColor = (rating) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  if (!userRatings || userRatings.length === 0) {
    return (
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Reviews</h3>
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">📝</div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
          <p>Your store hasn't received any customer reviews yet. Keep providing great service!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Customer Reviews ({processedRatings.length} of {userRatings.length})
        </h3>
      </div>

      {/* Filters and Sort Controls */}
      <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Filter by rating:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value="">All ratings</option>
            <option value="5">5 stars</option>
            <option value="4">4 stars</option>
            <option value="3">3 stars</option>
            <option value="2">2 stars</option>
            <option value="1">1 star</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Sort by:</span>
          <button
            onClick={() => handleSort("created_at")}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === "created_at" ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-700"
            }`}
          >
            Date {getSortIcon("created_at")}
          </button>
          <button
            onClick={() => handleSort("rating")}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === "rating" ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-700"
            }`}
          >
            Rating {getSortIcon("rating")}
          </button>
          <button
            onClick={() => handleSort("user_name")}
            className={`px-3 py-1 rounded text-sm ${
              sortBy === "user_name" ? "bg-primary-100 text-primary-800" : "bg-gray-100 text-gray-700"
            }`}
          >
            Customer {getSortIcon("user_name")}
          </button>
        </div>
      </div>

      {/* Ratings List */}
      <div className="space-y-4">
        {processedRatings.map((rating, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-medium text-gray-900">{rating.user_name}</h4>
                <p className="text-sm text-gray-600">{rating.user_email}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  {renderStarRating(rating.rating)}
                  <span className={`font-semibold ${getRatingColor(rating.rating)}`}>{rating.rating}/5</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatDate(rating.created_at)}</p>
              </div>
            </div>

            {/* Rating Summary */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">
                {rating.rating >= 4 ? "Positive review" : rating.rating >= 3 ? "Neutral review" : "Needs attention"}
              </span>
              <span className="text-gray-500">{rating.rating >= 4 ? "😊" : rating.rating >= 3 ? "😐" : "😞"}</span>
            </div>
          </div>
        ))}
      </div>

      {processedRatings.length === 0 && userRatings.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No reviews match your current filter criteria.</p>
          <button onClick={() => setFilterRating("")} className="text-primary-600 hover:text-primary-800 mt-2">
            Clear filter
          </button>
        </div>
      )}
    </div>
  )
}

export default UserRatingsList
