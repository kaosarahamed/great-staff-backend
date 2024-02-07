require("./config/DB.connection");
const express = require("express");
const app = express();
const cors = require("cors");
const auth = require("./middlewares/auth");
const employeeRouter = require("./routes/emaployee.route");
const shiftRouter = require("./routes/shifts.route");
const jobRouter = require("./routes/job.route");
const messageRouter = require("./routes/contact.route");

// App Use Middlewares
app.use(express.json());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(
  cors({
    origin: "http://localhost:2170",
  })
);

// All Routes
// Employee Route
app.use("/auth/employee", employeeRouter);
// Shift Route
app.use("/auth/shift", shiftRouter);
// Job Route
app.use("/auth/job", jobRouter);
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
