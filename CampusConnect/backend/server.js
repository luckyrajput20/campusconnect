const express = require("express")
const cors = require("cors")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const swaggerJsdoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")
require("dotenv").config()

const { sequelize } = require("./models")
const authRoutes = require("./routes/auth")
const adminRoutes = require("./routes/admin")
const facultyRoutes = require("./routes/faculty")
const studentRoutes = require("./routes/student")

const app = express()

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? ["https://your-frontend-domain.com"] : ["http://localhost:3000"],
    credentials: true,
  }),
)

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})
app.use(limiter)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CampusConnect API",
      version: "1.0.0",
      description: "College Management System API",
    },
    servers: [
      {
        url: process.env.NODE_ENV === "production" ? "https://your-api-domain.com" : "http://localhost:5000",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
}

const specs = swaggerJsdoc(swaggerOptions)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/admin", adminRoutes)
app.use("/api/faculty", facultyRoutes)
app.use("/api/student", studentRoutes)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" })
})

const PORT = process.env.PORT || 5000

// Database connection and server start
const startServer = async () => {
  try {
    await sequelize.authenticate()
    console.log("Database connected successfully")

    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: true })
      console.log("Database synchronized")
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`)
    })
  } catch (error) {
    console.error("Unable to start server:", error)
    process.exit(1)
  }
}

startServer()
