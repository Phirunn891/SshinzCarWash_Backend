const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('staff', {
  id:        { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:      { type: DataTypes.STRING(100), allowNull: false },
  role:      { type: DataTypes.ENUM('washer','cashier','detailer','manager'), allowNull: false },
  pin:       { type: DataTypes.STRING(255), allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'staff', timestamps: true, createdAt: 'created_at', updatedAt: false })
