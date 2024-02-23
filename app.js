require("./config/DB.connection");
const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./middlewares/auth");
const employeeRouter = require("./routes/emaployee.route");
const businessRouter = require("./routes/business.route");
const shiftRouter = require("./routes/shifts.route");
const claimShiftsRouter = require("./routes/claim-shifts.route");
const messageRouter = require("./routes/contact.route");

// App Use Middlewares
app.use(express.json());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(
  cors({
    origin: `${process.env.CORS_URL}`,
  })
);

// All Routes
// Employee Route
app.use("/auth/employee", employeeRouter);
// Businee Route
app.use("/auth/business", businessRouter);
// Shift Route
app.use("/auth/shift", shiftRouter);
// Job Route
app.use("/auth/claim-shift", claimShiftsRouter);
// Message Route
app.use("/auth/message", messageRouter);
// Home Route
app.get("/", auth, (req, res) => {
  res.send("Home Route");
});
// Route not founf
app.use((req, res, next) => {
  res.send("Route Not Found");
  next();
});
// Server error
app.use((req, res, next, err) => {
  if (err) {
    return err;
  } else {
    res.send("Server Error");
  }
  next();
});

module.exports = app;
