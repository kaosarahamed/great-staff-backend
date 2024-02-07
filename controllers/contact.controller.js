const ContactModel = require("../models/contact.model");
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

// Get All Messages
async function getMessages(req, res) {
  try {
    const data = await ContactModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single Messages
async function getSingleMessage(req, res) {
  const id = req.params.id;
  const existMessage = await ContactModel.findOne({ _id: id });
  try {
    if (!existMessage) {
      res.status(400).json({ message: "Message Not Found" });
    } else {
      res.status(200).json(existMessage);
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Create Messages
async function createMessage(req, res) {
  const { email, userName, messages } = req.body;
  try {
    const newMessage = new ContactModel({ email, userName, messages });
    let config = {
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    };
    console.log(email);
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
        name: userName,
        intro: `Message from ${userName}`,
        table: {
          data: [
            {
              Message: messages,
            },
          ],
        },
        outro: "Thank You",
      },
    };

    let mail = await mailGenarator.generate(response);
    let message = {
      from: EMAIL,
      to: email,
      subject: email,
      html: mail,
    };
    await newMessage.save();
    transport.sendMail(message).then(() => {
      return res.status(201).json({ newMessage, message: "Message Send" });
    });
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update Messages
async function updateMessages(req, res) {
  const id = req.params.id;
  const { email, userName, messages } = req.body;
  const existMessage = await ContactModel.findOne({ _id: id });
  try {
    const updateMessage = {
      email,
      userName,
      messages,
    };
    if (existMessage) {
      await ContactModel.findByIdAndUpdate(id, updateMessage, {
        new: true,
      });
      res.status(200).json({ updateMessage, message: "Update Successful" });
    } else {
      res.status(400).json({ message: "Message Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Delete Messages
async function deleteMessages(req, res) {
  const id = req.params.id;
  let existMessage = await ContactModel.findOne({ _id: id });
  try {
    if (existMessage) {
      await ContactModel.findOneAndDelete(id);
      res.status(200).json({ message: "Account Deleted" });
    } else {
      res.status(400).json({ message: "Message Does Not Exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Accoount Delete Failed!" });
  }
}

module.exports = {
  createMessage,
  getMessages,
  getSingleMessage,
  updateMessages,
  deleteMessages,
};
