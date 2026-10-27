import { config } from "../models/configModel.js";

// Utility for semantic version bump
const bumpVersion = (version, type = "minor") => {
  const parts = version.split(".").map(Number);
  if (type === "major") {
    parts[0] += 1;
    parts[1] = 0;
    parts[2] = 0;
  } else {
    parts[2] += 1;
  }
  return parts.join(".");
};

// 📦 Create a new config (per bucket)
export const createConfig = async (req, res) => {
  try {
    const { name, data, bumpType } = req.body;
    if (!name || !data) {
      return res.status(400).json({ message: "name and data are required" });
    }

    // Get latest config by name
    const latestConfig = await config.findOne({ name }).sort({ createdAt: -1 });

    let newVersion = "1.0.0";
    if (latestConfig) {
      newVersion = bumpVersion(latestConfig.version, bumpType || "minor");
    }

    const newConfig = await config.create({
      name,
      data,
      version: newVersion,
    });

    res.status(201).json({
      message: `New config created for bucket '${name}' ✅`,
      version: newVersion,
      config: newConfig,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📤 Get latest config by name
export const getLatestConfigByName = async (req, res) => {
  try {
    const { name } = req.params;
    const latestConfig = await config.findOne({ name }).sort({ createdAt: -1 });

    if (!latestConfig)
      return res.status(404).json({ message: `No config found for '${name}'` });

    res.json(latestConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔁 Update config (bump version)
export const updateConfigByName = async (req, res) => {
  try {
    const { name } = req.params;
    const { data, bumpType } = req.body;

    const latestConfig = await config.findOne({ name }).sort({ createdAt: -1 });
    if (!latestConfig)
      return res.status(404).json({ message: `No config found for '${name}'` });

    const newVersion = bumpVersion(latestConfig.version, bumpType || "minor");

    const updatedConfig = await config.create({
      name,
      data,
      version: newVersion,
    });

    res.status(200).json({
      message: `Config '${name}' updated successfully ✅`,
      version: newVersion,
      config: updatedConfig,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all configurations (latest version of each)
export const getAllConfigs = async (req, res) => {
  try {
    // Get all unique config names
    const configNames = await config.distinct('name');
    
    // Get the latest version of each config
    const latestConfigs = await Promise.all(
      configNames.map(async (name) => {
        return await config.findOne({ name }).sort({ createdAt: -1 });
      })
    );

    // Filter out any null results (shouldn't happen but just in case)
    const validConfigs = latestConfigs.filter(config => config !== null);

    res.json({
      count: validConfigs.length,
      configs: validConfigs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};