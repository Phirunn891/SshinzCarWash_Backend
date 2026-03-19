// seed.js — Run once to populate your database with test data
// Usage: node seed.js

require('dotenv').config()
const mysql  = require('mysql2/promise')
const bcrypt = require('bcryptjs')

const db = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  port:     process.env.DB_PORT     || 3306,
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'carwash_db',
  waitForConnections: true,
})

const uuid = () => require('crypto').randomUUID()

async function seed () {
  console.log('Seeding database...\n')

  // -----------------------------------------------
  // STAFF (PIN: 1111=manager, 2222=cashier, 3333=washer, 4444=detailer)
  // -----------------------------------------------
  const staffData = [
    { id: uuid(), name: 'Nina Cruz',    role: 'manager',  pin: '1111' },
    { id: uuid(), name: 'Siti Rahma',   role: 'cashier',  pin: '2222' },
    { id: uuid(), name: 'Ali Hassan',   role: 'washer',   pin: '3333' },
    { id: uuid(), name: 'James Wong',   role: 'detailer', pin: '4444' },
  ]
  for (const s of staffData) {
    s.pin = await bcrypt.hash(s.pin, 10)
    await db.query(
      `INSERT IGNORE INTO staff (id, name, role, pin) VALUES (?, ?, ?, ?)`,
      [s.id, s.name, s.role, s.pin],
    )
  }
  console.log(`✓ ${staffData.length} staff seeded`)
  console.log('  PINs: Nina=1111 | Siti=2222 | Ali=3333 | James=4444\n')

  // -----------------------------------------------
  // MEMBERSHIPS
  // -----------------------------------------------
  const membershipIds = { silver: uuid(), gold: uuid(), platinum: uuid() }
  const memberships = [
    [membershipIds.silver,   'Silver',   9.99,  30,  10, 0],
    [membershipIds.gold,     'Gold',    19.99,  30,  20, 1],
    [membershipIds.platinum, 'Platinum', 39.99, 30,  30, 3],
  ]
  for (const [id, name, price, duration_days, discount_pct, free_washes] of memberships) {
    await db.query(
      `INSERT IGNORE INTO memberships (id, name, price, duration_days, discount_pct, free_washes)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, price, duration_days, discount_pct, free_washes],
    )
  }
  console.log(`✓ ${memberships.length} membership plans seeded\n`)

  // -----------------------------------------------
  // INVENTORY ITEMS
  // -----------------------------------------------
  const itemIds = {
    shampoo:    uuid(),
    wax:        uuid(),
    tireshine:  uuid(),
    degreaser:  uuid(),
    cloth:      uuid(),
    airfresh:   uuid(),
  }
  const items = [
    [itemIds.shampoo,   'Shampoo Foam',      'L',   10.0, 2.0,  15.00],
    [itemIds.wax,       'Carnauba Wax',      'kg',   5.0, 1.5,  45.00],
    [itemIds.tireshine, 'Tire Shine',        'L',    4.0, 1.0,  20.00],
    [itemIds.degreaser, 'Engine Degreaser',  'L',    8.0, 2.0,  18.00],
    [itemIds.cloth,     'Microfiber Cloth',  'pcs', 50.0, 20.0,  2.50],
    [itemIds.airfresh,  'Air Freshener',     'pcs', 30.0, 10.0,  1.50],
  ]
  for (const [id, name, unit, current_stock, reorder_level, cost_per_unit] of items) {
    await db.query(
      `INSERT IGNORE INTO inventory_items (id, name, unit, current_stock, reorder_level, cost_per_unit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, unit, current_stock, reorder_level, cost_per_unit],
    )
  }
  console.log(`✓ ${items.length} inventory items seeded\n`)

  // -----------------------------------------------
  // SERVICES
  // -----------------------------------------------
  const serviceIds = {
    basicWash:    uuid(),
    fullWashWax:  uuid(),
    interiorDetail: uuid(),
    engineClean:  uuid(),
    tireOnly:     uuid(),
  }
  const services = [
    [serviceIds.basicWash,      'Basic Wash',        'all',   20.00, 20],
    [serviceIds.fullWashWax,    'Full Wash + Wax',   'all',   35.00, 45],
    [serviceIds.interiorDetail, 'Interior Detail',   'all',   40.00, 60],
    [serviceIds.engineClean,    'Engine Clean',      'all',   42.00, 40],
    [serviceIds.tireOnly,       'Tire Shine Only',   'all',   12.00, 15],
  ]
  for (const [id, name, vehicle_type, price, duration_mins] of services) {
    await db.query(
      `INSERT IGNORE INTO services (id, name, vehicle_type, price, duration_mins)
       VALUES (?, ?, ?, ?, ?)`,
      [id, name, vehicle_type, price, duration_mins],
    )
  }
  console.log(`✓ ${services.length} services seeded\n`)

  // -----------------------------------------------
  // SERVICE CONSUMPTION RULES
  // (which chemicals each service uses)
  // -----------------------------------------------
  const consumptionRules = [
    // Basic Wash: 0.2L shampoo
    [serviceIds.basicWash,      itemIds.shampoo,   0.200],
    [serviceIds.basicWash,      itemIds.cloth,     1.000],
    // Full Wash + Wax: 0.3L shampoo, 0.1kg wax, 0.1L tire shine
    [serviceIds.fullWashWax,    itemIds.shampoo,   0.300],
    [serviceIds.fullWashWax,    itemIds.wax,       0.100],
    [serviceIds.fullWashWax,    itemIds.tireshine, 0.100],
    [serviceIds.fullWashWax,    itemIds.cloth,     2.000],
    // Interior Detail: 0.1L shampoo, 2 cloths, 1 air freshener
    [serviceIds.interiorDetail, itemIds.shampoo,   0.100],
    [serviceIds.interiorDetail, itemIds.cloth,     2.000],
    [serviceIds.interiorDetail, itemIds.airfresh,  1.000],
    // Engine Clean: 0.5L degreaser
    [serviceIds.engineClean,    itemIds.degreaser, 0.500],
    // Tire Shine Only: 0.2L tire shine
    [serviceIds.tireOnly,       itemIds.tireshine, 0.200],
  ]
  for (const [service_id, item_id, qty_per_service] of consumptionRules) {
    await db.query(
      `INSERT IGNORE INTO service_consumption (id, service_id, item_id, qty_per_service)
       VALUES (UUID(), ?, ?, ?)`,
      [service_id, item_id, qty_per_service],
    )
  }
  console.log(`✓ ${consumptionRules.length} service consumption rules seeded\n`)

  // -----------------------------------------------
  // SUPPLIERS
  // -----------------------------------------------
  const supplierIds = { cleanpro: uuid(), autosupply: uuid() }
  await db.query(
    `INSERT IGNORE INTO suppliers (id, name, contact, lead_time_days)
     VALUES (?, 'CleanPro Supplies', 'cleanpro@example.com', 3),
            (?, 'Auto Supply Co.',   'autosupply@example.com', 5)`,
    [supplierIds.cleanpro, supplierIds.autosupply],
  )
  console.log(`✓ 2 suppliers seeded\n`)

  // -----------------------------------------------
  // CUSTOMERS
  // -----------------------------------------------
  const customerIds = {
    mary:  uuid(),
    john:  uuid(),
    lisa:  uuid(),
    kevin: uuid(),
  }
  const customers = [
    [customerIds.mary,  'Mary Santos', '012-345-6789', 'mary@example.com',  'ABC1234', 1240],
    [customerIds.john,  'John Doe',    '019-111-2222', 'john@example.com',  'XYZ5678', 320],
    [customerIds.lisa,  'Lisa Tan',    '011-888-9999', 'lisa@example.com',  'DEF9012', 5600],
    [customerIds.kevin, 'Kevin Ng',    '016-777-3333', null,                'GHI3456', 80],
  ]
  for (const [id, name, phone, email, vehicle_plate, points_balance] of customers) {
    await db.query(
      `INSERT IGNORE INTO customers (id, name, phone, email, vehicle_plate, points_balance)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, name, phone, email, vehicle_plate, points_balance],
    )
  }
  console.log(`✓ ${customers.length} customers seeded\n`)

  // -----------------------------------------------
  // CUSTOMER MEMBERSHIPS
  // -----------------------------------------------
  const today      = new Date()
  const in30days   = new Date(today); in30days.setDate(today.getDate() + 30)
  const in7days    = new Date(today); in7days.setDate(today.getDate() + 7)
  const minus1day  = new Date(today); minus1day.setDate(today.getDate() - 1)
  const fmt = d => d.toISOString().split('T')[0]

  const memberships_assign = [
    [customerIds.mary,  membershipIds.gold,     fmt(today), fmt(in30days), 'active'],
    [customerIds.john,  membershipIds.silver,   fmt(today), fmt(in7days),  'active'],
    [customerIds.lisa,  membershipIds.platinum, fmt(today), fmt(in30days), 'active'],
    [customerIds.kevin, membershipIds.silver,   fmt(today), fmt(minus1day),'expired'],
  ]
  for (const [customer_id, membership_id, start_date, end_date, status] of memberships_assign) {
    await db.query(
      `INSERT IGNORE INTO customer_membership (id, customer_id, membership_id, start_date, end_date, status)
       VALUES (UUID(), ?, ?, ?, ?, ?)`,
      [customer_id, membership_id, start_date, end_date, status],
    )
  }
  console.log(`✓ ${memberships_assign.length} customer memberships seeded\n`)

  await db.end()
  console.log('Seed complete!\n')
  console.log('You can now login with:')
  console.log('  POST /api/auth/login  { "pin": "1111" }  → manager (Nina Cruz)')
  console.log('  POST /api/auth/login  { "pin": "2222" }  → cashier (Siti Rahma)')
}

seed().catch(err => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
