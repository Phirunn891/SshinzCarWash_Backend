const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('stock_transactions', {
  id:           { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  item_id:      { type: DataTypes.UUID, allowNull: false },
  type:         { type: DataTypes.ENUM('in','out'), allowNull: false },
  qty:          { type: DataTypes.DECIMAL(10,3), allowNull: false },
  reference_id: { type: DataTypes.UUID },
  note:         { type: DataTypes.TEXT },
}, { tableName: 'stock_transactions', timestamps: true, createdAt: 'created_at', updatedAt: false })
