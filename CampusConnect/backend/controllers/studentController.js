const { Op } = require("sequelize")
const { User, Student, Class, Subject, Timetable, Notice, Attendance, Mark, Faculty } = require("../models")

const getDashboard = async (req, res) => {
  try {
    const studentProfile = req.user.studentProfile
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" })
    }

    // Get subjects for this student's class
    const subjects = await Subject.findAll({
      where: { class_id: studentProfile.class_id },
    })

    const subjectIds = subjects.map((s) => s.id)

    // Calculate overall attendance percentage
    const totalClasses = await Attendance.count({
      where: {
        student_id: studentProfile.id,
        subject_id: { [Op.in]: subjectIds },
      },
    })

    const presentClasses = await Attendance.count({
      where: {
        student_id: studentProfile.id,
        subject_id: { [Op.in]: subjectIds },
        status: "present",
      },
    })

    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0

    // Get recent marks
    const recentMarks = await Mark.findAll({
      where: {
        student_id: studentProfile.id,
        subject_id: { [Op.in]: subjectIds },
      },
      include: [{ model: Subject, as: "subject" }],
      limit: 5,
      order: [["assessment_date", "DESC"]],
    })

    // Get recent notices
    const recentNotices = await Notice.findAll({
      where: {
        [Op.or]: [
          { target: "all" },
          { target: "students" },
          { target: "class", target_class_id: studentProfile.class_id },
        ],
        is_active: true,
      },
      limit: 5,
      order: [["createdAt", "DESC"]],
    })

    res.json({
      success: true,
      stats: {
        totalSubjects: subjects.length,
        attendancePercentage,
        totalClasses,
        presentClasses,
        recentMarks: recentMarks.length,
        recentNotices: recentNotices.length,
      },
      recentMarks,
      recentNotices,
    })
  } catch (error) {
    console.error("Student dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getMyAttendance = async (req, res) => {
  try {
    const { subject_id, date_from, date_to } = req.query
    const studentProfile = req.user.studentProfile

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" })
    }

    const whereClause = { student_id: studentProfile.id }
    if (subject_id) whereClause.subject_id = subject_id
    if (date_from && date_to) {
      whereClause.date = {
        [Op.between]: [date_from, date_to],
      }
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      include: [{ model: Subject, as: "subject" }],
      order: [["date", "DESC"]],
    })

    res.json({
      success: true,
      attendance,
    })
  } catch (error) {
    console.error("Get student attendance error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getAttendancePercentage = async (req, res) => {
  try {
    const studentProfile = req.user.studentProfile
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" })
    }

    // Get subjects for this student's class
    const subjects = await Subject.findAll({
      where: { class_id: studentProfile.class_id },
    })

    const attendanceStats = await Promise.all(
      subjects.map(async (subject) => {
        const totalClasses = await Attendance.count({
          where: {
            student_id: studentProfile.id,
            subject_id: subject.id,
          },
        })

        const presentClasses = await Attendance.count({
          where: {
            student_id: studentProfile.id,
            subject_id: subject.id,
            status: "present",
          },
        })

        const percentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0

        return {
          subject: {
            id: subject.id,
            name: subject.name,
            code: subject.code,
          },
          totalClasses,
          presentClasses,
          absentClasses: totalClasses - presentClasses,
          percentage,
        }
      }),
    )

    res.json({
      success: true,
      attendanceStats,
    })
  } catch (error) {
    console.error("Get attendance percentage error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getMyMarks = async (req, res) => {
  try {
    const { subject_id, assessment_type } = req.query
    const studentProfile = req.user.studentProfile

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" })
    }

    const whereClause = { student_id: studentProfile.id }
    if (subject_id) whereClause.subject_id = subject_id
    if (assessment_type) whereClause.assessment_type = assessment_type

    const marks = await Mark.findAll({
      where: whereClause,
      include: [{ model: Subject, as: "subject" }],
      order: [["assessment_date", "DESC"]],
    })

    res.json({
      success: true,
      marks,
    })
  } catch (error) {
    console.error("Get student marks error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getMyTimetable = async (req, res) => {
  try {
    const studentProfile = req.user.studentProfile
    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" })
    }

    const timetable = await Timetable.findAll({
      where: { class_id: studentProfile.class_id },
      include: [
        {
          model: Subject,
          as: "subject",
          include: [
            {
              model: Faculty,
              as: "faculty",
              include: [{ model: User, as: "user", attributes: ["name"] }],
            },
          ],
        },
      ],
      order: [
        ["day", "ASC"],
        ["start_time", "ASC"],
      ],
    })

    res.json({
      success: true,
      timetable,
    })
  } catch (error) {
    console.error("Get student timetable error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit
    const studentProfile = req.user.studentProfile

    if (!studentProfile) {
      return res.status(404).json({ message: "Student profile not found" })
    }

    const notices = await Notice.findAndCountAll({
      where: {
        [Op.or]: [
          { target: "all" },
          { target: "students" },
          { target: "class", target_class_id: studentProfile.class_id },
        ],
        is_active: true,
      },
      include: [{ model: User, as: "author", attributes: ["name", "role"] }],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["createdAt", "DESC"]],
    })

    res.json({
      success: true,
      notices: notices.rows,
      pagination: {
        total: notices.count,
        page: Number.parseInt(page),
        pages: Math.ceil(notices.count / limit),
      },
    })
  } catch (error) {
    console.error("Get student notices error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getDashboard,
  getMyAttendance,
  getMyMarks,
  getMyTimetable,
  getNotices,
  getAttendancePercentage,
}
