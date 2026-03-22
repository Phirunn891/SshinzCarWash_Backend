const { DataTypes } = require("sequelize");
const sequelize = require("../Config/db");
const payment = sequelize.define(
  "payments",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    transaction_id: { type: DataTypes.UUID, allowNull: false },
    method: {
      type: DataTypes.ENUM("cash", "card", "qr", "ewallet"),
      allowNull: false,
    },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    reference_no: { type: DataTypes.STRING(100) },
    paid_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  { tableName: "payments", timestamps: false },
);

module.exports = payment;
