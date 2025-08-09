const express = require("express")
const { auth, authorize } = require("../middleware/auth")
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getClasses,
  createClass,
  updateClass,
  deleteClass,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
  getTimetable,
  createTimetable,
  updateTimetable,
  deleteTimetable,
  getNotices,
  createNotice,
  updateNotice,
  deleteNotice,
  getAttendanceReport,
  getMarksReport,
  getDashboardStats,
} = require("../controllers/adminController")

const router = express.Router()

// Apply auth and admin authorization to all routes
router.use(auth)
router.use(authorize("admin"))

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard stats retrieved successfully
 */
router.get("/dashboard", getDashboardStats)

// User management routes
router.get("/users", getUsers)
router.post("/users", createUser)
router.put("/users/:id", updateUser)
router.delete("/users/:id", deleteUser)

// Class management routes
router.get("/classes", getClasses)
router.post("/classes", createClass)
router.put("/classes/:id", updateClass)
router.delete("/classes/:id", deleteClass)

// Subject management routes
router.get("/subjects", getSubjects)
router.post("/subjects", createSubject)
router.put("/subjects/:id", updateSubject)
router.delete("/subjects/:id", deleteSubject)

// Timetable management routes
router.get("/timetable", getTimetable)
router.post("/timetable", createTimetable)
router.put("/timetable/:id", updateTimetable)
router.delete("/timetable/:id", deleteTimetable)

// Notice management routes
router.get("/notices", getNotices)
router.post("/notices", createNotice)
router.put("/notices/:id", updateNotice)
router.delete("/notices/:id", deleteNotice)

// Reports
router.get("/attendance-report", getAttendanceReport)
router.get("/marks-report", getMarksReport)

module.exports = router
