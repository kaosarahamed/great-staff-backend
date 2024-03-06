const ShiftModel = require("../models/shift.model");

// Get All Shifts
async function getAllShifts(req, res) {
  try {
    const data = await ShiftModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single Shifts
async function getOneShift(req, res) {
  const id = req.params.id;
  const existShift = await ShiftModel.findOne({ _id: id });
  try {
    if (existShift) {
      res.status(200).json(existShift);
    } else {
      res.status(400).json({ message: "Shift Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Create Shifts
async function createShifts(req, res) {
  const {
    title,
    startDate,
    startTime,
    urgency,
    address,
    country,
    state,
    length,
    description,
    creatorId,
    bonus,
    compensation,
    requirements,
    status,
  } = req.body;

  try {
    const newShift = new ShiftModel({
      title,
      startDate,
      startTime,
      urgency,
      location: { address, country, state },
      length,
      description,
      creatorId,
      bonus,
      compensation,
      requirements,
      status,
    });
    await newShift.save();
    res.status(201).json({ newShift, message: "Created Successful" });
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update Shifts
async function updateShifts(req, res) {
  const id = req.params.id;
  const {
    title,
    startDate,
    startTime,
    urgency,
    location,
    length,
    description,
    creatorId,
    bonus,
    compensation,
    requirements,
    status,
  } = req.body;
  const { address, country, state } = location;
  const existShift = await ShiftModel.findOne({ _id: id });
  try {
    if (existShift) {
      const updateShift = {
        title,
        startDate,
        startTime,
        urgency,
        location: { address, country, state },
        length,
        description,
        creatorId,
        bonus,
        compensation,
        requirements,
        status,
      };
      await ShiftModel.findByIdAndUpdate(id, updateShift, { new: true });
      res.status(200).json({ updateShift, message: "Update Successfull" });
    } else {
      res.status(400).json({ message: "Shift Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// update shift status
async function updateShiftStatus(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  const existShift = await ShiftModel.findOne({ _id: id });
  try {
    if (existShift) {
      const updateShift = { status };
      await ShiftModel.findByIdAndUpdate(id, updateShift, { new: true });
      res.status(200).json({ updateShift, message: `Shift ${status}` });
    } else {
      res.status(400).json({ message: "Shift Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Delete Shifts
async function deleteShifts(req, res) {
  const id = req.params.id;
  const existShift = await ShiftModel.findOne({ _id: id });

  try {
    if (existShift) {
      await ShiftModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Deleted Successful" });
    } else {
      res.status(400).json({ message: "Shift Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  getAllShifts,
  getOneShift,
  createShifts,
  updateShifts,
  deleteShifts,
  updateShiftStatus,
};
