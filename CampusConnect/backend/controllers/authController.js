const jwt = require("jsonwebtoken")
const { User, Student, Faculty, Class } = require("../models")
const { validationResult } = require("express-validator")

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  })
}

const login = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body

    const user = await User.findOne({
      where: { email, is_active: true },
      include: [
        {
          model: Student,
          as: "studentProfile",
          include: [{ model: Class, as: "class" }],
        },
        { model: Faculty, as: "facultyProfile" },
      ],
    })

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const token = generateToken(user.id)

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.studentProfile || user.facultyProfile || null,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const register = async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, email, password, role, ...profileData } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    })

    // Create profile based on role
    let profile = null
    if (role === "student") {
      profile = await Student.create({
        user_id: user.id,
        reg_no: profileData.reg_no,
        class_id: profileData.class_id,
        phone: profileData.phone,
        address: profileData.address,
        date_of_birth: profileData.date_of_birth,
        guardian_name: profileData.guardian_name,
        guardian_phone: profileData.guardian_phone,
      })
    } else if (role === "faculty") {
      profile = await Faculty.create({
        user_id: user.id,
        dept: profileData.dept,
        designation: profileData.designation,
        phone: profileData.phone,
        qualification: profileData.qualification,
        experience: profileData.experience,
      })
    }

    const token = generateToken(user.id)

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getProfile = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user,
    })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  login,
  register,
  getProfile,
}
