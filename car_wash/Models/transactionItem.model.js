const { DataTypes } = require("sequelize");

module.exports = (sequelize) =>
  sequelize.define(
    "transaction_items",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      transaction_id: { type: DataTypes.UUID, allowNull: false },
      service_id: { type: DataTypes.UUID, allowNull: false },
      qty: { type: DataTypes.INTEGER, defaultValue: 1 },
      unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    { tableName: "transaction_items", timestamps: false },
  );
