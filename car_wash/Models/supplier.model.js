const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('suppliers', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:           { type: DataTypes.STRING(100), allowNull: false },
  contact:        { type: DataTypes.STRING(100) },
  lead_time_days: { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'suppliers', timestamps: true, createdAt: 'created_at', updatedAt: false })
