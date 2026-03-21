const router = require("express").Router();
const { auth, requireRole } = require("../Middleware/authMiddleware");
const {
  validate,
  createStaffRules,
  updateStaffRules,
  updatePinRules,
  uuidParamRules,
  dateRangeRules,
} = require("../Middleware/validate");
const c = require("../Controller/staff.controller");

// router.use(auth);

router.get("/", c.getAll);
router.post("/", createStaffRules, c.create);
router.get("/:id", uuidParamRules, validate, requireRole("manager"), c.getOne);
router.put(
  "/:id",
  [...uuidParamRules, ...updateStaffRules],
  validate,
  requireRole("manager"),
  c.update,
);
router.patch(
  "/:id/pin",
  [...uuidParamRules, ...updatePinRules],
  validate,
  requireRole("manager"),
  c.updatePin,
);
router.patch(
  "/:id/deactivate",
  uuidParamRules,
  validate,
  requireRole("manager"),
  c.deactivate,
);
router.patch(
  "/:id/activate",
  uuidParamRules,
  validate,
  requireRole("manager"),
  c.activate,
);
router.get(
  "/:id/transactions",
  [...uuidParamRules, ...dateRangeRules],
  validate,
  requireRole("manager"),
  c.getStaffTransactions,
);

module.exports = router;
