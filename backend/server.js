const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth")
const userRoutes = require("./routes/users")
const storeRoutes = require("./routes/stores")
const ratingRoutes = require("./routes/ratings")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/stores", storeRoutes)
app.use("/api/ratings", ratingRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
