const router = require("express").Router();
const { auth, requireRole } = require("../Middleware/authMiddleware");
const {
  validate,
  checkoutRules,
  uuidParamRules,
  paginationRules,
  dateRangeRules,
} = require("../Middleware/validate");
const c = require("../Controller/pos.controller");

router.use(auth);

router.get("/services", c.getService);
router.get("/customers/search", c.getCustomer);
router.get(
  "/transactions",
  [...paginationRules, ...dateRangeRules],
  validate,
  c.getTransaction,
);
router.get(
  "/transactions/:id",
  uuidParamRules,
  validate,
  c.getTransactionDetail,
);
router.post("/checkout", checkoutRules, validate, c.checkout);
router.post(
  "/transactions/:id/void",
  uuidParamRules,
  validate,
  requireRole("manager"),
  c.voidTransaction,
);

module.exports = router;
