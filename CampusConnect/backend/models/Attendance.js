const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Attendance = sequelize.define(
    "Attendance",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
      },
      subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "subjects",
          key: "id",
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      status: {
        type: DataTypes.ENUM("present", "absent", "late"),
        allowNull: false,
        defaultValue: "present",
      },
      marked_by: {
        type: DataTypes.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      remarks: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "attendance",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["student_id", "subject_id", "date"],
        },
      ],
    },
  )

  return Attendance
}
