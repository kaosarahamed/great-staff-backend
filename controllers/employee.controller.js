require("dotenv").config();
const EmployeeModel = require("../models/employee.model");
const BusinessModel = require("../models/business.model");
const EmployeeOtpModels = require("../models/employee-otp.model");
const bcrypt = require("bcrypt");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const jwt = require("jsonwebtoken");

// Get All Employees
async function getEmployee(req, res) {
  try {
    const data = await EmployeeModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single Employees
async function getOneEmployee(req, res) {
  const id = req.params.id;
  const existEmployee = await EmployeeModel.findOne({ _id: id });
  try {
    if (!existEmployee) {
      res.status(400).json({ message: "Employee Not Found" });
    } else {
      res.status(200).json(existEmployee);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Register Employees
async function register(req, res) {
  const { firstName, lastName, email, password, agreement } = req.body;
  const existEmployee = await EmployeeModel.findOne({ email: email });
  const existBusiness = await BusinessModel.findOne({ email: email });
  try {
    if (existEmployee || existBusiness) {
      return res.status(404).json({ message: "Email Already Exist" });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const newEmployee = new EmployeeModel({
        firstname: firstName,
        lastname: lastName,
        email,
        agreement,
        password: hash,
      });
      const token = jwt.sign(
        { email: newEmployee.email, id: newEmployee._id },
        SECRET_KEY
      );
      await newEmployee.save();
      res.status(201).json({
        employee: newEmployee,
        token: "Bearer " + token,
        message: "Registration Successful",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

// Login Employees
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const existEmployee = await EmployeeModel.findOne({ email: email });
    if (!existEmployee) {
      return res.status(404).json({ message: "Employee Not Found" });
    }
    const matchpassword = await bcrypt.compare(
      password,
      existEmployee.password
    );
    if (!matchpassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { email: existEmployee.email, id: existEmployee._id },
      SECRET_KEY
    );
    res.status(200).json({
      employee: existEmployee,
      token: token,
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Login Faild", error: error });
  }
}

// OTP Send
async function otpSend(req, res) {
  const { email } = req.body;
  try {
    const existEmployee = await EmployeeModel.findOne({ email: email });
    if (existEmployee) {
      let otp = Math.floor(Math.random() * 10000 + 1);
      let otpData = new EmployeeOtpModels({
        email,
        code: otp,
        expireIn: new Date().getTime() + 300 * 1000,
      });
      await otpData.save();

      let config = {
        service: "gmail",
        auth: {
          user: EMAIL,
          pass: PASSWORD,
        },
      };
      let transport = nodemailer.createTransport(config);
      let mailGenarator = new Mailgen({
        theme: "default",
        product: {
          name: "name",
          link: "https://name.com",
        },
      });
      let response = {
        body: {
          name: existEmployee?.email,
          intro: "Reset your password",
          table: {
            data: [
              {
                Message: `your otp is ${otp}`,
              },
            ],
          },
          outro: "Thank You",
        },
      };
      let mail = await mailGenarator.generate(response);
      let message = {
        from: EMAIL,
        to: req.body.email,
        subject: "Reset Password",
        html: mail,
      };
      transport.sendMail(message).then(() => {
        return res.status(200).json({ email: email, message: "OTP Send" });
      });
    } else {
      res.status(400).json({ message: "Employee Not Found" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// OTP Check
async function otpCheck(req, res) {
  try {
    const data = await EmployeeOtpModels.findOne({ code: req.body.code });

    if (data) {
      let currentTime = new Date().getTime();
      let diffrenceTime = data.expireIn - currentTime;
      if (diffrenceTime < 0) {
        res.status(500).json({ message: "Token Expired" });
      } else {
        res.status(200).json({ message: "OTP Matched" });
      }
    } else {
      res.status(500).json({ message: "OTP Does Not Match" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Change Password
async function changePassword(req, res) {
  const { email, password } = req.body;
  try {
    let emaployee = await EmployeeModel.findOne({ email });
    if (emaployee) {
      bcrypt.hash(password, 10, async function (err, hash) {
        emaployee.password = hash;
        await emaployee.save();
        res.status(200).json({ message: "Password Changed" });
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update Employees
async function updateEmployee(req, res) {
  const { firstname, lastname, phone, address, dateOfBirth, bio } = req.body;

  const id = req.params.id;
  const existEmployee = await EmployeeModel.findOne({ _id: id });
  const file = req?.file?.originalname.split(" ").join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    if (existEmployee) {
      const updateEmployee = {
        firstname,
        lastname,
        phone,
        address,
        dateOfBirth,
        bio,
        profile: `${basePath ? `${basePath}${file}` : "null"}`,
      };
      await EmployeeModel.findByIdAndUpdate(id, updateEmployee, {
        new: true,
      });
      res
        .status(200)
        .json({ emaployee: updateEmployee, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
}

// Employee password update
async function updateEmployeePassword(req, res) {
  const { password } = req.body;
  const id = req.params.id;
  const existEmployee = await EmployeeModel.findOne({ _id: id });
  try {
    if (existEmployee) {
      bcrypt.hash(password, 10, async function (err, hash) {
        const updateEmployee = {
          password: hash,
        };
        await EmployeeModel.findByIdAndUpdate(id, updateEmployee, {
          new: true,
        });
        res.status(200).json({ message: "Update Successful" });
      });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
}

// Delete Employees
async function deleteEmployee(req, res) {
  const id = req.params.id;
  let existEmployee = await EmployeeModel.findOne({ _id: id });
  try {
    if (existEmployee) {
      await EmployeeModel.findOneAndDelete(id);
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res.status(400).json({ message: "Employee Does Not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Accoount Delete Failed!" });
  }
}

// Update Employees tasks
async function updateEmployeeTasks(req, res) {
  const { totalHour, totalShiftComplete, totalCompensation } = req.body;
  const id = req.params.id;
  const existEmployee = await EmployeeModel.findOne({ _id: id });
  const existTotalHour = existEmployee?.totalHour
    ? Number(existEmployee?.totalHour) + totalHour
    : totalHour;
  const existTotalShiftComplete = existEmployee?.totalShiftComplete
    ? Number(existEmployee?.totalShiftComplete) + totalShiftComplete
    : totalShiftComplete;
  const existTotalCompensation = existEmployee?.totalCompensation
    ? Number(existEmployee?.totalCompensation) + totalCompensation
    : totalCompensation;

  try {
    if (existEmployee) {
      const updateEmployee = {
        totalHour: existTotalHour,
        totalShiftComplete: existTotalShiftComplete,
        totalCompensation: existTotalCompensation,
        currentCompensation: existEmployee?.totalCompensation,
      };
      await EmployeeModel.findByIdAndUpdate(id, updateEmployee, {
        new: true,
      });
      res
        .status(200)
        .json({ emaployee: updateEmployee, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
}

module.exports = {
  getEmployee,
  getOneEmployee,
  register,
  login,
  otpCheck,
  otpSend,
  changePassword,
  updateEmployee,
  updateEmployeePassword,
  deleteEmployee,
  updateEmployeeTasks,
};
