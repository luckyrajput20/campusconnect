const { Op } = require("sequelize")
const { User, Student, Faculty, Class, Subject, Timetable, Notice, Attendance, Mark } = require("../models")

const getDashboard = async (req, res) => {
  try {
    const facultyProfile = req.user.facultyProfile
    if (!facultyProfile) {
      return res.status(404).json({ message: "Faculty profile not found" })
    }

    const mySubjects = await Subject.count({
      where: { faculty_id: facultyProfile.id },
    })

    const totalStudents = await Student.count({
      include: [
        {
          model: Class,
          as: "class",
          include: [
            {
              model: Subject,
              as: "subjects",
              where: { faculty_id: facultyProfile.id },
            },
          ],
        },
      ],
    })

    const todayAttendance = await Attendance.count({
      where: {
        date: new Date().toISOString().split("T")[0],
      },
      include: [
        {
          model: Subject,
          as: "subject",
          where: { faculty_id: facultyProfile.id },
        },
      ],
    })

    const recentNotices = await Notice.findAll({
      where: {
        target: { [Op.in]: ["all", "faculty"] },
        is_active: true,
      },
      limit: 5,
      order: [["createdAt", "DESC"]],
    })

    res.json({
      success: true,
      stats: {
        mySubjects,
        totalStudents,
        todayAttendance,
        recentNotices: recentNotices.length,
      },
      recentNotices,
    })
  } catch (error) {
    console.error("Faculty dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getMySubjects = async (req, res) => {
  try {
    const facultyProfile = req.user.facultyProfile
    if (!facultyProfile) {
      return res.status(404).json({ message: "Faculty profile not found" })
    }

    const subjects = await Subject.findAll({
      where: { faculty_id: facultyProfile.id },
      include: [{ model: Class, as: "class" }],
      order: [["name", "ASC"]],
    })

    res.json({
      success: true,
      subjects,
    })
  } catch (error) {
    console.error("Get my subjects error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getStudentsBySubject = async (req, res) => {
  try {
    const { id: subjectId } = req.params
    const facultyProfile = req.user.facultyProfile

    // Verify faculty owns this subject
    const subject = await Subject.findOne({
      where: {
        id: subjectId,
        faculty_id: facultyProfile.id,
      },
      include: [{ model: Class, as: "class" }],
    })

    if (!subject) {
      return res.status(404).json({ message: "Subject not found or access denied" })
    }

    const students = await Student.findAll({
      where: { class_id: subject.class_id },
      include: [
        { model: User, as: "user", attributes: ["name", "email"] },
        { model: Class, as: "class" },
      ],
      order: [["reg_no", "ASC"]],
    })

    res.json({
      success: true,
      subject,
      students,
    })
  } catch (error) {
    console.error("Get students by subject error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const markAttendance = async (req, res) => {
  try {
    const { subject_id, date, attendance_data } = req.body
    const facultyProfile = req.user.facultyProfile

    // Verify faculty owns this subject
    const subject = await Subject.findOne({
      where: {
        id: subject_id,
        faculty_id: facultyProfile.id,
      },
    })

    if (!subject) {
      return res.status(404).json({ message: "Subject not found or access denied" })
    }

    // Delete existing attendance for this date and subject
    await Attendance.destroy({
      where: { subject_id, date },
    })

    // Create new attendance records
    const attendanceRecords = attendance_data.map((record) => ({
      student_id: record.student_id,
      subject_id,
      date,
      status: record.status,
      marked_by: req.user.id,
      remarks: record.remarks,
    }))

    await Attendance.bulkCreate(attendanceRecords)

    res.json({
      success: true,
      message: "Attendance marked successfully",
    })
  } catch (error) {
    console.error("Mark attendance error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getAttendance = async (req, res) => {
  try {
    const { subject_id, date_from, date_to, student_id } = req.query
    const facultyProfile = req.user.facultyProfile

    const whereClause = {}
    if (subject_id) {
      // Verify faculty owns this subject
      const subject = await Subject.findOne({
        where: {
          id: subject_id,
          faculty_id: facultyProfile.id,
        },
      })
      if (!subject) {
        return res.status(404).json({ message: "Subject not found or access denied" })
      }
      whereClause.subject_id = subject_id
    } else {
      // Get all subjects taught by this faculty
      const subjects = await Subject.findAll({
        where: { faculty_id: facultyProfile.id },
        attributes: ["id"],
      })
      whereClause.subject_id = subjects.map((s) => s.id)
    }

    if (student_id) whereClause.student_id = student_id
    if (date_from && date_to) {
      whereClause.date = {
        [Op.between]: [date_from, date_to],
      }
    }

    const attendance = await Attendance.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: "student",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
        { model: Subject, as: "subject" },
      ],
      order: [
        ["date", "DESC"],
        ["student_id", "ASC"],
      ],
    })

    res.json({
      success: true,
      attendance,
    })
  } catch (error) {
    console.error("Get attendance error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const addMarks = async (req, res) => {
  try {
    const { subject_id, marks_data } = req.body
    const facultyProfile = req.user.facultyProfile

    // Verify faculty owns this subject
    const subject = await Subject.findOne({
      where: {
        id: subject_id,
        faculty_id: facultyProfile.id,
      },
    })

    if (!subject) {
      return res.status(404).json({ message: "Subject not found or access denied" })
    }

    // Create marks records
    const marksRecords = marks_data.map((record) => ({
      student_id: record.student_id,
      subject_id,
      mark: record.mark,
      max_mark: record.max_mark || 100,
      assessment_type: record.assessment_type,
      assessment_date: record.assessment_date || new Date(),
      remarks: record.remarks,
    }))

    await Mark.bulkCreate(marksRecords)

    res.json({
      success: true,
      message: "Marks added successfully",
    })
  } catch (error) {
    console.error("Add marks error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getMarks = async (req, res) => {
  try {
    const { subject_id, assessment_type, student_id } = req.query
    const facultyProfile = req.user.facultyProfile

    const whereClause = {}
    if (subject_id) {
      // Verify faculty owns this subject
      const subject = await Subject.findOne({
        where: {
          id: subject_id,
          faculty_id: facultyProfile.id,
        },
      })
      if (!subject) {
        return res.status(404).json({ message: "Subject not found or access denied" })
      }
      whereClause.subject_id = subject_id
    } else {
      // Get all subjects taught by this faculty
      const subjects = await Subject.findAll({
        where: { faculty_id: facultyProfile.id },
        attributes: ["id"],
      })
      whereClause.subject_id = subjects.map((s) => s.id)
    }

    if (assessment_type) whereClause.assessment_type = assessment_type
    if (student_id) whereClause.student_id = student_id

    const marks = await Mark.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: "student",
          include: [{ model: User, as: "user", attributes: ["name"] }],
        },
        { model: Subject, as: "subject" },
      ],
      order: [
        ["assessment_date", "DESC"],
        ["student_id", "ASC"],
      ],
    })

    res.json({
      success: true,
      marks,
    })
  } catch (error) {
    console.error("Get marks error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getTimetable = async (req, res) => {
  try {
    const facultyProfile = req.user.facultyProfile

    const timetable = await Timetable.findAll({
      include: [
        { model: Class, as: "class" },
        {
          model: Subject,
          as: "subject",
          where: { faculty_id: facultyProfile.id },
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
    console.error("Get faculty timetable error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const notices = await Notice.findAndCountAll({
      where: {
        target: { [Op.in]: ["all", "faculty"] },
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
    console.error("Get faculty notices error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getDashboard,
  getMySubjects,
  getStudentsBySubject,
  markAttendance,
  getAttendance,
  addMarks,
  getMarks,
  getTimetable,
  getNotices,
}
