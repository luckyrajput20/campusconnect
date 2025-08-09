const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Mark = sequelize.define(
    "Mark",
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
      mark: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      max_mark: {
        type: DataTypes.DECIMAL(5, 2),
        defaultValue: 100,
        validate: {
          min: 1,
        },
      },
      assessment_type: {
        type: DataTypes.ENUM("internal", "external", "assignment", "quiz", "project"),
        allowNull: false,
        defaultValue: "internal",
      },
      assessment_date: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      remarks: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: "marks",
      timestamps: true,
      indexes: [
        {
          fields: ["student_id", "subject_id", "assessment_type"],
        },
      ],
    },
  )

  return Mark
}
