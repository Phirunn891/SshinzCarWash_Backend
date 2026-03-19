const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('memberships', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:          { type: DataTypes.STRING(50), allowNull: false },
  price:         { type: DataTypes.DECIMAL(10,2), allowNull: false },
  duration_days: { type: DataTypes.INTEGER, allowNull: false },
  discount_pct:  { type: DataTypes.DECIMAL(5,2), defaultValue: 0 },
  free_washes:   { type: DataTypes.INTEGER, defaultValue: 0 },
}, { tableName: 'memberships', timestamps: true, createdAt: 'created_at', updatedAt: false })
