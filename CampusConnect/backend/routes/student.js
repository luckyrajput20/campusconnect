const express = require("express")
const { auth, authorize } = require("../middleware/auth")
const {
  getDashboard,
  getMyAttendance,
  getMyMarks,
  getMyTimetable,
  getNotices,
  getAttendancePercentage,
} = require("../controllers/studentController")

const router = express.Router()

// Apply auth and student authorization to all routes
router.use(auth)
router.use(authorize("student"))

/**
 * @swagger
 * /api/student/dashboard:
 *   get:
 *     summary: Get student dashboard
 *     tags: [Student]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get("/dashboard", getDashboard)
router.get("/attendance", getMyAttendance)
router.get("/attendance/percentage", getAttendancePercentage)
router.get("/marks", getMyMarks)
router.get("/timetable", getMyTimetable)
router.get("/notices", getNotices)

module.exports = router
