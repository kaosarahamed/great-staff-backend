require("dotenv").config();
const BusinessModel = require("../models/business.model");
const EmployeeModel = require("../models/employee.model");
const BusinessOtpModels = require("../models/business-otp.model");
const bcrypt = require("bcrypt");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const jwt = require("jsonwebtoken");

// Get All business
async function getBusiness(req, res) {
  try {
    const data = await BusinessModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single business
async function getOneBusiness(req, res) {
  const id = req.params.id;
  const existBusiness = await BusinessModel.findOne({ _id: id });
  try {
    if (!existBusiness) {
      res.status(400).json({ message: "Business Not Found!" });
    } else {
      res.status(200).json(existBusiness);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Register business
async function register(req, res) {
  const { firstName, lastName, email, password, agreement } = req.body;
  const existBusiness = await BusinessModel.findOne({ email: email });
  const existEmployee = await EmployeeModel.findOne({ email: email });

  try {
    if (existBusiness || existEmployee) {
      return res.status(404).json({ message: "Email Already Exist" });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const newBusiness = new BusinessModel({
        firstname: firstName,
        lastname: lastName,
        email,
        agreement,
        password: hash,
      });
      const token = jwt.sign(
        { email: newBusiness.email, id: newBusiness._id },
        SECRET_KEY
      );
      await newBusiness.save();
      res.status(201).json({
        business: newBusiness,
        token: "Bearer " + token,
        message: "Registration Successful",
      });
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
}

// Login business
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const existBusiness = await BusinessModel.findOne({ email: email });
    if (!existBusiness) {
      return res.status(404).json({ message: "Business Not Found!" });
    }
    const matchpassword = await bcrypt.compare(
      password,
      existBusiness.password
    );
    if (!matchpassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { email: existBusiness.email, id: existBusiness._id },
      SECRET_KEY
    );
    res.status(200).json({
      business: existBusiness,
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
    const existBusiness = await BusinessModel.findOne({ email: email });
    if (existBusiness) {
      let otp = Math.floor(Math.random() * 10000 + 1);
      let otpData = new BusinessOtpModels({
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
          name: existBusiness?.email,
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
      res.status(400).json({ message: "Business Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// OTP Check
async function otpCheck(req, res) {
  try {
    const data = await BusinessOtpModels.findOne({ code: req.body.code });

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
    let business = await BusinessModel.findOne({ email });
    if (business) {
      bcrypt.hash(password, 10, async function (err, hash) {
        business.password = hash;
        await business.save();
        res.status(200).json({ message: "Password Changed" });
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update business
async function updateBusiness(req, res) {
  const { firstname, lastname, email, phone, Organization, description } =
    req.body;
  const id = req.params.id;
  const existBusiness = await BusinessModel.findOne({ _id: id });
  const file = req?.file?.originalname.split(" ").join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    if (existBusiness) {
      const updateBusiness = {
        firstname,
        lastname,
        email,
        phone,
        Organization,
        description,
        profile: `${basePath ? `${basePath}${file}` : "null"}`,
      };
      await BusinessModel.findByIdAndUpdate(id, updateBusiness, {
        new: true,
      });
      res
        .status(200)
        .json({ business: updateBusiness, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
}

// business password update
async function updateBusinessPassword(req, res) {
  const { password } = req.body;
  const id = req.params.id;
  const existBusiness = await BusinessModel.findOne({ _id: id });
  try {
    if (existBusiness) {
      bcrypt.hash(password, 10, async function (err, hash) {
        const updateBusiness = {
          password: hash,
        };
        await BusinessModel.findByIdAndUpdate(id, updateBusiness, {
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

// Delete business
async function deleteBusiness(req, res) {
  const id = req.params.id;
  let existBusiness = await BusinessModel.findOne({ _id: id });
  try {
    if (existBusiness) {
      await BusinessModel.findOneAndDelete(id);
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res.status(400).json({ message: "Business Does Not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Accoount Delete Failed!" });
  }
}

module.exports = {
  getBusiness,
  getOneBusiness,
  register,
  login,
  otpCheck,
  otpSend,
  changePassword,
  updateBusiness,
  updateBusinessPassword,
  deleteBusiness,
};
