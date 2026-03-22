const { Op, AsyncQueueError } = require("sequelize");
const Sevice = require("../Models/service.model");
const Customer = require("../Models/customer.model");
const CustomerMemberhsip = require("../Models/customerMembership.model");
const Membership = require("../Models/membership.model");
const { success, message } = require("../Middleware/response");
const Transaction = require("../Models/transaction.model");
const Staff = require("../Models/staff.model");
const Payment = require("../Models/payment.model");
const PointsLog = require("../Models/pointsLog.model");
const {
  TransactionItem,
  sequelize,
  InventoryItem,
  StockTransaction,
} = require("../Models");
const Service = require("../Models/service.model");
const ServiceConsumption = require("../Models/serviceConsumption.model");
// getService
// GET /api/pos/services
const getService = async (req, resizeBy, next) => {
  try {
    // getService
    const service = await Sevice.findAll({
      where: {
        is_active: true,
      },
      order: [["name", "ASC"]],
    });
    if (!service) {
      return resizeBy.status(404).json({
        success: false,
        message: "No Services Found!!",
        data: service,
      });
    }
    resizeBy.status(200).json({
      success: true,
      message: "Service Have",
    });
  } catch (error) {
    next(error);
  }
};
// getCustomer
// GET /api/pos/customers/search?q=
const getCustomer = async (req, resizeBy, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return resizeBy.status(400).json({
        success: false,
        message: "Query Was Requiere",
      });
    }
    const customers = await Customer.findOne({
      where: {
        [Op.or]: [
          {
            phone: q,
          },
          {
            vehicle_plate: q,
          },
        ],
      },
      include: [
        {
          model: CustomerMemberhsip,
          as: "membership",
          where: {
            status: "active",
          },
          required: false,
          include: [
            {
              model: Membership,
              as: "plan",
            },
          ],
        },
      ],
    });
    if (!customers) {
      return resizeBy.status(404).json({
        success: false,
        message: "Customer Not Founded",
      });
    }
    resizeBy.status(200).json({
      success: true,
      message: "Customer Fectech",
      data: customers,
    });
  } catch (error) {
    next(error);
  }
};
// getTransaction
// GET /api/pos/transactions
const getTransaction = async (req, resizeBy, next) => {
  try {
    const {
      date,
      from,
      to,
      status,
      customer_id,
      page = 1,
      limit = 20,
    } = req.query;
    const where = {};

    if (date) {
      where.created_at = {
        [Op.between]: [`${date} 00:00:00`, `${date} 23:59:59`],
      };
    } else if (from && to) {
      where.created_at = {
        [Op.between]: [`${from} 00:00:00`, `${to} 23:59:59`],
      };
    }
    if (status) where.status = status;

    if (customer_id) where.customer_id = customer_id;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Transaction.findAndCountAll({
      where,
      include: [
        {
          model: Customer,
          as: "customer",
          attributes: ["name", "phone"],
          required: false,
        },
        {
          model: Staff,
          as: "staff",
          attributes: ["name"],
        },
        {
          model: Payment,
          as: "payments",
          attributes: ["method", "amount"],
        },
      ],
      order: [["created_at", "DESC"]],
      limit: parseInt(limit),
      offset,
      distinct: true,
    });
    resizeBy.status(200).json({
      success: true,
      message: "Payment Succes",
      data: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};
// getTransactionDetail
// GET /api/pos/transactions/:id
const getTransactionDetail = async (req, res, next) => {
  try {
    const transactionFind = await Transaction.findByPk(req.params.id, {
      include: [
        {
          model: Customer,
          as: "Customer",
          attributes: ["id", "name", "phone"],
        },
        {
          model: Staff,
          as: "Staff",
          attributes: ["id", "name", "role"],
        },
        {
          model: TransactionItem,
          as: "items",
          include: [
            {
              model: Service,
              as: "Sevice",
              attributes: ["name", "vehicle_type"],
            },
          ],
        },
        {
          model: Payment,
          as: "Payments",
        },
      ],
    });
    if (!transactionFind) {
      return res.status(404).json({
        success: false,
        message: "Transaction not Found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Transaction Founded",
      data: transactionFind,
    });
  } catch (error) {
    next(error);
  }
};
//  checkout
// POST /api/pos/checkout
const checkout = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { customer_id, itmes, payment_method, points_used = 0 } = req.body;
    const staff_id = req.staff.id;
    // 1 Validaiton & Fetch Services
    const servieIds = itmes.map((i) => i.service_id);
    const services = await Service.findAll({
      where: {
        id: {
          [Op.in]: servieIds,
        },
        is_active: true,
      },
      transaction: t,
    });
    if (services.length !== servieIds.length) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "One or more service are invalid or inactive",
      });
    }

    const svcMap = Object.fromEntries(services.map((s) => [s.id, s]));
    // 2 Subtotal
    let subtotal = 0;
    for (const item of itmes)
      subtotal += parseFloat(svcMap[item.service_id].price) * item.qty;
    subtotal = parseFloat(subtotal.toFixed(2));

    // 3 Membership discount
    let discount_amount = 0;
    if (customer_id) {
      const mem = await CustomerMemberhsip.findOne({
        where: {
          customer_id,
          status: "active",
          end_date: {
            [Op.gte]: new Date(),
          },
        },
        include: [
          {
            model: Membership,
            as: "plan",
          },
        ],
        transaction: t,
      });
      if (mem)
        discount_amount = parseFloat(
          ((mem.plan.discount_pct / 100) * subtotal).toFixed(2),
        );
    }

    // 4. Validate points redemption
    let points_discount = 0;
    if (points_discount > o) {
      if (!customer_id) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: "customer_id required to redeem points",
        });
      }
      const customer = await Customer.findByPk(customer_id, { transaction: t });
      if (!customer) {
        return res.status(404).json({
          success: false,
          message: "Customer not Found",
        });
      }
      if (points_discount > customer.points_balance) {
        await t.rollback();
        return res.status(400).json({
          success: false,
          message: `Insufficient points. Available: ${customer.points_balance}`,
        });
      }
      points_discount = parseFloat((points_used / 100).toFixed(2));
    }
    const total = parseFloat(
      (subtotal - discount_amount - points_discount).toFixed(2),
    );
    // 5. Create transaction
    const txn = await Transaction.create(
      {
        customer_id: customer_id || null,
        staff_id,
        subtotal,
        discount_amount,
        points_used,
        total,
        status: "completed",
      },
      {
        transaction: t,
      },
    );
    // 6. Transaction items
    await TransactionItem.bulkCreate(
      itmes.map((item) => ({
        transaction_id: txn.id,
        service_id: item.service_id,
        qty: item.qty,
        unit_price: svcMap[item.service_id].price,
      })),
      {
        transaction: t,
      },
    );

    // 7. Payment
    await Payment.create(
      {
        transaction_id: txn.id,
        method: payment_method,
        amount: total,
      },
      {
        transaction: t,
      },
    );
    // 8. Auto-deduct inventory per service_consumption
    for (const item of itmes) {
      const rules = await ServiceConsumption.findAll({
        where: {
          service_id: item.service_id,
        },
        transaction: t,
      });
      for (const rule of rules) {
        const deductQty = parseFloat(rule.qty_per_service) * item.qty;
        await InventoryItem.decrement("current_stock", {
          by: deductQty,
          where: {
            id: rule.item_id,
          },
          transaction: t,
        });
        await StockTransaction.create(
          {
            item_id: rule.item_id,
            type: "out",
            qty: deductQty,
            reference_id: txn.id,
          },
          {
            transaction: t,
          },
        );
      }
    }
    // 9. Points — earn & deduct
    if (customer_id) {
      const earned = Math.floor(total);
      const netDelta = earned - points_used;
      await Customer.increment("points_balance", {
        by: netDelta,
        where: {
          id: customer_id,
        },
        transaction: t,
      });
      const refreshed = await Customer.findByPk(customer_id, {
        transaction: t,
      });
      await PointsLog.create(
        {
          customer_id,
          transaction_id: txn.id,
          points_earned: earned,
          points_used,
          balance_after: refreshed.points_balance,
        },
        {
          transaction: t,
        },
      );
    }
    await t.commit();
    res.status(201).json({
      success: true,
      data: {
        message: "Checkout successful",
        transaction_id: txn.id,
        subtotal,
        discount_amount,
        points_discount,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};
// voidTransaction
// POST /api/pos/transactions/:id/void
const voidTransaction = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const txn = await Transaction.findOne({
      where: {
        if: req.params.id,
        status: "completed",
      },
      include: [
        {
          model: TransactionItem,
          as: "itmes",
        },
      ],
      transaction: t,
    });
    if (!txn) {
      return res.status(404).json({
        success: false,
        message: "Transaction Not found or Already voided",
      });
    }
    // Reverse inventory
    for (const item of txn.items) {
      const rules = await ServiceConsumption.findAll({
        where: {
          service_id: item.service_id,
        },
        transaction: t,
      });
      for (const rule of rules) {
        const restockQty = parseFloat(rule.qty_per_service) * item.qty;
        await InventoryItem.increment("current_stock", {
          by: restockQty,
          where: {
            id: rule.item_id,
          },
          transaction: t,
        });
        await StockTransaction.create(
          {
            item_id: rule.item_id,
            type: "in",
            qty: restockQty,
            reference_id: txn.id,
            note: "void restock",
          },
          {
            transaction: t,
          },
        );
      }
    }
    // Reverse points
    if (txn.customer_id) {
      const earned = Math.floor(txn.total);
      const netDelta = txn.points_used - earned;
      await Customer.increment("points_balance", {
        by: netDelta,
        where: {
          id: txn.customer_id,
        },
        transaction: t,
      });
      const refreshed = await Customer.findByPk(txn.customer_id, {
        transaction: t,
      });
      await PointsLog.create(
        {
          customer_id: txn.customer_id,
          transaction_id: txn.id,
          points_earned: 0,
          points_used: earned,
          balance_after: refreshed.points_balance,
          note: "void reversal",
        },
        {
          transaction: t,
        },
      );
    }

    await txn.update(
      {
        status: "voided",
      },
      { transaction: t },
    );
    await t.commit();
    res.json({
      success: true,
      data: {
        message: "Transaction voided successfully",
      },
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getService,
  getCustomer,
  getTransaction,
  getTransactionDetail,
  checkout,
  voidTransaction,
};
