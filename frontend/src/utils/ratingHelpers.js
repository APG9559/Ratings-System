// Utility functions for rating calculations and display

export const calculateAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0
  const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0)
  return sum / ratings.length
}

export const getRatingDistribution = (ratings) => {
  const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }

  ratings.forEach((rating) => {
    distribution[rating.rating]++
  })

  const total = ratings.length
  const percentages = {}

  Object.keys(distribution).forEach((star) => {
    percentages[star] = total > 0 ? (distribution[star] / total) * 100 : 0
  })

  return { counts: distribution, percentages }
}

export const getRatingTrend = (ratings) => {
  if (!ratings || ratings.length < 2) return "stable"

  // Sort by date
  const sortedRatings = [...ratings].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))

  // Compare recent ratings (last 30%) with older ratings
  const splitPoint = Math.floor(sortedRatings.length * 0.7)
  const olderRatings = sortedRatings.slice(0, splitPoint)
  const recentRatings = sortedRatings.slice(splitPoint)

  const olderAvg = calculateAverageRating(olderRatings)
  const recentAvg = calculateAverageRating(recentRatings)

  const difference = recentAvg - olderAvg

  if (difference > 0.3) return "improving"
  if (difference < -0.3) return "declining"
  return "stable"
}

export const formatRatingDate = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

export const getRatingColor = (rating) => {
  if (rating >= 4.0) return "text-green-600"
  if (rating >= 3.0) return "text-yellow-600"
  return "text-red-600"
}

export const getRatingBadgeColor = (rating) => {
  if (rating >= 4.0) return "bg-green-100 text-green-800"
  if (rating >= 3.0) return "bg-yellow-100 text-yellow-800"
  return "bg-red-100 text-red-800"
}

export const validateRating = (rating) => {
  const numRating = Number(rating)
  return numRating >= 1 && numRating <= 5 && Number.isInteger(numRating)
}
