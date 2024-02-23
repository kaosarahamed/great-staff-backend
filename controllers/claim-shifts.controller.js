const ClaimShiftsModel = require("../models/claim-shifts.model");
const ShiftsModel = require("../models/shift.model");

// Get All claim shift
async function getAllClaimShifts(req, res) {
  try {
    const data = await ClaimShiftsModel.find();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single claim shift
async function getOneClaimShifts(req, res) {
  const id = req.params.id;
  const existClaimShifts = await ClaimShiftsModel.findOne({ _id: id });
  try {
    if (existClaimShifts) {
      res.status(200).json(existClaimShifts);
    } else {
      res.status(400).json({ message: "Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Get Single claim shift when claimed
async function getActiveOneClaimShifts(req, res) {
  const id = req.params.id;
  const existClaimShifts = await ClaimShiftsModel.findOne({ shiftId: id });
  try {
    if (existClaimShifts) {
      res.status(200).json(existClaimShifts);
    } else {
      res.status(400).json({ message: "Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Create claim shift
async function createClaimShifts(req, res) {
  const { data, employeeId, id } = req.body;
  const {
    title,
    startDate,
    startTime,
    urgency,
    location,
    length,
    description,
    bonus,
    compensation,
    requirements,
    _id,
  } = data;
  try {
    const updateShift = { status: "Active" };
    const existShift = await ShiftsModel.findOne({ _id: id });

    if (existShift) {
      await ShiftsModel.findByIdAndUpdate(id, updateShift, { new: true });
      const cliamShift = new ClaimShiftsModel({
        title,
        startDate,
        startTime,
        urgency,
        location,
        length,
        description,
        bonus,
        compensation,
        requirements,
        employeeId,
        status: "Active",
        shiftId: _id,
      });
      await cliamShift.save();
      res.status(201).json({ message: "Claimed Successful" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update claim shift
async function updateClaimShifts(req, res) {
  const id = req.params.id;
  const {
    startDate,
    startTime,
    length,
    urgency,
    compensation,
    bonuses,
    employeeID,
    notes,
  } = req.body;
  const existClaimShifts = await ClaimShiftsModel.findOne({ _id: id });
  try {
    if (existClaimShifts) {
      const updateShift = {
        startDate,
        startTime,
        postDate: new Date().getDate(),
        length,
        urgency,
        compensation,
        bonuses,
        employeeID,
        notes,
      };
      await ClaimShiftsModel.findByIdAndUpdate(id, updateShift, { new: true });
      res.status(200).json({ updateShift, message: "Update Successfull" });
    } else {
      res.status(400).json({ message: "Job Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update claim shift status in-progress
async function updateProgress(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  const existClaimShifts = await ClaimShiftsModel.findOne({ _id: id });
  try {
    if (existClaimShifts) {
      const updateShift = {
        status,
      };
      await ClaimShiftsModel.findByIdAndUpdate(id, updateShift, { new: true });
      res
        .status(200)
        .json({ updateShift, message: "Claim Successful, Shift in-progress" });
    } else {
      res.status(400).json({ message: "Job Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Update claim shift status complete
async function updateComplete(req, res) {
  const id = req.params.id;
  const { status } = req.body;
  const existClaimShifts = await ClaimShiftsModel.findOne({ _id: id });
  try {
    if (existClaimShifts) {
      const updateShift = {
        status,
      };
      await ClaimShiftsModel.findByIdAndUpdate(id, updateShift, { new: true });
      res.status(200).json({ updateShift, message: "Shift Complete" });
    } else {
      res.status(400).json({ message: "Job Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

// Delete claim shift
async function deleteClaimShifts(req, res) {
  const id = req.params.id;
  const existClaimShifts = await ClaimShiftsModel.findOne({ _id: id });

  try {
    if (existClaimShifts) {
      await ClaimShiftsModel.findByIdAndDelete(id);
      res.status(200).json({ message: "Deleted Successful" });
    } else {
      res.status(400).json({ message: "Job Not Found!" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
}

module.exports = {
  getAllClaimShifts,
  getOneClaimShifts,
  createClaimShifts,
  updateClaimShifts,
  deleteClaimShifts,
  updateProgress,
  updateComplete,
  getActiveOneClaimShifts,
};
