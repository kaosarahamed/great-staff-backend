require("dotenv").config();
const BusinessModel = require("../models/business.model");
const EmployeeModel = require("../models/employee.model");
const ClientModel = require("../models/client.model");
const ClientOTPModel = require("../models/client-otp.model");
const bcrypt = require("bcrypt");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const SECRET_KEY = process.env.SECRET_KEY;
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const jwt = require("jsonwebtoken");

// Get All business
async function getClient(req, res) {
  try {
    const data = await ClientModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single business
async function getOneClient(req, res) {
  const id = req.params.id;
  const existClient = await ClientModel.findOne({ _id: id });
  try {
    if (!existClient) {
      res.status(400).json({ message: "Business Not Found!" });
    } else {
      res.status(200).json(existClient);
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
  const existClient = await ClientModel.findOne({ email: email });

  try {
    if (existClient || existEmployee || existBusiness) {
      return res.status(404).json({ message: "Email Already Exist" });
    }
    bcrypt.hash(password, 10, async function (err, hash) {
      const newClient = new ClientModel({
        firstname: firstName,
        lastname: lastName,
        email,
        agreement,
        password: hash,
      });
      const token = jwt.sign(
        { email: newClient.email, id: newClient._id },
        SECRET_KEY
      );
      await newClient.save();
      res.status(201).json({
        client: newClient,
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
    const existClient = await ClientModel.findOne({ email: email });
    if (!existClient) {
      return res.status(404).json({ message: "Client Not Found!" });
    }
    const matchpassword = await bcrypt.compare(password, existClient.password);
    if (!matchpassword) {
      return res.status(400).json({ message: "Incorrect Password" });
    }

    const token = jwt.sign(
      { email: existClient.email, id: existClient._id },
      SECRET_KEY
    );
    res.status(200).json({
      client: existClient,
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
    const existClient = await ClientModel.findOne({ email: email });
    if (existClient) {
      let otp = Math.floor(Math.random() * 10000 + 1);
      let otpData = new ClientOTPModel({
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
          name: existClient?.email,
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
      res.status(400).json({ message: "Client Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// OTP Check
async function otpCheck(req, res) {
  try {
    const data = await ClientOTPModel.findOne({ code: req.body.code });

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
    let client = await ClientModel.findOne({ email });
    if (client) {
      bcrypt.hash(password, 10, async function (err, hash) {
        client.password = hash;
        await client.save();
        res.status(200).json({ message: "Password Changed" });
      });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update business
async function updateClient(req, res) {
  const { firstname, lastname, email, phone, Organization, description, note } =
    req.body;
  const id = req.params.id;
  const existClient = await ClientModel.findOne({ _id: id });
  const file = req?.file?.originalname.split(" ").join("-");
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    if (existClient) {
      const updateClient = {
        firstname,
        lastname,
        email,
        phone,
        Organization,
        description,
        note,
        profile: `${basePath ? `${basePath}${file}` : "null"}`,
      };
      await ClientModel.findByIdAndUpdate(id, updateClient, {
        new: true,
      });
      res
        .status(200)
        .json({ client: updateClient, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed" });
  }
}

// business password update
async function updateClientPassword(req, res) {
  const { password } = req.body;
  const id = req.params.id;
  const existClient = await ClientModel.findOne({ _id: id });
  try {
    if (existClient) {
      bcrypt.hash(password, 10, async function (err, hash) {
        const updateBusiness = {
          password: hash,
        };
        await ClientModel.findByIdAndUpdate(id, updateBusiness, {
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
async function deleteClient(req, res) {
  const id = req.params.id;
  let existClient = await ClientModel.findOne({ _id: id });
  try {
    if (existClient) {
      await ClientModel.findOneAndDelete(id);
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res.status(400).json({ message: "Client Does Not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Accoount Delete Failed!" });
  }
}

module.exports = {
  getClient,
  getOneClient,
  register,
  login,
  otpCheck,
  otpSend,
  changePassword,
  updateClient,
  updateClientPassword,
  deleteClient,
};
