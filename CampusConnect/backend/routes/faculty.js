const express = require("express")
const { auth, authorize } = require("../middleware/auth")
const {
  getDashboard,
  getMySubjects,
  getStudentsBySubject,
  markAttendance,
  getAttendance,
  addMarks,
  getMarks,
  getTimetable,
  getNotices,
} = require("../controllers/facultyController")

const router = express.Router()

// Apply auth and faculty authorization to all routes
router.use(auth)
router.use(authorize("faculty"))

/**
 * @swagger
 * /api/faculty/dashboard:
 *   get:
 *     summary: Get faculty dashboard
 *     tags: [Faculty]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 */
router.get("/dashboard", getDashboard)
router.get("/subjects", getMySubjects)
router.get("/subjects/:id/students", getStudentsBySubject)
router.post("/attendance", markAttendance)
router.get("/attendance", getAttendance)
router.post("/marks", addMarks)
router.get("/marks", getMarks)
router.get("/timetable", getTimetable)
router.get("/notices", getNotices)

module.exports = router
