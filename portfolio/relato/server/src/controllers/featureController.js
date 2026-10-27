import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the config file
const configFilePath = path.join(__dirname, "../../config/fk-config.json");

// Get configuration data from file
export const getFeatures = async (req, res) => {
  try {
    // Check if config file exists
    if (!fs.existsSync(configFilePath)) {
      return res.status(404).json({
        message: "❌ Configuration file not found",
        error: "fk-config.json file does not exist"
      });
    }

    // Read and parse the config file
    const configData = fs.readFileSync(configFilePath, 'utf8');
    const config = JSON.parse(configData);

    res.json({
      message: "✅ Configuration retrieved successfully",
      data: config
    });
  } catch (error) {
    console.error("❌ Error reading configuration file:", error);
    res.status(500).json({ 
      message: "Error reading configuration file", 
      error: error.message 
    });
  }
};

// Update configuration data in file
export const updateFeatures = async (req, res) => {
  try {
    // Accept data directly from request body or from configData property
    const configData = req.body.configData || req.body;
    
    if (!configData || Object.keys(configData).length === 0) {
      return res.status(400).json({ 
        message: "Configuration data is required" 
      });
    }

    // Validate JSON structure
    JSON.stringify(configData);

    // Read current configuration
    let currentConfig = {};
    if (fs.existsSync(configFilePath)) {
      const currentData = fs.readFileSync(configFilePath, 'utf8');
      currentConfig = JSON.parse(currentData);
    }

    // Merge new data with existing configuration
    const mergedConfig = { ...currentConfig, ...configData };

    // Write updated config to file
    fs.writeFileSync(configFilePath, JSON.stringify(mergedConfig, null, 2));

    res.json({
      message: "✅ Configuration updated successfully",
      data: mergedConfig
    });
  } catch (error) {
    console.error("❌ Error updating configuration file:", error);
    res.status(500).json({ 
      message: "Error updating configuration file", 
      error: error.message 
    });
  }
};

// Get specific configuration section
export const getFeaturesSection = async (req, res) => {
  try {
    const { section } = req.params;
    
    // Check if config file exists
    if (!fs.existsSync(configFilePath)) {
      return res.status(404).json({
        message: "❌ Configuration file not found",
        error: "fk-config.json file does not exist"
      });
    }

    // Read and parse the config file
    const configData = fs.readFileSync(configFilePath, 'utf8');
    const config = JSON.parse(configData);

    // Check if section exists
    if (!config[section]) {
      return res.status(404).json({
        message: `❌ Configuration section '${section}' not found`,
        availableSections: Object.keys(config)
      });
    }

    res.json({
      message: `✅ Configuration section '${section}' retrieved successfully`,
      section: section,
      data: config[section]
    });
  } catch (error) {
    console.error("❌ Error reading configuration section:", error);
    res.status(500).json({ 
      message: "Error reading configuration section", 
      error: error.message 
    });
  }
};
