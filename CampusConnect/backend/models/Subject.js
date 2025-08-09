const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Subject = sequelize.define(
    "Subject",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      class_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "classes",
          key: "id",
        },
      },
      faculty_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "faculty",
          key: "id",
        },
      },
      credits: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
        validate: {
          min: 1,
          max: 6,
        },
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
      tableName: "subjects",
      timestamps: true,
    },
  )

  return Subject
}
