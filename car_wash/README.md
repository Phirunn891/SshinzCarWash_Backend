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
