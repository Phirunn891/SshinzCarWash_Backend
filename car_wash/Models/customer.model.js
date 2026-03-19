const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('customers', {
  id:             { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:           { type: DataTypes.STRING(100), allowNull: false },
  phone:          { type: DataTypes.STRING(20), allowNull: false, unique: true },
  email:          { type: DataTypes.STRING(100) },
  vehicle_plate:  { type: DataTypes.STRING(20) },
  points_balance: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: { args: [0], msg: 'Points balance cannot be negative' } },
  },
}, { tableName: 'customers', timestamps: true, createdAt: 'created_at', updatedAt: false })
