const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      reg_no: {
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
      phone: {
        type: DataTypes.STRING,
        validate: {
          len: [10, 15],
        },
      },
      address: {
        type: DataTypes.TEXT,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
      },
      guardian_name: {
        type: DataTypes.STRING,
      },
      guardian_phone: {
        type: DataTypes.STRING,
      },
    },
    {
      tableName: "students",
      timestamps: true,
    },
  )

  return Student
}
