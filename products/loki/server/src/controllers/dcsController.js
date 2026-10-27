import {DCS} from "../models/dcsModel.js";

// GET /api/dcs/:flagName?status=school_id
export const getFlagStatus = async (req, res) => {
  try {
    const { tenant: schoolId, flag: flagName } = req.query;

    const flag = await DCS.findOne({ name: flagName });

    if (!flag) return res.status(404).json({ message: "Flag not found" });

    const isActive = flag.associated_accounts.includes(schoolId);
    return res.json({ status: isActive });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/dcs  → Create or update flag
export const createOrUpdateFlag = async (req, res) => {
  try {
    const data = req.body;
    const existing = await DCS.findOne({ name: data.name });

    if (existing) {
      const updated = await DCS.findOneAndUpdate(
        { name: data.name },
        { ...data, updated_by: data.updated_by || "system" },
        { new: true }
      );
      return res.json({ message: "Flag updated successfully", flag: updated });
    }

    const flag = await DCS.create({
      ...data,
      created_by: data.created_by || "system",
    });
    res.status(201).json({ message: "Flag created successfully", flag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUT /api/dcs/map  → Map or update flag-account association
export const mapFlagToAccount = async (req, res) => {
  try {
    const { name, associated_accounts, status } = req.body;

    const flag = await DCS.findOne({ name });
    if (!flag) return res.status(404).json({ message: "Flag not found" });

    flag.associated_accounts = Array.isArray(associated_accounts)
      ? associated_accounts
      : [associated_accounts];
    flag.status = status;

    await flag.save();

    res.json({ message: "Flag-account mapping updated", flag });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};


// GET /api/dcs  → get all DCS flags
export const getAllFlags = async (req, res) => {
  try {
    const flags = await DCS.find().sort({ createdAt: -1 }); // latest first
    res.json({ count: flags.length, flags });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};
