const jwt = require("jsonwebtoken")
const { User, Student, Faculty } = require("../models")

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json({ message: "No token, authorization denied" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Student, as: "studentProfile" },
        { model: Faculty, as: "facultyProfile" },
      ],
    })

    if (!user || !user.is_active) {
      return res.status(401).json({ message: "Token is not valid" })
    }

    req.user = user
    next()
  } catch (error) {
    console.error("Auth middleware error:", error)
    res.status(401).json({ message: "Token is not valid" })
  }
}

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required roles: ${roles.join(", ")}`,
      })
    }

    next()
  }
}

module.exports = { auth, authorize }
