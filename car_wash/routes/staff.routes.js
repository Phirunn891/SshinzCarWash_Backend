const router = require('express').Router()
const { auth, requireRole } = require('../middleware/auth')
const { validate, createStaffRules, updateStaffRules, updatePinRules, uuidParamRules, dateRangeRules } = require('../middleware/validate')
const c = require('../controllers/staff.controller')

router.use(auth)

router.get('/',                                                                  requireRole('manager'), c.getAll)
router.post('/',        createStaffRules, validate,                              requireRole('manager'), c.create)
router.get('/:id',      uuidParamRules, validate,                                requireRole('manager'), c.getOne)
router.put('/:id',      [...uuidParamRules, ...updateStaffRules], validate,      requireRole('manager'), c.update)
router.patch('/:id/pin', [...uuidParamRules, ...updatePinRules], validate,       requireRole('manager'), c.updatePin)
router.patch('/:id/deactivate', uuidParamRules, validate,                        requireRole('manager'), c.deactivate)
router.patch('/:id/activate',   uuidParamRules, validate,                        requireRole('manager'), c.activate)
router.get('/:id/transactions', [...uuidParamRules, ...dateRangeRules], validate, requireRole('manager'), c.getStaffTransactions)

module.exports = router
