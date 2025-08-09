const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Faculty = sequelize.define(
    "Faculty",
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
      dept: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      designation: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
        validate: {
          len: [10, 15],
        },
      },
      qualification: {
        type: DataTypes.STRING,
      },
      experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "faculty",
      timestamps: true,
    },
  )

  return Faculty
}
