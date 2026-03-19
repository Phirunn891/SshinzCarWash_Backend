const { body, param, query, validationResult } = require('express-validator')

// Run validation and return 422 if any errors
const validate = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    })
  }
  next()
}

// -----------------------------------------------
// AUTH
// -----------------------------------------------
const loginRules = [
  body('pin')
    .notEmpty().withMessage('PIN is required')
    .isLength({ min: 4, max: 8 }).withMessage('PIN must be 4–8 digits')
    .isNumeric().withMessage('PIN must be numeric'),
]

// -----------------------------------------------
// STAFF
// -----------------------------------------------
const createStaffRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['washer', 'cashier', 'detailer', 'manager'])
    .withMessage('Role must be: washer, cashier, detailer or manager'),
  body('pin')
    .notEmpty().withMessage('PIN is required')
    .isLength({ min: 4, max: 8 }).withMessage('PIN must be 4–8 digits')
    .isNumeric().withMessage('PIN must be numeric'),
]

const updateStaffRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['washer', 'cashier', 'detailer', 'manager'])
    .withMessage('Role must be: washer, cashier, detailer or manager'),
]

const updatePinRules = [
  body('pin')
    .notEmpty().withMessage('PIN is required')
    .isLength({ min: 4, max: 8 }).withMessage('PIN must be 4–8 digits')
    .isNumeric().withMessage('PIN must be numeric'),
]

// -----------------------------------------------
// SERVICES
// -----------------------------------------------
const createServiceRules = [
  body('name')
    .trim().notEmpty().withMessage('Service name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('vehicle_type')
    .optional()
    .isIn(['sedan', 'suv', 'truck', 'van', 'all'])
    .withMessage('vehicle_type must be: sedan, suv, truck, van or all'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0.01 }).withMessage('Price must be a positive number'),
  body('duration_mins')
    .optional()
    .isInt({ min: 1, max: 480 }).withMessage('Duration must be between 1 and 480 minutes'),
]

const consumptionRules = [
  body('item_id')
    .notEmpty().withMessage('item_id is required')
    .isUUID().withMessage('item_id must be a valid UUID'),
  body('qty_per_service')
    .notEmpty().withMessage('qty_per_service is required')
    .isFloat({ min: 0.001 }).withMessage('qty_per_service must be a positive number'),
]

// -----------------------------------------------
// MEMBERSHIPS
// -----------------------------------------------
const membershipRules = [
  body('name')
    .trim().notEmpty().withMessage('Plan name is required')
    .isLength({ max: 50 }).withMessage('Name must be under 50 characters'),
  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),
  body('duration_days')
    .notEmpty().withMessage('duration_days is required')
    .isInt({ min: 1 }).withMessage('duration_days must be a positive integer'),
  body('discount_pct')
    .optional()
    .isFloat({ min: 0, max: 100 }).withMessage('discount_pct must be between 0 and 100'),
  body('free_washes')
    .optional()
    .isInt({ min: 0 }).withMessage('free_washes must be a non-negative integer'),
]

// -----------------------------------------------
// CUSTOMERS
// -----------------------------------------------
const createCustomerRules = [
  body('name')
    .trim().notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('phone')
    .trim().notEmpty().withMessage('Phone is required')
    .isLength({ min: 7, max: 20 }).withMessage('Phone must be 7–20 characters'),
  body('email')
    .optional({ checkFalsy: true })
    .isEmail().withMessage('Email must be a valid email address')
    .normalizeEmail(),
  body('vehicle_plate')
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 20 }).withMessage('Vehicle plate must be under 20 characters'),
]

const assignMembershipRules = [
  body('membership_id')
    .notEmpty().withMessage('membership_id is required')
    .isUUID().withMessage('membership_id must be a valid UUID'),
]

const adjustPointsRules = [
  body('points')
    .notEmpty().withMessage('points is required')
    .isInt().withMessage('points must be an integer')
    .not().equals('0').withMessage('points cannot be 0'),
  body('note')
    .trim().notEmpty().withMessage('A reason note is required for manual adjustments')
    .isLength({ max: 255 }).withMessage('Note must be under 255 characters'),
]

// -----------------------------------------------
// CHECKOUT
// -----------------------------------------------
const checkoutRules = [
  body('customer_id')
    .optional({ checkFalsy: true })
    .isUUID().withMessage('customer_id must be a valid UUID'),
  body('items')
    .isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.service_id')
    .notEmpty().withMessage('Each item must have a service_id')
    .isUUID().withMessage('service_id must be a valid UUID'),
  body('items.*.qty')
    .notEmpty().withMessage('Each item must have a qty')
    .isInt({ min: 1 }).withMessage('qty must be a positive integer'),
  body('payment_method')
    .notEmpty().withMessage('payment_method is required')
    .isIn(['cash', 'card', 'qr', 'ewallet'])
    .withMessage('payment_method must be: cash, card, qr or ewallet'),
  body('points_used')
    .optional()
    .isInt({ min: 0 }).withMessage('points_used must be a non-negative integer'),
]

// -----------------------------------------------
// INVENTORY
// -----------------------------------------------
const createItemRules = [
  body('name')
    .trim().notEmpty().withMessage('Item name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('unit')
    .trim().notEmpty().withMessage('Unit is required')
    .isIn(['L', 'ml', 'kg', 'g', 'pcs', 'bottle'])
    .withMessage('unit must be: L, ml, kg, g, pcs or bottle'),
  body('current_stock')
    .optional()
    .isFloat({ min: 0 }).withMessage('current_stock must be non-negative'),
  body('reorder_level')
    .optional()
    .isFloat({ min: 0 }).withMessage('reorder_level must be non-negative'),
  body('cost_per_unit')
    .notEmpty().withMessage('cost_per_unit is required')
    .isFloat({ min: 0 }).withMessage('cost_per_unit must be non-negative'),
]

const createSupplierRules = [
  body('name')
    .trim().notEmpty().withMessage('Supplier name is required')
    .isLength({ max: 100 }).withMessage('Name must be under 100 characters'),
  body('contact')
    .optional({ checkFalsy: true })
    .isLength({ max: 100 }).withMessage('Contact must be under 100 characters'),
  body('lead_time_days')
    .optional()
    .isInt({ min: 0 }).withMessage('lead_time_days must be a non-negative integer'),
]

const createPurchaseOrderRules = [
  body('supplier_id')
    .notEmpty().withMessage('supplier_id is required')
    .isUUID().withMessage('supplier_id must be a valid UUID'),
  body('items')
    .isArray({ min: 1 }).withMessage('items must be a non-empty array'),
  body('items.*.item_id')
    .notEmpty().withMessage('Each item must have an item_id')
    .isUUID().withMessage('item_id must be a valid UUID'),
  body('items.*.qty')
    .notEmpty().withMessage('Each item must have a qty')
    .isFloat({ min: 0.001 }).withMessage('qty must be a positive number'),
  body('items.*.unit_cost')
    .notEmpty().withMessage('Each item must have a unit_cost')
    .isFloat({ min: 0 }).withMessage('unit_cost must be non-negative'),
]

// -----------------------------------------------
// QUERY PARAM VALIDATORS (shared)
// -----------------------------------------------
const dateRangeRules = [
  query('from')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('from must be a valid date (YYYY-MM-DD)'),
  query('to')
    .optional()
    .isDate({ format: 'YYYY-MM-DD' }).withMessage('to must be a valid date (YYYY-MM-DD)'),
]

const paginationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
]

const uuidParamRules = [
  param('id')
    .isUUID().withMessage('id must be a valid UUID'),
]

module.exports = {
  validate,
  loginRules,
  createStaffRules, updateStaffRules, updatePinRules,
  createServiceRules, consumptionRules,
  membershipRules,
  createCustomerRules, assignMembershipRules, adjustPointsRules,
  checkoutRules,
  createItemRules, createSupplierRules, createPurchaseOrderRules,
  dateRangeRules, paginationRules, uuidParamRules,
}
