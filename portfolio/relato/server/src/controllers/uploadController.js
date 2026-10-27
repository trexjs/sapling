import XLSX from "xlsx";
import fs from "fs";
import { Student } from "../models/studentModel.js";
import { parseExcelSheet } from "../utils/excelParser.js";

const CSIDENTIFIER = {
  "1A": "1A",
  "1B": "1B",
  "1C": "1C",
  "1D": "1D",
  "2A": "2A",
  "2B": "2B",
  "2C": "2C",
  "2D": "2D",
};

export const handleExcelUpload = async (req, res) => {
  try {
    // Debug: Log request details
    console.log("📁 Upload request received");
    console.log("📋 Request body:", req.body);
    console.log("📁 Request file:", req.file);
    console.log("📁 Request files:", req.files);

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        message: "No file uploaded. Please make sure to upload a file with the field name 'file'." 
      });
    }

    console.log("✅ File uploaded successfully:", req.file.originalname);
    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const allData = [];

    for (const sheetName of workbook.SheetNames) {
      console.log(`📊 Processing sheet: ${sheetName}`);
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log(`📋 Raw data from ${sheetName} (${jsonData.length} rows):`, jsonData.slice(0, 5)); // Show first 5 rows
      
      // Log the structure of the first few rows to understand the format
      if (jsonData.length >= 2) {
        console.log(`🔍 Row 1 (Group Row):`, jsonData[0]);
        console.log(`🔍 Row 2 (Field Row):`, jsonData[1]);
        if (jsonData.length >= 3) {
          console.log(`🔍 Row 3 (Data Row):`, jsonData[2]);
        }
      }
      
      // Log metadata rows that will be filtered out
      const metadataRows = jsonData.filter(row => 
        row && row.some(cell => cell && typeof cell === 'object' && cell.meta)
      );
      if (metadataRows.length > 0) {
        console.log(`🚫 Filtering out ${metadataRows.length} metadata rows:`, metadataRows);
      }
      
      const parsed = parseExcelSheet(jsonData);
      console.log(`✅ Parsed data from ${sheetName} (${parsed.length} valid records):`, parsed.slice(0, 2)); // Show first 2 parsed records
      allData.push(...parsed);
    }

    console.log(`📊 Total records to be saved: ${allData.length}`);
    console.log(`📋 Sample record structure:`, allData[0] ? JSON.stringify(allData[0], null, 2) : "No data");

    if (allData.length > 0) {
      const result = await Student.insertMany(allData);
      console.log(`✅ Successfully saved ${result.length} records to database`);
    }

    fs.unlinkSync(filePath);
    res.json({
      success: true,
      message: "✅ Data appended successfully",
      count: allData.length,
    });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error processing file", 
      error 
    });
  }
};

export const getStudentData = async (req, res) => {
  try {
    // Get all students from database
    const allStudents = await Student.find({}).sort({ _id: -1 });

    // Filter out empty records - only keep records with actual data
    const validStudents = allStudents.filter(student => {
      // Check if the student record has meaningful data
      const hasData = Object.keys(student.toObject()).some(key => {
        if (key === '_id' || key === '__v') return false; // Skip MongoDB internal fields
        
        const value = student[key];
        
        // If it's a nested object (like meta, profile, guardian_details, etc.)
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return Object.values(value).some(nestedValue => 
            nestedValue !== null && 
            nestedValue !== undefined && 
            nestedValue !== "" &&
            nestedValue.toString().trim() !== ""
          );
        }
        
        // If it's a direct field
        return value !== null && 
               value !== undefined && 
               value !== "" &&
               value.toString().trim() !== "";
      });
      
      return hasData;
    });

    // Simple search filter if search term provided
    let filteredStudents = validStudents;
    const { search } = req.query;
    if (search) {
      filteredStudents = validStudents.filter(student => {
        // Convert student to string and search within it
        const studentString = JSON.stringify(student).toLowerCase();
        return studentString.includes(search.toLowerCase());
      });
    }

    res.json({
      success: true,
      message: "✅ Student data retrieved successfully",
      totalRecords: filteredStudents.length,
      data: filteredStudents
    });
  } catch (error) {
    console.error("❌ Error retrieving student data:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving student data", 
      error: error.message 
    });
  }
};

export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }

    res.json({
      success: true,
      message: "✅ Student data retrieved successfully",
      data: student
    });
  } catch (error) {
    console.error("❌ Error retrieving student:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving student", 
      error: error.message 
    });
  }
};

// Debug endpoint to see all data without pagination
export const getAllStudentData = async (req, res) => {
  try {
    const allStudents = await Student.find({}).sort({ _id: -1 });
    
    // Filter out empty records - only keep records with actual data
    const validStudents = allStudents.filter(student => {
      // Check if the student record has meaningful data
      const hasData = Object.keys(student.toObject()).some(key => {
        if (key === '_id' || key === '__v') return false; // Skip MongoDB internal fields
        
        const value = student[key];
        
        // If it's a nested object (like 1A, 1B, etc.)
        if (value && typeof value === 'object' && !Array.isArray(value)) {
          return Object.values(value).some(nestedValue => 
            nestedValue !== null && 
            nestedValue !== undefined && 
            nestedValue !== "" &&
            nestedValue.toString().trim() !== ""
          );
        }
        
        // If it's a direct field
        return value !== null && 
               value !== undefined && 
               value !== "" &&
               value.toString().trim() !== "";
      });
      
      return hasData;
    });
    
    console.log("📊 Total students in database (raw):", allStudents.length);
    console.log("📊 Total students with valid data:", validStudents.length);
    console.log("📋 Sample student data structure:", validStudents[0] ? JSON.stringify(validStudents[0], null, 2) : "No valid data found");
    
    res.json({
      success: true,
      message: "✅ All student data retrieved successfully",
      totalRawRecords: allStudents.length,
      totalValidRecords: validStudents.length,
      data: validStudents
    });
  } catch (error) {
    console.error("❌ Error retrieving all student data:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error retrieving all student data", 
      error: error.message 
    });
  }
};

// Update student by ID
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    console.log(`📝 Updating student ${id}:`, JSON.stringify(updateData, null, 2));
    
    // Remove fields that shouldn't be updated directly
    delete updateData._id;
    delete updateData.__v;
    delete updateData.super_admin_password;
    
    // Find and update the student
    const student = await Student.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: false } // Return updated document
    );
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }
    
    console.log(`✅ Student ${id} updated successfully`);
    
    res.json({
      success: true,
      message: "✅ Student updated successfully",
      data: student
    });
  } catch (error) {
    console.error("❌ Error updating student:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error updating student", 
      error: error.message 
    });
  }
};

// Create a new student
export const createStudent = async (req, res) => {
  try {
    const studentData = req.body;
    
    console.log(`📝 Creating new student:`, JSON.stringify(studentData, null, 2));
    
    // Validate required fields
    if (!studentData.firstname || !studentData.lastname) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: firstname, lastname"
      });
    }
    
    // Set displayname if not provided
    if (!studentData.displayname) {
      studentData.displayname = `${studentData.firstname} ${studentData.lastname}`;
    }
    
    // Remove super_admin_password if present
    delete studentData.super_admin_password;
    
    // Create new student
    const student = new Student(studentData);
    await student.save();
    
    console.log(`✅ Student created successfully with ID: ${student._id}`);
    
    res.status(201).json({
      success: true,
      message: "✅ Student created successfully",
      data: student
    });
  } catch (error) {
    console.error("❌ Error creating student:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error creating student", 
      error: error.message 
    });
  }
};

// Delete a single student by ID
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log(`🗑️ Deleting student ${id}`);
    
    const student = await Student.findByIdAndDelete(id);
    
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: "Student not found" 
      });
    }
    
    console.log(`✅ Student ${id} deleted successfully`);
    
    res.json({
      success: true,
      message: "✅ Student deleted successfully",
      data: student
    });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error deleting student", 
      error: error.message 
    });
  }
};

// Cleanup endpoint to delete all student data
export const cleanupStudentData = async (req, res) => {
  try {
    // Get count before deletion for logging
    const countBefore = await Student.countDocuments();
    
    if (countBefore === 0) {
      return res.json({
        success: true,
        message: "✅ No data to clean up - database is already empty",
        deletedCount: 0
      });
    }

    // Delete all student records
    const result = await Student.deleteMany({});
    
    console.log(`🗑️ Cleaned up ${result.deletedCount} student records from database`);
    
    res.json({
      success: true,
      message: "✅ All student data has been successfully deleted",
      deletedCount: result.deletedCount,
      previousCount: countBefore
    });
  } catch (error) {
    console.error("❌ Error cleaning up student data:", error);
    res.status(500).json({ 
      success: false,
      message: "Error cleaning up student data", 
      error: error.message 
    });
  }
};