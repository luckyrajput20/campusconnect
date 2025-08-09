const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Timetable = sequelize.define(
    "Timetable",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "classes",
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
      day: {
        type: DataTypes.ENUM("monday", "tuesday", "wednesday", "thursday", "friday", "saturday"),
        allowNull: false,
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      room_no: {
        type: DataTypes.STRING,
      },
      semester: {
        type: DataTypes.INTEGER,
        validate: {
          min: 1,
          max: 8,
        },
      },
    },
    {
      tableName: "timetable",
      timestamps: true,
      indexes: [
        {
          fields: ["class_id", "day", "start_time"],
        },
      ],
    },
  )

  return Timetable
}
