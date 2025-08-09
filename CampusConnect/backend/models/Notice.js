const { DataTypes } = require("sequelize")

module.exports = (sequelize) => {
  const Notice = sequelize.define(
    "Notice",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [5, 200],
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      posted_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      target: {
        type: DataTypes.ENUM("all", "students", "faculty", "class"),
        allowNull: false,
        defaultValue: "all",
      },
      target_class_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "classes",
          key: "id",
        },
      },
      priority: {
        type: DataTypes.ENUM("low", "medium", "high", "urgent"),
        defaultValue: "medium",
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      expires_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: "notices",
      timestamps: true,
      indexes: [
        {
          fields: ["target", "is_active", "createdAt"],
        },
      ],
    },
  )

  return Notice
}
