const router = require('express').Router()
const { auth, requireRole } = require('../middleware/auth')
const { validate, checkoutRules, uuidParamRules, paginationRules, dateRangeRules } = require('../middleware/validate')
const c = require('../controllers/pos.controller')

router.use(auth)

router.get('/services',                                                          c.getServices)
router.get('/customers/search',                                                  c.searchCustomer)
router.get('/transactions',         [...paginationRules, ...dateRangeRules], validate, c.listTransactions)
router.get('/transactions/:id',     uuidParamRules, validate,                   c.getTransactionDetail)
router.post('/checkout',            checkoutRules, validate,                    c.checkout)
router.post('/transactions/:id/void', uuidParamRules, validate,                 requireRole('manager'), c.voidTransaction)

module.exports = router
