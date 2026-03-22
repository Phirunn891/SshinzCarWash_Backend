require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
const { responseMiddleware } = require("./Middleware/response");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/auth.routes");
// Initialize database

const models = require("./Models/index");
const sequelize = require("./Config/db");
const PORT = process.env.port || 40001;
sequelize
  .sync()
  .then(() => {
    console.log("Database models synchronized");
    console.log(`Server Running On Port : ${PORT}`);
  })
  .catch((err) => {
    console.error("Failed to sync database models", err);
  });

var app = express();

app.use(cors());

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(responseMiddleware);
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);
// app.use("/users", usersRouter);
// app.use("/categories", categoriesRouter);

// customr routes
const customerRoutes = require("./routes/loyalty.routes");
const staffRoutes = require("./routes/staff.routes");
const serviceRoutes = require("./routes/services.routes");
const authRoutes = require("./routes/auth.routes");
const inventoryRoutes = require("./routes/inventory.routes");
const posRoutes = require("./routes/pos.routes");
const reportRoutes = require("./routes/reports.routes");
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/loyalty", customerRoutes);
app.use("/api/v1/staff", staffRoutes);
app.use("/api/v1/service", serviceRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
app.use("/api/v1/pos", posRoutes);
app.use("/api/v1/reports", reportRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
