const Charges = require("../models/Charges");

// Upload a new charge (Admin only)
const uploadCharges = async (req, res, next) => {
  const { name } = req.body;

  if (!req.file) {
    return res.status(400).json({ error: "Please upload an image" });
  }

  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const image = req.file.filename;

    const newCharge = await Charges.create({ name, image });

    res.status(201).json({
      success: true,
      message: "Charge uploaded successfully",
      data: newCharge,
    });
  } catch (error) {
    next(error);
  }
};

// Get all charges (Publicly accessible)
const getAllCharges = async (req, res, next) => {
  try {
    const charges = await Charges.findAll();
    res.json({ success: true, data: charges });
  } catch (error) {
    next(error);
  }
};

// Update a charge (Admin only)
const updateCharge = async (req, res, next) => {
  const { id } = req.params;
  const { name } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const charge = await Charges.findByPk(id);

    if (!charge) {
      return res.status(404).json({ error: "Charge not found" });
    }

    // Update name if provided
    if (name) charge.name = name;

    // Update image if a new one is uploaded
    if (image) charge.image = image;

    await charge.save();

    res.json({
      success: true,
      message: "Charge updated successfully",
      data: charge,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a charge (Admin only)
const deleteCharge = async (req, res, next) => {
  const { id } = req.params;

  try {
    const charge = await Charges.findByPk(id);

    if (!charge) {
      return res.status(404).json({ error: "Charge not found" });
    }

    await charge.destroy();

    res.json({
      success: true,
      message: "Charge deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadCharges,
  getAllCharges,
  updateCharge,
  deleteCharge,
};
