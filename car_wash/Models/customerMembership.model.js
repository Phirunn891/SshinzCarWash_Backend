const { DataTypes } = require('sequelize')

module.exports = (sequelize) => sequelize.define('customer_membership', {
  id:            { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  customer_id:   { type: DataTypes.UUID, allowNull: false },
  membership_id: { type: DataTypes.UUID, allowNull: false },
  start_date:    { type: DataTypes.DATEONLY, allowNull: false },
  end_date:      { type: DataTypes.DATEONLY, allowNull: false },
  status:        {
    type: DataTypes.ENUM('pending','active','expired','cancelled'),
    defaultValue: 'active',
  },
}, { tableName: 'customer_membership', timestamps: true, createdAt: 'created_at', updatedAt: false })
