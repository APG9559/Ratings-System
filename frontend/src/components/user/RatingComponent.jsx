"use client"

import { useState } from "react"
import axios from "axios"

const RatingComponent = ({ storeId, currentRating, onRatingUpdate }) => {
  const [selectedRating, setSelectedRating] = useState(currentRating || 0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleRatingClick = async (rating) => {
    if (loading) return

    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await axios.post("/api/ratings", {
        store_id: storeId,
        rating: rating,
      })

      setSelectedRating(rating)
      onRatingUpdate(rating)
      setSuccess(currentRating ? "Rating updated!" : "Rating submitted!")

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error) {
      setError(error.response?.data?.message || "Failed to submit rating")
      // Clear error message after 5 seconds
      setTimeout(() => setError(""), 5000)
    } finally {
      setLoading(false)
    }
  }

  const getRatingLabel = (rating) => {
    switch (rating) {
      case 1:
        return "Poor"
      case 2:
        return "Fair"
      case 3:
        return "Good"
      case 4:
        return "Very Good"
      case 5:
        return "Excellent"
      default:
        return ""
    }
  }

  const renderStars = () => {
    const stars = []
    const displayRating = hoveredRating || selectedRating

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          disabled={loading}
          className={`text-2xl transition-all duration-150 transform ${
            i <= displayRating ? "text-yellow-400 scale-110" : "text-gray-300"
          } ${
            loading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer hover:text-yellow-500 hover:scale-125 active:scale-95"
          }`}
          title={`Rate ${i} star${i !== 1 ? "s" : ""} - ${getRatingLabel(i)}`}
        >
          {i <= displayRating ? "⭐" : "☆"}
        </button>,
      )
    }

    return stars
  }

  return (
    <div className="space-y-3">
      {/* Star Rating Interface */}
      <div className="flex items-center justify-center space-x-1">
        {renderStars()}
        {loading && (
          <div className="ml-3 flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
            <span className="ml-2 text-sm text-gray-500">Submitting...</span>
          </div>
        )}
      </div>

      {/* Rating Label */}
      {(hoveredRating || selectedRating) && !loading && (
        <div className="text-center">
          <span className="text-sm font-medium text-gray-700">{getRatingLabel(hoveredRating || selectedRating)}</span>
        </div>
      )}

      {/* Rating Scale Labels */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Poor</span>
        <span>Excellent</span>
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">{error}</div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">{success}</div>
      )}

      {/* Instructions */}
      {!currentRating && !selectedRating && !loading && (
        <p className="text-xs text-gray-500 text-center">Click on a star to rate this store</p>
      )}
      {(currentRating || selectedRating) && !loading && (
        <p className="text-xs text-gray-500 text-center">Click on a star to update your rating</p>
      )}
    </div>
  )
}

export default RatingComponent
