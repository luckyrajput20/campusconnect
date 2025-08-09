const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Class = sequelize.define(
    "Class",
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
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 4,
        },
      },
      section: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [1, 5],
        },
      },
    },
    {
      tableName: "classes",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["name", "year", "section"],
        },
      ],
    },
  )

  return Class
}
