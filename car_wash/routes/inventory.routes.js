const router = require('express').Router()
const { auth, requireRole } = require('../middleware/auth')
const {
  validate, createItemRules, createSupplierRules,
  createPurchaseOrderRules, uuidParamRules, paginationRules,
} = require('../middleware/validate')
const c = require('../controllers/inventory.controller')

router.use(auth)

router.get('/items',                                                          c.getItems)
router.get('/items/alerts',                                                   c.getLowStock)
router.post('/items',         createItemRules, validate,                      requireRole('manager'), c.createItem)
router.put('/items/:id',      [...uuidParamRules, ...createItemRules], validate, requireRole('manager'), c.updateItem)
router.get('/items/:id/transactions', [...uuidParamRules, ...paginationRules], validate, c.getStockHistory)

router.get('/suppliers',                                                      c.getSuppliers)
router.post('/suppliers',     createSupplierRules, validate,                  requireRole('manager'), c.createSupplier)

router.get('/purchase-orders',                                                c.getPurchaseOrders)
router.post('/purchase-orders',   createPurchaseOrderRules, validate,         requireRole('manager'), c.createPurchaseOrder)
router.patch('/purchase-orders/:id/receive', uuidParamRules, validate,        requireRole('manager'), c.receivePurchaseOrder)

module.exports = router
