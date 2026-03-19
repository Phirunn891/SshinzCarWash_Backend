const router = require('express').Router()
const { auth, requireRole } = require('../middleware/auth')
const { validate, createServiceRules, consumptionRules, uuidParamRules } = require('../middleware/validate')
const c = require('../controllers/services.controller')

router.use(auth)

router.get('/',                                                       c.getAll)
router.post('/',           createServiceRules, validate,              requireRole('manager'), c.create)
router.get('/:id',         uuidParamRules, validate,                  c.getOne)
router.put('/:id',         [...uuidParamRules, ...createServiceRules], validate, requireRole('manager'), c.update)
router.patch('/:id/toggle', uuidParamRules, validate,                 requireRole('manager'), c.toggle)

router.get('/:id/consumption',                     uuidParamRules, validate, c.getConsumption)
router.post('/:id/consumption',                    [...uuidParamRules, ...consumptionRules], validate, requireRole('manager'), c.addConsumption)
router.put('/:id/consumption/:consumptionId',      [...uuidParamRules, ...consumptionRules], validate, requireRole('manager'), c.updateConsumption)
router.delete('/:id/consumption/:consumptionId',   uuidParamRules, validate, requireRole('manager'), c.deleteConsumption)

module.exports = router
