const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('inventory_items', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:          { type: DataTypes.STRING(100), allowNull: false },
  unit:          { type: DataTypes.STRING(20), allowNull: false },
  current_stock: { type: DataTypes.DECIMAL(10,3), defaultValue: 0 },
  reorder_level: { type: DataTypes.DECIMAL(10,3), defaultValue: 0 },
  cost_per_unit: { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, { tableName: 'inventory_items', timestamps: true, createdAt: 'created_at', updatedAt: false })
