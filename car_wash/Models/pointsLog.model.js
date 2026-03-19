const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('points_log', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  customer_id:    { type: DataTypes.UUID, allowNull: false },
  transaction_id: { type: DataTypes.UUID },
  points_earned:  { type: DataTypes.INTEGER, defaultValue: 0 },
  points_used:    { type: DataTypes.INTEGER, defaultValue: 0 },
  balance_after:  { type: DataTypes.INTEGER, allowNull: false },
  note:           { type: DataTypes.STRING(255) },
}, { tableName: 'points_log', timestamps: true, createdAt: 'created_at', updatedAt: false })
