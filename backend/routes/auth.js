const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { body, validationResult } = require("express-validator")
const pool = require("../config/database")
const { authenticateToken } = require("../middleware/auth")

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

// Register normal user
router.post("/register", [nameValidation, emailValidation, passwordValidation, addressValidation], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, address } = req.body

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
      "INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role",
      [name, email, hashedPassword, address, "normal_user"],
    )

    const user = result.rows[0]
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" })

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error during registration" })
  }
})

// Login
router.post("/login", [emailValidation, body("password").notEmpty().withMessage("Password is required")], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    // Find user
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
    if (result.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    const user = result.rows[0]

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "your-secret-key", { expiresIn: "24h" })

    res.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error during login" })
  }
})

// Update password
router.put("/update-password", [authenticateToken, passwordValidation], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { currentPassword, newPassword } = req.body
    const userId = req.user.id

    // Get current user
    const result = await pool.query("SELECT password FROM users WHERE id = $1", [userId])
    const user = result.rows[0]

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ message: "Current password is incorrect" })
    }

    // Hash new password
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds)

    // Update password
    await pool.query("UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2", [
      hashedPassword,
      userId,
    ])

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Password update error:", error)
    res.status(500).json({ message: "Server error during password update" })
  }
})

module.exports = router
