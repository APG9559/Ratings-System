const express = require("express")
const { body, validationResult } = require("express-validator")
const pool = require("../config/database")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Validation rules
const ratingValidation = body("rating").isInt({ min: 1, max: 5 }).withMessage("Rating must be between 1 and 5")

const storeIdValidation = body("store_id").isInt().withMessage("Valid store ID is required")

// Submit or update rating
router.post(
  "/",
  [authenticateToken, requireRole(["normal_user"]), ratingValidation, storeIdValidation],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { rating, store_id } = req.body
      const user_id = req.user.id

      // Check if store exists
      const storeResult = await pool.query("SELECT id FROM stores WHERE id = $1", [store_id])
      if (storeResult.rows.length === 0) {
        return res.status(404).json({ message: "Store not found" })
      }

      // Check if user already rated this store
      const existingRating = await pool.query("SELECT id FROM ratings WHERE user_id = $1 AND store_id = $2", [
        user_id,
        store_id,
      ])

      let result
      let message

      if (existingRating.rows.length > 0) {
        // Update existing rating
        result = await pool.query(
          "UPDATE ratings SET rating = $1, updated_at = CURRENT_TIMESTAMP WHERE user_id = $2 AND store_id = $3 RETURNING *",
          [rating, user_id, store_id],
        )
        message = "Rating updated successfully"
      } else {
        // Create new rating
        result = await pool.query("INSERT INTO ratings (user_id, store_id, rating) VALUES ($1, $2, $3) RETURNING *", [
          user_id,
          store_id,
          rating,
        ])
        message = "Rating submitted successfully"
      }

      res.json({
        message,
        rating: result.rows[0],
      })
    } catch (error) {
      console.error("Submit rating error:", error)
      res.status(500).json({ message: "Server error submitting rating" })
    }
  },
)

// Get user's rating for a specific store
router.get("/store/:storeId", [authenticateToken], async (req, res) => {
  try {
    const { storeId } = req.params
    const userId = req.user.id

    const result = await pool.query(
      "SELECT rating, created_at, updated_at FROM ratings WHERE user_id = $1 AND store_id = $2",
      [userId, storeId],
    )

    if (result.rows.length === 0) {
      return res.json({ rating: null })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Get user rating error:", error)
    res.status(500).json({ message: "Server error fetching rating" })
  }
})

module.exports = router
