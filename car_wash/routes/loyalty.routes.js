const router = require('express').Router()
const { auth, requireRole } = require('../middleware/auth')
const {
  validate, createCustomerRules, assignMembershipRules,
  adjustPointsRules, uuidParamRules, paginationRules,
} = require('../middleware/validate')
const c = require('../controllers/loyalty.controller')

router.use(auth)

router.get('/customers',                                                       c.getCustomers)
router.post('/customers',             createCustomerRules, validate,           c.createCustomer)
router.get('/customers/expiring',                                              c.getExpiring)
router.get('/customers/:id',          uuidParamRules, validate,                c.getCustomer)
router.put('/customers/:id',          [...uuidParamRules, ...createCustomerRules], validate, c.updateCustomer)
router.get('/customers/:id/transactions', uuidParamRules, validate,            c.getCustomerTransactions)
router.get('/customers/:id/points',   uuidParamRules, validate,                c.getPointsHistory)
router.post('/customers/:id/points/adjust', [...uuidParamRules, ...adjustPointsRules], validate, requireRole('manager'), c.adjustPoints)
router.post('/customers/:id/membership',    [...uuidParamRules, ...assignMembershipRules], validate, requireRole('manager','cashier'), c.assignMembership)
router.delete('/customers/:id/membership',  uuidParamRules, validate,          requireRole('manager'), c.cancelMembership)

router.get('/memberships',                                                     c.getMemberships)
router.get('/points',           paginationRules, validate,                     requireRole('manager'), c.getAllPointsActivity)

module.exports = router
