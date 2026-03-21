const success = (res, data, status = 200) => {
  return res.status(status).json({
    success: true,
    data,
  });
};

const created = (res, data) => success(res, data, 201);

const paginated = (res, rows, pagination) => {
  return res.status(200).json({
    success: true,
    data: rows,
    pagination,
  });
};

const message = (res, msg, status = 200) => {
  return res.status(status).json({
    success: true,
    message: msg,
  });
};

const error = (res, msg, status = 400) => {
  return res.status(status).json({
    success: false,
    message: msg,
  });
};

const notFound = (res, msg = "Record not found") => error(res, msg, 404);

const responseMiddleware = (req, res, next) => {
  res.success = (data, status = 200) => success(res, data, status);
  res.created = (data) => created(res, data);
  res.paginated = (rows, pagination) => paginated(res, rows, pagination);
  res.message = (msg, status = 200) => message(res, msg, status);
  res.error = (msg, status = 400) => error(res, msg, status);
  res.notFound = (msg = "Record not found") => notFound(res, msg);
  next();
};

module.exports = {
  success,
  created,
  paginated,
  message,
  error,
  notFound,
  responseMiddleware,
};
