const router = require('express').Router()
const { auth, requireRole } = require('../middleware/auth')
const c = require('../controllers/reports.controller')

router.use(auth, requireRole('manager'))

router.get('/summary',            c.getSummary)
router.get('/top-services',       c.getTopServices)
router.get('/inventory-cogs',     c.getInventoryCOGS)
router.get('/membership-stats',   c.getMembershipStats)
router.get('/staff-performance',  c.getStaffPerformance)
router.get('/daily',              c.getDailySummary)

module.exports = router
