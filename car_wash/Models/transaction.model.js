const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('transactions', {
  id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  customer_id:     { type: DataTypes.UUID },
  staff_id:        { type: DataTypes.UUID, allowNull: false },
  subtotal:        { type: DataTypes.DECIMAL(10,2), allowNull: false },
  discount_amount: { type: DataTypes.DECIMAL(10,2), defaultValue: 0 },
  points_used:     { type: DataTypes.INTEGER, defaultValue: 0 },
  total:           { type: DataTypes.DECIMAL(10,2), allowNull: false },
  status:          {
    type: DataTypes.ENUM('pending','completed','voided','refunded'),
    defaultValue: 'pending',
  },
  note: { type: DataTypes.TEXT },
}, { tableName: 'transactions', timestamps: true, createdAt: 'created_at', updatedAt: false })
