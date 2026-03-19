-- ============================================================
-- Car Wash Management System — MySQL Schema
-- Run this once to create all 15 tables
-- ============================================================

CREATE DATABASE IF NOT EXISTS carwash_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE carwash_db;

-- ----------------------------
-- STAFF
-- ----------------------------
CREATE TABLE staff (
  id         CHAR(36)     NOT NULL DEFAULT (UUID()),
  name       VARCHAR(100) NOT NULL,
  role       ENUM('washer','cashier','detailer','manager') NOT NULL,
  pin        VARCHAR(255) NOT NULL COMMENT 'bcrypt hashed',
  is_active  TINYINT(1)   NOT NULL DEFAULT 1,
  created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------
-- SERVICES
-- ----------------------------
CREATE TABLE services (
  id            CHAR(36)       NOT NULL DEFAULT (UUID()),
  name          VARCHAR(100)   NOT NULL,
  vehicle_type  ENUM('sedan','suv','truck','van','all') NOT NULL DEFAULT 'all',
  price         DECIMAL(10,2)  NOT NULL,
  duration_mins INT            NOT NULL DEFAULT 30,
  is_active     TINYINT(1)     NOT NULL DEFAULT 1,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------
-- MEMBERSHIPS
-- ----------------------------
CREATE TABLE memberships (
  id            CHAR(36)      NOT NULL DEFAULT (UUID()),
  name          VARCHAR(50)   NOT NULL,
  price         DECIMAL(10,2) NOT NULL,
  duration_days INT           NOT NULL,
  discount_pct  DECIMAL(5,2)  NOT NULL DEFAULT 0,
  free_washes   INT           NOT NULL DEFAULT 0,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------
-- CUSTOMERS
-- ----------------------------
CREATE TABLE customers (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  name           VARCHAR(100) NOT NULL,
  phone          VARCHAR(20)  NOT NULL,
  email          VARCHAR(100),
  vehicle_plate  VARCHAR(20),
  points_balance INT          NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_customer_phone (phone)
);

-- ----------------------------
-- CUSTOMER MEMBERSHIP
-- ----------------------------
CREATE TABLE customer_membership (
  id            CHAR(36)   NOT NULL DEFAULT (UUID()),
  customer_id   CHAR(36)   NOT NULL,
  membership_id CHAR(36)   NOT NULL,
  start_date    DATE       NOT NULL,
  end_date      DATE       NOT NULL,
  status        ENUM('pending','active','expired','cancelled') NOT NULL DEFAULT 'active',
  created_at    TIMESTAMP  NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_cm_customer (customer_id),
  KEY idx_cm_status   (status),
  FOREIGN KEY (customer_id)   REFERENCES customers(id),
  FOREIGN KEY (membership_id) REFERENCES memberships(id)
);

-- ----------------------------
-- TRANSACTIONS
-- ----------------------------
CREATE TABLE transactions (
  id              CHAR(36)      NOT NULL DEFAULT (UUID()),
  customer_id     CHAR(36),
  staff_id        CHAR(36)      NOT NULL,
  subtotal        DECIMAL(10,2) NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
  points_used     INT           NOT NULL DEFAULT 0,
  total           DECIMAL(10,2) NOT NULL,
  status          ENUM('pending','completed','voided','refunded') NOT NULL DEFAULT 'pending',
  note            TEXT,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_txn_customer   (customer_id),
  KEY idx_txn_staff      (staff_id),
  KEY idx_txn_created_at (created_at),
  KEY idx_txn_status     (status),
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (staff_id)    REFERENCES staff(id)
);

-- ----------------------------
-- TRANSACTION ITEMS
-- ----------------------------
CREATE TABLE transaction_items (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  transaction_id CHAR(36)      NOT NULL,
  service_id     CHAR(36)      NOT NULL,
  qty            INT           NOT NULL DEFAULT 1,
  unit_price     DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  KEY idx_ti_transaction (transaction_id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id),
  FOREIGN KEY (service_id)     REFERENCES services(id)
);

-- ----------------------------
-- PAYMENTS
-- ----------------------------
CREATE TABLE payments (
  id             CHAR(36)      NOT NULL DEFAULT (UUID()),
  transaction_id CHAR(36)      NOT NULL,
  method         ENUM('cash','card','qr','ewallet') NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  reference_no   VARCHAR(100),
  paid_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pay_transaction (transaction_id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- ----------------------------
-- POINTS LOG
-- ----------------------------
CREATE TABLE points_log (
  id             CHAR(36)  NOT NULL DEFAULT (UUID()),
  customer_id    CHAR(36)  NOT NULL,
  transaction_id CHAR(36),
  points_earned  INT       NOT NULL DEFAULT 0,
  points_used    INT       NOT NULL DEFAULT 0,
  balance_after  INT       NOT NULL,
  note           VARCHAR(255),
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_pl_customer    (customer_id),
  KEY idx_pl_transaction (transaction_id),
  FOREIGN KEY (customer_id)    REFERENCES customers(id),
  FOREIGN KEY (transaction_id) REFERENCES transactions(id)
);

-- ----------------------------
-- INVENTORY ITEMS
-- ----------------------------
CREATE TABLE inventory_items (
  id            CHAR(36)       NOT NULL DEFAULT (UUID()),
  name          VARCHAR(100)   NOT NULL,
  unit          VARCHAR(20)    NOT NULL,
  current_stock DECIMAL(10,3)  NOT NULL DEFAULT 0,
  reorder_level DECIMAL(10,3)  NOT NULL DEFAULT 0,
  cost_per_unit DECIMAL(10,2)  NOT NULL,
  created_at    TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------
-- SERVICE CONSUMPTION
-- ----------------------------
CREATE TABLE service_consumption (
  id              CHAR(36)      NOT NULL DEFAULT (UUID()),
  service_id      CHAR(36)      NOT NULL,
  item_id         CHAR(36)      NOT NULL,
  qty_per_service DECIMAL(10,3) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_sc_service_item (service_id, item_id),
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (item_id)    REFERENCES inventory_items(id)
);

-- ----------------------------
-- STOCK TRANSACTIONS
-- ----------------------------
CREATE TABLE stock_transactions (
  id           CHAR(36)      NOT NULL DEFAULT (UUID()),
  item_id      CHAR(36)      NOT NULL,
  type         ENUM('in','out') NOT NULL,
  qty          DECIMAL(10,3) NOT NULL,
  reference_id CHAR(36),
  note         TEXT,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_st_item       (item_id),
  KEY idx_st_created_at (created_at),
  FOREIGN KEY (item_id) REFERENCES inventory_items(id)
);

-- ----------------------------
-- SUPPLIERS
-- ----------------------------
CREATE TABLE suppliers (
  id             CHAR(36)     NOT NULL DEFAULT (UUID()),
  name           VARCHAR(100) NOT NULL,
  contact        VARCHAR(100),
  lead_time_days INT          NOT NULL DEFAULT 0,
  created_at     TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

-- ----------------------------
-- PURCHASE ORDERS
-- ----------------------------
CREATE TABLE purchase_orders (
  id          CHAR(36)  NOT NULL DEFAULT (UUID()),
  supplier_id CHAR(36)  NOT NULL,
  status      ENUM('pending','received','cancelled') NOT NULL DEFAULT 'pending',
  ordered_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  received_at TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_po_supplier (supplier_id),
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

-- ----------------------------
-- PURCHASE ORDER ITEMS
-- ----------------------------
CREATE TABLE purchase_order_items (
  id        CHAR(36)      NOT NULL DEFAULT (UUID()),
  po_id     CHAR(36)      NOT NULL,
  item_id   CHAR(36)      NOT NULL,
  qty       DECIMAL(10,3) NOT NULL,
  unit_cost DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (po_id)    REFERENCES purchase_orders(id),
  FOREIGN KEY (item_id)  REFERENCES inventory_items(id)
);
