"use client"

import { useState } from "react"
import RatingComponent from "./RatingComponent"

const StoreCard = ({ store, onRatingUpdate }) => {
  const [showFullAddress, setShowFullAddress] = useState(false)
  const [currentUserRating, setCurrentUserRating] = useState(store.user_rating)

  const renderStarRating = (rating, size = "text-lg") => {
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
        <span className={`text-yellow-400 ${size}`}>{stars.join("")}</span>
        <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    )
  }

  const truncateAddress = (address, maxLength = 60) => {
    if (address.length <= maxLength) return address
    return address.substring(0, maxLength) + "..."
  }

  const handleRatingUpdate = (newRating) => {
    setCurrentUserRating(newRating)
    onRatingUpdate(store.id, newRating)
  }

  const getRatingStatusColor = () => {
    if (!currentUserRating) return "border-gray-200"
    if (currentUserRating >= 4) return "border-green-200 bg-green-50"
    if (currentUserRating >= 3) return "border-yellow-200 bg-yellow-50"
    return "border-red-200 bg-red-50"
  }

  return (
    <div className={`card hover:shadow-lg transition-all duration-200 ${getRatingStatusColor()}`}>
      <div className="space-y-4">
        {/* Store Header */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{store.name}</h3>
            {currentUserRating && (
              <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                You rated: {currentUserRating}⭐
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">{store.email}</p>
        </div>

        {/* Address */}
        <div>
          <p className="text-sm text-gray-700">
            📍 {showFullAddress ? store.address : truncateAddress(store.address)}
            {store.address.length > 60 && (
              <button
                onClick={() => setShowFullAddress(!showFullAddress)}
                className="ml-2 text-primary-600 hover:text-primary-800 text-xs underline"
              >
                {showFullAddress ? "Show less" : "Show more"}
              </button>
            )}
          </p>
        </div>

        {/* Overall Rating */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Overall Rating</span>
            <span className="text-sm text-gray-500">
              {store.total_ratings} {store.total_ratings === 1 ? "review" : "reviews"}
            </span>
          </div>
          {renderStarRating(Number.parseFloat(store.average_rating))}
          {store.total_ratings === 0 && <p className="text-xs text-gray-500 mt-1">Be the first to rate this store!</p>}
        </div>

        {/* User's Rating */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">Rate This Store</span>
            {currentUserRating && (
              <span className="text-xs text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
            )}
          </div>
          <RatingComponent storeId={store.id} currentRating={currentUserRating} onRatingUpdate={handleRatingUpdate} />
        </div>
      </div>
    </div>
  )
}

export default StoreCard
