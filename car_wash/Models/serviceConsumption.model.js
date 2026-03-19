const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('service_consumption', {
  id:              { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  service_id:      { type: DataTypes.UUID, allowNull: false },
  item_id:         { type: DataTypes.UUID, allowNull: false },
  qty_per_service: { type: DataTypes.DECIMAL(10,3), allowNull: false },
}, {
  tableName: 'service_consumption',
  timestamps: false,
  indexes: [{ unique: true, fields: ['service_id', 'item_id'] }],
})
