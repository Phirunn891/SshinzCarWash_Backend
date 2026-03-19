const router = require('express').Router()
const { auth, requireRole } = require('../middleware/auth')
const { validate, membershipRules, uuidParamRules } = require('../middleware/validate')
const c = require('../controllers/memberships.controller')

router.use(auth)

router.get('/',                                                         c.getAll)
router.post('/',         membershipRules, validate,                     requireRole('manager'), c.create)
router.get('/:id',       uuidParamRules, validate,                      c.getOne)
router.put('/:id',       [...uuidParamRules, ...membershipRules], validate, requireRole('manager'), c.update)
router.delete('/:id',    uuidParamRules, validate,                      requireRole('manager'), c.remove)
router.get('/:id/subscribers', uuidParamRules, validate,                requireRole('manager'), c.getSubscribers)

module.exports = router
