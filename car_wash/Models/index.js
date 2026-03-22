const sequelize = require("../Config/db");
const Customer = require("../Models/customer.model");
const Membership = require("../Models/membership.model");
const pointsLog = require("../Models/pointsLog.model");
const CustomerMembership = require("../Models/customerMembership.model");
const InventoryItem = require("./inventoryItem.model");
const ServiceConsumption = require("./serviceConsumption.model");
const Service = require("./service.model");
const Transaction = require("./transaction.model");
const TransactionItem = require("./transactionItem.model");
const Staff = require("./staff.model");
const transaction = require("./transaction.model");
const service = require("./service.model");
const Supplier = require("./supplier.model");
const StockTransaction = require("./stockTransaction.model");
const PurchaseOrder = require("./purchaseOrder.model");
const PurchaseOrderItem = require("./purchaseOrderItem.model");
const Payment = require("../Models/payment.model");

Customer.hasMany(CustomerMembership, {
  foreignKey: "customer_id",
  as: "memberships",
});
CustomerMembership.belongsTo(Customer, {
  foreignKey: "customer_id",
  as: "customer",
});
CustomerMembership.belongsTo(Membership, {
  foreignKey: "membership_id",
  as: "plan",
});
Membership.hasMany(CustomerMembership, {
  foreignKey: "membership_id",
  as: "subscribers",
});
// Customer → Transactions
Customer.hasMany(Transaction, {
  foreignKey: "customer_id",
  as: "transactions",
});
Transaction.belongsTo(Customer, { foreignKey: "customer_id", as: "customer" });

// Staff → Transactions
Staff.hasMany(Transaction, { foreignKey: "staff_id", as: "transactions" });
Transaction.belongsTo(Staff, { foreignKey: "staff_id", as: "staff" });
// Service → TransactionItem
Service.hasMany(TransactionItem, { foreignKey: "service_id" });
TransactionItem.belongsTo(Service, { foreignKey: "service_id", as: "service" });
// Service ↔ InventoryItem (through ServiceConsumption)
Service.hasMany(ServiceConsumption, {
  foreignKey: "service_id",
  as: "consumptionRules",
});
ServiceConsumption.belongsTo(Service, { foreignKey: "service_id" });
ServiceConsumption.belongsTo(InventoryItem, {
  foreignKey: "item_id",
  as: "item",
});
InventoryItem.hasMany(ServiceConsumption, { foreignKey: "item_id" });

// InventoryItem → StockTransactions
InventoryItem.hasMany(StockTransaction, {
  foreignKey: "item_id",
  as: "movements",
});
StockTransaction.belongsTo(InventoryItem, {
  foreignKey: "item_id",
  as: "item",
});
// Transaction → Items + Payments
Transaction.hasMany(TransactionItem, {
  foreignKey: "transaction_id",
  as: "items",
});
TransactionItem.belongsTo(Transaction, { foreignKey: "transaction_id" });
Transaction.hasMany(Payment, { foreignKey: "transaction_id", as: "payments" });
Payment.belongsTo(Transaction, { foreignKey: "transaction_id" });
// Supplier → PurchaseOrders
Supplier.hasMany(PurchaseOrder, { foreignKey: "supplier_id", as: "orders" });
PurchaseOrder.belongsTo(Supplier, {
  foreignKey: "supplier_id",
  as: "supplier",
});

// PurchaseOrder → Items
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: "po_id", as: "items" });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: "po_id" });
PurchaseOrderItem.belongsTo(InventoryItem, {
  foreignKey: "item_id",
  as: "inventoryItem",
});

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ All models synchronized successfully.");
  } catch (error) {
    console.error("❌ Error synchronizing models:", error);
    throw error;
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  Customer,
  Membership,
  pointsLog,
  CustomerMembership,
  transaction,
  TransactionItem,
  service,
  ServiceConsumption,
  InventoryItem,
  Supplier,
  StockTransaction,
  PurchaseOrder,
  PurchaseOrderItem,
};
