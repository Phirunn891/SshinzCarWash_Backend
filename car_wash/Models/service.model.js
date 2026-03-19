const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('services', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name:          { type: DataTypes.STRING(100), allowNull: false },
  vehicle_type:  { type: DataTypes.ENUM('sedan','suv','truck','van','all'), defaultValue: 'all' },
  price:         { type: DataTypes.DECIMAL(10,2), allowNull: false },
  duration_mins: { type: DataTypes.INTEGER, defaultValue: 30 },
  is_active:     { type: DataTypes.BOOLEAN, defaultValue: true },
}, { tableName: 'services', timestamps: true, createdAt: 'created_at', updatedAt: false })
