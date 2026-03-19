const { Sequelize } = require('sequelize')
const config        = require('../database/config')

const env = process.env.NODE_ENV || 'development'
const cfg = config[env]

const sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg)

// Test connection on startup
sequelize.authenticate()
  .then(() => console.log('MySQL connected via Sequelize'))
  .catch(err => { console.error('Connection failed:', err.message); process.exit(1) })

// Load all models
const Staff             = require('./staff.model')(sequelize)
const Service           = require('./service.model')(sequelize)
const Membership        = require('./membership.model')(sequelize)
const Customer          = require('./customer.model')(sequelize)
const CustomerMembership= require('./customerMembership.model')(sequelize)
const Transaction       = require('./transaction.model')(sequelize)
const TransactionItem   = require('./transactionItem.model')(sequelize)
const Payment           = require('./payment.model')(sequelize)
const PointsLog         = require('./pointsLog.model')(sequelize)
const InventoryItem     = require('./inventoryItem.model')(sequelize)
const ServiceConsumption= require('./serviceConsumption.model')(sequelize)
const StockTransaction  = require('./stockTransaction.model')(sequelize)
const Supplier          = require('./supplier.model')(sequelize)
const PurchaseOrder     = require('./purchaseOrder.model')(sequelize)
const PurchaseOrderItem = require('./purchaseOrderItem.model')(sequelize)

// -----------------------------------------------
// ASSOCIATIONS
// -----------------------------------------------

// Customer ↔ Membership (through CustomerMembership)
Customer.hasMany(CustomerMembership, { foreignKey: 'customer_id', as: 'memberships' })
CustomerMembership.belongsTo(Customer,   { foreignKey: 'customer_id', as: 'customer' })
CustomerMembership.belongsTo(Membership, { foreignKey: 'membership_id', as: 'plan' })
Membership.hasMany(CustomerMembership,   { foreignKey: 'membership_id', as: 'subscribers' })

// Customer → Transactions
Customer.hasMany(Transaction,  { foreignKey: 'customer_id', as: 'transactions' })
Transaction.belongsTo(Customer,{ foreignKey: 'customer_id', as: 'customer' })

// Staff → Transactions
Staff.hasMany(Transaction,     { foreignKey: 'staff_id', as: 'transactions' })
Transaction.belongsTo(Staff,   { foreignKey: 'staff_id', as: 'staff' })

// Transaction → Items + Payments
Transaction.hasMany(TransactionItem, { foreignKey: 'transaction_id', as: 'items' })
TransactionItem.belongsTo(Transaction, { foreignKey: 'transaction_id' })
Transaction.hasMany(Payment,         { foreignKey: 'transaction_id', as: 'payments' })
Payment.belongsTo(Transaction,       { foreignKey: 'transaction_id' })

// Service → TransactionItem
Service.hasMany(TransactionItem, { foreignKey: 'service_id' })
TransactionItem.belongsTo(Service, { foreignKey: 'service_id', as: 'service' })

// Customer → PointsLog
Customer.hasMany(PointsLog,  { foreignKey: 'customer_id', as: 'pointsHistory' })
PointsLog.belongsTo(Customer,{ foreignKey: 'customer_id', as: 'customer' })
Transaction.hasMany(PointsLog,   { foreignKey: 'transaction_id' })
PointsLog.belongsTo(Transaction, { foreignKey: 'transaction_id', as: 'transaction' })

// Service ↔ InventoryItem (through ServiceConsumption)
Service.hasMany(ServiceConsumption,      { foreignKey: 'service_id', as: 'consumptionRules' })
ServiceConsumption.belongsTo(Service,    { foreignKey: 'service_id' })
ServiceConsumption.belongsTo(InventoryItem, { foreignKey: 'item_id', as: 'item' })
InventoryItem.hasMany(ServiceConsumption,   { foreignKey: 'item_id' })

// InventoryItem → StockTransactions
InventoryItem.hasMany(StockTransaction, { foreignKey: 'item_id', as: 'movements' })
StockTransaction.belongsTo(InventoryItem, { foreignKey: 'item_id', as: 'item' })

// Supplier → PurchaseOrders
Supplier.hasMany(PurchaseOrder,  { foreignKey: 'supplier_id', as: 'orders' })
PurchaseOrder.belongsTo(Supplier,{ foreignKey: 'supplier_id', as: 'supplier' })

// PurchaseOrder → Items
PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'po_id', as: 'items' })
PurchaseOrderItem.belongsTo(PurchaseOrder,  { foreignKey: 'po_id' })
PurchaseOrderItem.belongsTo(InventoryItem,  { foreignKey: 'item_id', as: 'inventoryItem' })

module.exports = {
  sequelize,
  Staff, Service, Membership, Customer,
  CustomerMembership, Transaction, TransactionItem,
  Payment, PointsLog, InventoryItem, ServiceConsumption,
  StockTransaction, Supplier, PurchaseOrder, PurchaseOrderItem,
}
