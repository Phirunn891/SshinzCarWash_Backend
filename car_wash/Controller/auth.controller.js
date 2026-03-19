const { Staff } = require('../models')
const bcrypt    = require('bcryptjs')
const jwt       = require('jsonwebtoken')

const login = async (req, res, next) => {
  try {
    const { pin } = req.body
    const allStaff = await Staff.findAll({ where: { is_active: true } })

    let matched = null
    for (const s of allStaff) {
      if (await bcrypt.compare(String(pin), s.pin)) { matched = s; break }
    }
    if (!matched) return res.status(401).json({ success: false, message: 'Invalid PIN' })

    const token = jwt.sign(
      { id: matched.id, name: matched.name, role: matched.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    )
    res.json({ success: true, data: { token, staff: { id: matched.id, name: matched.name, role: matched.role } } })
  } catch (err) { next(err) }
}

module.exports = { login }
