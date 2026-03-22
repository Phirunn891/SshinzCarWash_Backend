# Car Wash Backend - Inventory Module

## Overview

This repository implements a backend service for Car Wash Management System.
This `README` focuses on inventory-related features and recent updates made in `Controller/inventory.controller.js` and `routes/inventory.routes.js`.

## Inventory Features Implemented

- Supplier management
  - Create supplier (`POST /suppliers`)
  - List suppliers with search + pagination (`GET /suppliers`)
  - Update supplier (`PUT /suppliers/:id`)
- Item management
  - Create inventory item (`POST /items`)
  - List inventory items with search + filter + pagination (`GET /items`)
  - Update inventory item (`PUT /items/:id`)
  - Get item stock history (`GET /items/:id/transactions`)
  - Get low stock alerts (`GET /items/alerts`)
- Purchase order management
  - List purchase orders (`GET /purchase-orders`)
  - Create purchase order (`POST /purchase-orders`)
  - Receive purchase order (`PATCH /purchase-orders/:id/receive`)
  - Cancel purchase order (`PATCH /purchase-orders/:id/cancel`) - new logic with status checks

## Recent inventory/controller updates

- Added pagination and search support to `getSuppliers`:
  - `GET /suppliers?search=abc&page=1&limit=10`
  - Returns `suppliers`, `total`, `page`, `limit`, `pages`
- Added pagination/search/filter support to `getItems`:
  - `GET /items?search=soap&filter=liter&page=1&limit=10`
  - Returns `items`, `total`, `page`, `limit`, `pages`
- Improved `cancelPurchaseOrder`:
  - Validates `pending` status before cancel
  - Sets `cancelled_at`
  - Saves record with `await`
  - Consistent response via `message` helper

## Validation + Middleware

- Route layer uses middleware from `Middleware/validate.js` and `Middleware/authMiddleware.js`:
  - `createSupplierRules`, `createItemRules`, `createPurchaseOrderRules`, `uuidParamRules`, `paginationRules`
  - `validate` middleware enforces rules before controller execution
  - `requireRole('manager')` protects write operations

## Notes

- Keep `createSupplierRules`/`createItemRules` in sync with controller field requirements.
- For production, consider moving more business validations to the model layer (e.g. Sequelize validators) and using consistent success response format.

## 📊 Reporting Module

The reporting system provides comprehensive business intelligence and analytics capabilities for the car wash management system. All reports are protected with manager-level authentication and provide real-time insights into business performance.

### Report Features Implemented

#### 📈 Daily Summary Report
- **Endpoint**: `GET /api/v1/reports/daily?date=YYYY-MM-DD`
- **Features**:
  - Transaction count and total revenue for the day
  - Average ticket value calculation
  - Top 5 services by revenue
  - Low stock alerts for inventory items
- **Use Case**: Daily business performance overview

#### 💰 Revenue Summary Report
- **Endpoint**: `GET /api/v1/reports/summary?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Features**:
  - Total transactions and revenue for date range
  - Average ticket calculation
  - Total discounts and points redeemed
  - Revenue breakdown by payment method
- **Use Case**: Period-based financial analysis

#### 🏆 Top Services Report
- **Endpoint**: `GET /api/v1/reports/top-services?from=YYYY-MM-DD&to=YYYY-MM-DD&limit=5`
- **Features**:
  - Services ranked by total revenue
  - Times sold and total quantity metrics
  - Vehicle type categorization
  - Configurable result limits
- **Use Case**: Service popularity and profitability analysis

#### 📦 Inventory Cost of Goods Sold (COGS)
- **Endpoint**: `GET /api/v1/reports/inventory-cogs?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Features**:
  - Total cost of inventory used in services
  - Item-wise cost breakdown
  - Cost per unit tracking
  - Period-based filtering
- **Use Case**: Inventory cost analysis and profitability tracking

#### 👑 Membership Statistics
- **Endpoint**: `GET /api/v1/reports/membership-stats`
- **Features**:
  - Active membership count
  - Monthly membership changes (new, expired)
  - Membership distribution by tier
  - Points liability calculation (converted to dollars)
- **Use Case**: Loyalty program performance and financial impact

#### 👷 Staff Performance Report
- **Endpoint**: `GET /api/v1/reports/staff-performance?from=YYYY-MM-DD&to=YYYY-MM-DD`
- **Features**:
  - Transaction count per staff member
  - Total sales and average ticket value
  - Performance ranking by revenue
  - Role-based filtering
- **Use Case**: Staff productivity and performance evaluation
