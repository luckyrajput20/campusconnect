const { Sequelize } = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
})

// Import models
const User = require("./User")(sequelize)
const Class = require("./Class")(sequelize)
const Student = require("./Student")(sequelize)
const Faculty = require("./Faculty")(sequelize)
const Subject = require("./Subject")(sequelize)
const Mark = require("./Mark")(sequelize)
const Attendance = require("./Attendance")(sequelize)
const Timetable = require("./Timetable")(sequelize)
const Notice = require("./Notice")(sequelize)

// Define associations
User.hasOne(Student, { foreignKey: "user_id", as: "studentProfile" })
Student.belongsTo(User, { foreignKey: "user_id", as: "user" })

User.hasOne(Faculty, { foreignKey: "user_id", as: "facultyProfile" })
Faculty.belongsTo(User, { foreignKey: "user_id", as: "user" })

Class.hasMany(Student, { foreignKey: "class_id", as: "students" })
Student.belongsTo(Class, { foreignKey: "class_id", as: "class" })

Class.hasMany(Subject, { foreignKey: "class_id", as: "subjects" })
Subject.belongsTo(Class, { foreignKey: "class_id", as: "class" })

Faculty.hasMany(Subject, { foreignKey: "faculty_id", as: "subjects" })
Subject.belongsTo(Faculty, { foreignKey: "faculty_id", as: "faculty" })

Student.hasMany(Mark, { foreignKey: "student_id", as: "marks" })
Mark.belongsTo(Student, { foreignKey: "student_id", as: "student" })

Subject.hasMany(Mark, { foreignKey: "subject_id", as: "marks" })
Mark.belongsTo(Subject, { foreignKey: "subject_id", as: "subject" })

Student.hasMany(Attendance, { foreignKey: "student_id", as: "attendance" })
Attendance.belongsTo(Student, { foreignKey: "student_id", as: "student" })

Subject.hasMany(Attendance, { foreignKey: "subject_id", as: "attendance" })
Attendance.belongsTo(Subject, { foreignKey: "subject_id", as: "subject" })

Class.hasMany(Timetable, { foreignKey: "class_id", as: "timetable" })
Timetable.belongsTo(Class, { foreignKey: "class_id", as: "class" })

Subject.hasMany(Timetable, { foreignKey: "subject_id", as: "timetable" })
Timetable.belongsTo(Subject, { foreignKey: "subject_id", as: "subject" })

User.hasMany(Notice, { foreignKey: "posted_by", as: "notices" })
Notice.belongsTo(User, { foreignKey: "posted_by", as: "author" })

module.exports = {
  sequelize,
  User,
  Class,
  Student,
  Faculty,
  Subject,
  Mark,
  Attendance,
  Timetable,
  Notice,
}
