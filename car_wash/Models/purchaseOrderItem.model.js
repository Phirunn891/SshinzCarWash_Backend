const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('purchase_order_items', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  po_id:     { type: DataTypes.UUID, allowNull: false },
  item_id:   { type: DataTypes.UUID, allowNull: false },
  qty:       { type: DataTypes.DECIMAL(10,3), allowNull: false },
  unit_cost: { type: DataTypes.DECIMAL(10,2), allowNull: false },
}, { tableName: 'purchase_order_items', timestamps: false })
