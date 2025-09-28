const express = require("express")
const { body, validationResult } = require("express-validator")
const pool = require("../config/database")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Validation rules
const nameValidation = body("name")
  .isLength({ min: 1, max: 255 })
  .withMessage("Store name is required and must not exceed 255 characters")

const emailValidation = body("email").isEmail().withMessage("Please provide a valid email")

const addressValidation = body("address").isLength({ max: 400 }).withMessage("Address must not exceed 400 characters")

// Get all stores with ratings
router.get("/", [authenticateToken], async (req, res) => {
  try {
    const { name, address, sortBy = "name", sortOrder = "asc" } = req.query
    const userId = req.user.id

    let query = `
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) as average_rating,
             COUNT(r.rating) as total_ratings,
             ur.rating as user_rating
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN ratings ur ON s.id = ur.store_id AND ur.user_id = $1
      WHERE 1=1
    `

    const params = [userId]
    let paramCount = 1

    // Apply filters
    if (name) {
      paramCount++
      query += ` AND s.name ILIKE $${paramCount}`
      params.push(`%${name}%`)
    }
    if (address) {
      paramCount++
      query += ` AND s.address ILIKE $${paramCount}`
      params.push(`%${address}%`)
    }

    query += " GROUP BY s.id, s.name, s.email, s.address, ur.rating"

    // Apply sorting
    const validSortFields = ["name", "address", "average_rating"]
    const validSortOrders = ["asc", "desc"]

    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toLowerCase())) {
      query += ` ORDER BY ${sortBy === "average_rating" ? "COALESCE(AVG(r.rating), 0)" : "s." + sortBy} ${sortOrder.toUpperCase()}`
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error("Get stores error:", error)
    res.status(500).json({ message: "Server error fetching stores" })
  }
})

// Get stores for admin (with owner info)
router.get("/admin", [authenticateToken, requireRole(["system_admin"])], async (req, res) => {
  try {
    const { name, email, address, sortBy = "name", sortOrder = "asc" } = req.query

    let query = `
      SELECT s.id, s.name, s.email, s.address,
             COALESCE(AVG(r.rating), 0) as rating,
             COUNT(r.rating) as total_ratings,
             u.name as owner_name
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
      LEFT JOIN users u ON s.owner_id = u.id
      WHERE 1=1
    `

    const params = []
    let paramCount = 0

    // Apply filters
    if (name) {
      paramCount++
      query += ` AND s.name ILIKE $${paramCount}`
      params.push(`%${name}%`)
    }
    if (email) {
      paramCount++
      query += ` AND s.email ILIKE $${paramCount}`
      params.push(`%${email}%`)
    }
    if (address) {
      paramCount++
      query += ` AND s.address ILIKE $${paramCount}`
      params.push(`%${address}%`)
    }

    query += " GROUP BY s.id, s.name, s.email, s.address, u.name"

    // Apply sorting
    const validSortFields = ["name", "email", "address", "rating"]
    const validSortOrders = ["asc", "desc"]

    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toLowerCase())) {
      query += ` ORDER BY ${sortBy === "rating" ? "COALESCE(AVG(r.rating), 0)" : "s." + sortBy} ${sortOrder.toUpperCase()}`
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error("Get stores for admin error:", error)
    res.status(500).json({ message: "Server error fetching stores" })
  }
})

// Create store (admin only)
router.post(
  "/",
  [
    authenticateToken,
    requireRole(["system_admin"]),
    nameValidation,
    emailValidation,
    addressValidation,
    body("owner_id").isInt().withMessage("Valid owner ID is required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, address, owner_id } = req.body

      // Check if store email already exists
      const existingStore = await pool.query("SELECT id FROM stores WHERE email = $1", [email])
      if (existingStore.rows.length > 0) {
        return res.status(400).json({ message: "Store already exists with this email" })
      }

      // Check if owner exists and is a store owner
      const owner = await pool.query("SELECT id, role FROM users WHERE id = $1", [owner_id])
      if (owner.rows.length === 0) {
        return res.status(400).json({ message: "Owner not found" })
      }
      if (owner.rows[0].role !== "store_owner") {
        return res.status(400).json({ message: "Selected user is not a store owner" })
      }

      // Create store
      const result = await pool.query(
        "INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *",
        [name, email, address, owner_id],
      )

      res.status(201).json({
        message: "Store created successfully",
        store: result.rows[0],
      })
    } catch (error) {
      console.error("Create store error:", error)
      res.status(500).json({ message: "Server error creating store" })
    }
  },
)

// Get store owner dashboard data
router.get("/owner/dashboard", [authenticateToken, requireRole(["store_owner"])], async (req, res) => {
  try {
    const ownerId = req.user.id

    // Get store owned by this user
    const storeResult = await pool.query("SELECT id, name FROM stores WHERE owner_id = $1", [ownerId])

    if (storeResult.rows.length === 0) {
      return res.status(404).json({ message: "No store found for this owner" })
    }

    const store = storeResult.rows[0]

    // Get average rating and users who rated
    const ratingsResult = await pool.query(
      `
      SELECT 
        AVG(r.rating) as average_rating,
        COUNT(r.rating) as total_ratings,
        json_agg(
          json_build_object(
            'user_name', u.name,
            'user_email', u.email,
            'rating', r.rating,
            'created_at', r.created_at
          )
        ) as user_ratings
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
    `,
      [store.id],
    )

    const ratingsData = ratingsResult.rows[0]

    res.json({
      store: store,
      averageRating: Number.parseFloat(ratingsData.average_rating) || 0,
      totalRatings: Number.parseInt(ratingsData.total_ratings) || 0,
      userRatings: ratingsData.user_ratings || [],
    })
  } catch (error) {
    console.error("Store owner dashboard error:", error)
    res.status(500).json({ message: "Server error fetching dashboard data" })
  }
})

module.exports = router
