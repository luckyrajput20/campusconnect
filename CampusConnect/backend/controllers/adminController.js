const { Op } = require("sequelize")
const { User, Student, Faculty, Class, Subject, Timetable, Notice, Attendance, Mark } = require("../models")

const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.count()
    const totalFaculty = await Faculty.count()
    const totalClasses = await Class.count()
    const totalSubjects = await Subject.count()
    const activeNotices = await Notice.count({ where: { is_active: true } })

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentStudents = await Student.count({
      where: {
        createdAt: { [Op.gte]: thirtyDaysAgo },
      },
    })

    res.json({
      success: true,
      stats: {
        totalStudents,
        totalFaculty,
        totalClasses,
        totalSubjects,
        activeNotices,
        recentStudents,
      },
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query
    const offset = (page - 1) * limit

    const whereClause = {}
    if (role) whereClause.role = role
    if (search) {
      whereClause[Op.or] = [{ name: { [Op.iLike]: `%${search}%` } }, { email: { [Op.iLike]: `%${search}%` } }]
    }

    const { count, rows: users } = await User.findAndCountAll({
      where: whereClause,
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Student,
          as: "studentProfile",
          include: [{ model: Class, as: "class" }],
        },
        { model: Faculty, as: "facultyProfile" },
      ],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["createdAt", "DESC"]],
    })

    res.json({
      success: true,
      users,
      pagination: {
        total: count,
        page: Number.parseInt(page),
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const createUser = async (req, res) => {
  try {
    const { name, email, password, role, ...profileData } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create user
    const user = await User.create({ name, email, password, role })

    // Create profile based on role
    let profile = null
    if (role === "student") {
      profile = await Student.create({
        user_id: user.id,
        ...profileData,
      })
    } else if (role === "faculty") {
      profile = await Faculty.create({
        user_id: user.id,
        ...profileData,
      })
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile,
      },
    })
  } catch (error) {
    console.error("Create user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateUser = async (req, res) => {
  try {
    const { id } = req.params
    const { name, email, role, is_active, ...profileData } = req.body

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Update user
    await user.update({ name, email, role, is_active })

    // Update profile based on role
    if (role === "student" && user.studentProfile) {
      await Student.update(profileData, { where: { user_id: id } })
    } else if (role === "faculty" && user.facultyProfile) {
      await Faculty.update(profileData, { where: { user_id: id } })
    }

    res.json({
      success: true,
      message: "User updated successfully",
    })
  } catch (error) {
    console.error("Update user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params

    const user = await User.findByPk(id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Soft delete by setting is_active to false
    await user.update({ is_active: false })

    res.json({
      success: true,
      message: "User deleted successfully",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getClasses = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query
    const offset = (page - 1) * limit

    const { count, rows: classes } = await Class.findAndCountAll({
      include: [
        { model: Student, as: "students" },
        { model: Subject, as: "subjects" },
      ],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [
        ["year", "ASC"],
        ["name", "ASC"],
      ],
    })

    res.json({
      success: true,
      classes,
      pagination: {
        total: count,
        page: Number.parseInt(page),
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    console.error("Get classes error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const createClass = async (req, res) => {
  try {
    const { name, year, section } = req.body

    const existingClass = await Class.findOne({
      where: { name, year, section },
    })

    if (existingClass) {
      return res.status(400).json({ message: "Class already exists" })
    }

    const newClass = await Class.create({ name, year, section })

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: newClass,
    })
  } catch (error) {
    console.error("Create class error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateClass = async (req, res) => {
  try {
    const { id } = req.params
    const { name, year, section } = req.body

    const classToUpdate = await Class.findByPk(id)
    if (!classToUpdate) {
      return res.status(404).json({ message: "Class not found" })
    }

    await classToUpdate.update({ name, year, section })

    res.json({
      success: true,
      message: "Class updated successfully",
    })
  } catch (error) {
    console.error("Update class error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteClass = async (req, res) => {
  try {
    const { id } = req.params

    const classToDelete = await Class.findByPk(id)
    if (!classToDelete) {
      return res.status(404).json({ message: "Class not found" })
    }

    await classToDelete.destroy()

    res.json({
      success: true,
      message: "Class deleted successfully",
    })
  } catch (error) {
    console.error("Delete class error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getSubjects = async (req, res) => {
  try {
    const { page = 1, limit = 10, class_id } = req.query
    const offset = (page - 1) * limit

    const whereClause = {}
    if (class_id) whereClause.class_id = class_id

    const { count, rows: subjects } = await Subject.findAndCountAll({
      where: whereClause,
      include: [
        { model: Class, as: "class" },
        {
          model: Faculty,
          as: "faculty",
          include: [{ model: User, as: "user", attributes: ["name", "email"] }],
        },
      ],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["name", "ASC"]],
    })

    res.json({
      success: true,
      subjects,
      pagination: {
        total: count,
        page: Number.parseInt(page),
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    console.error("Get subjects error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const createSubject = async (req, res) => {
  try {
    const { name, code, class_id, faculty_id, credits, semester } = req.body

    const existingSubject = await Subject.findOne({ where: { code } })
    if (existingSubject) {
      return res.status(400).json({ message: "Subject code already exists" })
    }

    const subject = await Subject.create({
      name,
      code,
      class_id,
      faculty_id,
      credits,
      semester,
    })

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject,
    })
  } catch (error) {
    console.error("Create subject error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const subject = await Subject.findByPk(id)
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" })
    }

    await subject.update(updateData)

    res.json({
      success: true,
      message: "Subject updated successfully",
    })
  } catch (error) {
    console.error("Update subject error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params

    const subject = await Subject.findByPk(id)
    if (!subject) {
      return res.status(404).json({ message: "Subject not found" })
    }

    await subject.destroy()

    res.json({
      success: true,
      message: "Subject deleted successfully",
    })
  } catch (error) {
    console.error("Delete subject error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getTimetable = async (req, res) => {
  try {
    const { class_id, day } = req.query

    const whereClause = {}
    if (class_id) whereClause.class_id = class_id
    if (day) whereClause.day = day

    const timetable = await Timetable.findAll({
      where: whereClause,
      include: [
        { model: Class, as: "class" },
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
    console.error("Get timetable error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const createTimetable = async (req, res) => {
  try {
    const { class_id, subject_id, day, start_time, end_time, room_no, semester } = req.body

    const timetableEntry = await Timetable.create({
      class_id,
      subject_id,
      day,
      start_time,
      end_time,
      room_no,
      semester,
    })

    res.status(201).json({
      success: true,
      message: "Timetable entry created successfully",
      timetable: timetableEntry,
    })
  } catch (error) {
    console.error("Create timetable error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateTimetable = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const timetableEntry = await Timetable.findByPk(id)
    if (!timetableEntry) {
      return res.status(404).json({ message: "Timetable entry not found" })
    }

    await timetableEntry.update(updateData)

    res.json({
      success: true,
      message: "Timetable updated successfully",
    })
  } catch (error) {
    console.error("Update timetable error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteTimetable = async (req, res) => {
  try {
    const { id } = req.params

    const timetableEntry = await Timetable.findByPk(id)
    if (!timetableEntry) {
      return res.status(404).json({ message: "Timetable entry not found" })
    }

    await timetableEntry.destroy()

    res.json({
      success: true,
      message: "Timetable entry deleted successfully",
    })
  } catch (error) {
    console.error("Delete timetable error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getNotices = async (req, res) => {
  try {
    const { page = 1, limit = 10, target } = req.query
    const offset = (page - 1) * limit

    const whereClause = { is_active: true }
    if (target) whereClause.target = target

    const { count, rows: notices } = await Notice.findAndCountAll({
      where: whereClause,
      include: [{ model: User, as: "author", attributes: ["name", "role"] }],
      limit: Number.parseInt(limit),
      offset: Number.parseInt(offset),
      order: [["createdAt", "DESC"]],
    })

    res.json({
      success: true,
      notices,
      pagination: {
        total: count,
        page: Number.parseInt(page),
        pages: Math.ceil(count / limit),
      },
    })
  } catch (error) {
    console.error("Get notices error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const createNotice = async (req, res) => {
  try {
    const { title, content, target, target_class_id, priority, expires_at } = req.body

    const notice = await Notice.create({
      title,
      content,
      posted_by: req.user.id,
      target,
      target_class_id,
      priority,
      expires_at,
    })

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    })
  } catch (error) {
    console.error("Create notice error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const updateNotice = async (req, res) => {
  try {
    const { id } = req.params
    const updateData = req.body

    const notice = await Notice.findByPk(id)
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" })
    }

    await notice.update(updateData)

    res.json({
      success: true,
      message: "Notice updated successfully",
    })
  } catch (error) {
    console.error("Update notice error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params

    const notice = await Notice.findByPk(id)
    if (!notice) {
      return res.status(404).json({ message: "Notice not found" })
    }

    await notice.update({ is_active: false })

    res.json({
      success: true,
      message: "Notice deleted successfully",
    })
  } catch (error) {
    console.error("Delete notice error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getAttendanceReport = async (req, res) => {
  try {
    const { class_id, subject_id, date_from, date_to } = req.query

    const whereClause = {}
    if (class_id) {
      const students = await Student.findAll({
        where: { class_id },
        attributes: ["id"],
      })
      whereClause.student_id = students.map((s) => s.id)
    }
    if (subject_id) whereClause.subject_id = subject_id
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
          include: [
            { model: User, as: "user", attributes: ["name"] },
            { model: Class, as: "class" },
          ],
        },
        { model: Subject, as: "subject" },
      ],
      order: [["date", "DESC"]],
    })

    res.json({
      success: true,
      attendance,
    })
  } catch (error) {
    console.error("Get attendance report error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

const getMarksReport = async (req, res) => {
  try {
    const { class_id, subject_id, assessment_type } = req.query

    const whereClause = {}
    if (class_id) {
      const students = await Student.findAll({
        where: { class_id },
        attributes: ["id"],
      })
      whereClause.student_id = students.map((s) => s.id)
    }
    if (subject_id) whereClause.subject_id = subject_id
    if (assessment_type) whereClause.assessment_type = assessment_type

    const marks = await Mark.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: "student",
          include: [
            { model: User, as: "user", attributes: ["name"] },
            { model: Class, as: "class" },
          ],
        },
        { model: Subject, as: "subject" },
      ],
      order: [["assessment_date", "DESC"]],
    })

    res.json({
      success: true,
      marks,
    })
  } catch (error) {
    console.error("Get marks report error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getDashboardStats,
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
}
