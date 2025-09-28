"use client"

const StoreRatingsOverview = ({ averageRating, totalRatings, storeName }) => {
  const renderStarRating = (rating, size = "text-3xl") => {
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
      <div className="flex items-center justify-center">
        <span className={`text-yellow-400 ${size}`}>{stars.join("")}</span>
      </div>
    )
  }

  const getRatingDescription = (rating) => {
    if (rating >= 4.5) return "Excellent"
    if (rating >= 4.0) return "Very Good"
    if (rating >= 3.5) return "Good"
    if (rating >= 3.0) return "Average"
    if (rating >= 2.0) return "Below Average"
    return "Poor"
  }

  const getRatingColor = (rating) => {
    if (rating >= 4.0) return "text-green-600"
    if (rating >= 3.0) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressBarColor = (rating) => {
    if (rating >= 4.0) return "bg-green-500"
    if (rating >= 3.0) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getRatingAdvice = (rating) => {
    if (rating >= 4.5) return "Outstanding performance! Keep up the excellent work."
    if (rating >= 4.0) return "Great job! Your customers are very satisfied."
    if (rating >= 3.5) return "Good work! Consider ways to improve customer experience."
    if (rating >= 3.0) return "Room for improvement. Focus on customer satisfaction."
    if (rating >= 2.0) return "Needs attention. Consider reviewing your service quality."
    return "Immediate action needed. Please address customer concerns."
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Average Rating Card */}
      <div className="card text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Average Rating</h3>
        {totalRatings > 0 ? (
          <div className="space-y-3">
            {renderStarRating(averageRating)}
            <div>
              <div className={`text-4xl font-bold ${getRatingColor(averageRating)}`}>{averageRating.toFixed(1)}</div>
              <div className={`text-sm font-medium ${getRatingColor(averageRating)}`}>
                {getRatingDescription(averageRating)}
              </div>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">{getRatingAdvice(averageRating)}</div>
          </div>
        ) : (
          <div className="text-gray-500">
            <div className="text-6xl mb-2">⭐</div>
            <p>No ratings yet</p>
            <p className="text-xs mt-2">Encourage customers to leave reviews!</p>
          </div>
        )}
      </div>

      {/* Total Ratings Card */}
      <div className="card text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Total Reviews</h3>
        <div className="space-y-3">
          <div className="text-4xl font-bold text-primary-600">{totalRatings}</div>
          <div className="text-sm text-gray-600">{totalRatings === 1 ? "Customer review" : "Customer reviews"}</div>
          {totalRatings > 0 && (
            <div className="text-xs text-gray-500">
              {totalRatings >= 50
                ? "Excellent review volume!"
                : totalRatings >= 20
                  ? "Good review activity"
                  : totalRatings >= 10
                    ? "Building review base"
                    : "Growing review count"}
            </div>
          )}
          {totalRatings === 0 && (
            <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded">
              Tip: Ask satisfied customers to leave a review
            </div>
          )}
        </div>
      </div>

      {/* Rating Progress Card */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
        {totalRatings > 0 ? (
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((star) => {
              // This is a simplified calculation - in a real app, you'd get actual counts from the backend
              const isCurrentRating = star === Math.round(averageRating)
              const percentage = isCurrentRating ? Math.max(60, averageRating * 15) : Math.random() * 30
              return (
                <div key={star} className="flex items-center space-x-2">
                  <span className="text-sm w-8 flex items-center">
                    {star}
                    <span className="text-yellow-400 ml-1">⭐</span>
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getProgressBarColor(averageRating)}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-10">{Math.round(percentage)}%</span>
                </div>
              )
            })}
            <div className="text-xs text-gray-500 mt-3 p-2 bg-gray-50 rounded">
              Most customers rate your store {Math.round(averageRating)} stars
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-500">
            <div className="text-4xl mb-2">📊</div>
            <p className="text-sm">No ratings to display yet</p>
            <p className="text-xs mt-1">Distribution will appear as you receive reviews</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default StoreRatingsOverview
