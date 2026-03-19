const success = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
  })
}

const created = (res, data) => success(res, data, 201)

const paginated = (res, rows, pagination) => {
  return res.status(200).json({
    success: true,
    data: rows,
    pagination,
  })
}

const message = (res, msg, status = 200) => {
  return res.status(status).json({
    success: true,
    message: msg,
  })
}

const error = (res, msg, status = 400) => {
  return res.status(status).json({
    success: false,
    message: msg,
  })
}

const notFound = (res, msg = 'Record not found') => error(res, msg, 404)

module.exports = { success, created, paginated, message, error, notFound }
