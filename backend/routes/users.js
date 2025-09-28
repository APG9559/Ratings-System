const express = require("express")
const bcrypt = require("bcryptjs")
const { body, validationResult } = require("express-validator")
const pool = require("../config/database")
const { authenticateToken, requireRole } = require("../middleware/auth")

const router = express.Router()

// Validation rules
const passwordValidation = body("password")
  .isLength({ min: 8, max: 16 })
  .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/)
  .withMessage("Password must be 8-16 characters with at least one uppercase letter and one special character")

const nameValidation = body("name")
  .isLength({ min: 20, max: 60 })
  .withMessage("Name must be between 20 and 60 characters")

const emailValidation = body("email").isEmail().withMessage("Please provide a valid email")

const addressValidation = body("address").isLength({ max: 400 }).withMessage("Address must not exceed 400 characters")

// Get dashboard stats (admin only)
router.get("/dashboard-stats", [authenticateToken, requireRole(["system_admin"])], async (req, res) => {
  try {
    const usersCount = await pool.query("SELECT COUNT(*) FROM users")
    const storesCount = await pool.query("SELECT COUNT(*) FROM stores")
    const ratingsCount = await pool.query("SELECT COUNT(*) FROM ratings")

    res.json({
      totalUsers: Number.parseInt(usersCount.rows[0].count),
      totalStores: Number.parseInt(storesCount.rows[0].count),
      totalRatings: Number.parseInt(ratingsCount.rows[0].count),
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Server error fetching dashboard stats" })
  }
})

// Get all users (admin only)
router.get("/", [authenticateToken, requireRole(["system_admin"])], async (req, res) => {
  try {
    const { name, email, address, role, sortBy = "name", sortOrder = "asc" } = req.query

    let query = "SELECT id, name, email, address, role, created_at FROM users WHERE 1=1"
    const params = []
    let paramCount = 0

    // Apply filters
    if (name) {
      paramCount++
      query += ` AND name ILIKE $${paramCount}`
      params.push(`%${name}%`)
    }
    if (email) {
      paramCount++
      query += ` AND email ILIKE $${paramCount}`
      params.push(`%${email}%`)
    }
    if (address) {
      paramCount++
      query += ` AND address ILIKE $${paramCount}`
      params.push(`%${address}%`)
    }
    if (role) {
      paramCount++
      query += ` AND role = $${paramCount}`
      params.push(role)
    }

    // Apply sorting
    const validSortFields = ["name", "email", "address", "role", "created_at"]
    const validSortOrders = ["asc", "desc"]

    if (validSortFields.includes(sortBy) && validSortOrders.includes(sortOrder.toLowerCase())) {
      query += ` ORDER BY ${sortBy} ${sortOrder.toUpperCase()}`
    }

    const result = await pool.query(query, params)
    res.json(result.rows)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error fetching users" })
  }
})

// Create user (admin only)
router.post(
  "/",
  [
    authenticateToken,
    requireRole(["system_admin"]),
    nameValidation,
    emailValidation,
    passwordValidation,
    addressValidation,
    body("role").isIn(["system_admin", "normal_user", "store_owner"]).withMessage("Invalid role"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
      }

      const { name, email, password, address, role } = req.body

      // Check if user already exists
      const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [email])
      if (existingUser.rows.length > 0) {
        return res.status(400).json({ message: "User already exists with this email" })
      }

      // Hash password
      const saltRounds = 10
      const hashedPassword = await bcrypt.hash(password, saltRounds)

      // Create user
      const result = await pool.query(
        "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at",
        [name, email, hashedPassword, address, role],
      )

      res.status(201).json({
        message: "User created successfully",
        user: result.rows[0],
      })
    } catch (error) {
      console.error("Create user error:", error)
      res.status(500).json({ message: "Server error creating user" })
    }
  },
)

// Get user details
router.get("/:id", [authenticateToken, requireRole(["system_admin"])], async (req, res) => {
  try {
    const { id } = req.params

    const query = `
      SELECT u.id, u.name, u.email, u.address, u.role, u.created_at,
             CASE 
               WHEN u.role = 'store_owner' THEN COALESCE(AVG(r.rating), 0)
               ELSE NULL 
             END as rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id AND u.role = 'store_owner'
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE u.id = $1
      GROUP BY u.id, u.name, u.email, u.address, u.role, u.created_at
    `

    const result = await pool.query(query, [id])

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error("Get user details error:", error)
    res.status(500).json({ message: "Server error fetching user details" })
  }
})

module.exports = router
