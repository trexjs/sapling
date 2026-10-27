import { Teacher } from "../models/teacherModel.js";

/**
 * Generate a unique teacher ID in format TC000001, TC000002, etc.
 * @returns {Promise<string>} Generated teacher ID
 */
export const generateTeacherId = async () => {
  try {
    // Find the highest existing teacher ID
    const lastTeacher = await Teacher.findOne({}, { teacher_id: 1 })
      .sort({ teacher_id: -1 })
      .limit(1);

    let nextNumber = 1;
    
    if (lastTeacher && lastTeacher.teacher_id) {
      // Extract the number from the last teacher ID (e.g., "TC000001" -> 1)
      const lastNumber = parseInt(lastTeacher.teacher_id.replace('TC', ''));
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    // Format the number with leading zeros (6 digits)
    const formattedNumber = nextNumber.toString().padStart(6, '0');
    return `TC${formattedNumber}`;
  } catch (error) {
    console.error("Error generating teacher ID:", error);
    throw new Error("Failed to generate teacher ID");
  }
};

/**
 * Calculate age from date of birth
 * @param {Date|string} dob - Date of birth
 * @returns {number} Calculated age
 */
export const calculateAge = (dob) => {
  try {
    const birthDate = new Date(dob);
    const today = new Date();
    
    // Validate the date
    if (isNaN(birthDate.getTime())) {
      throw new Error("Invalid date of birth");
    }
    
    // Check if birth date is not in the future
    if (birthDate > today) {
      throw new Error("Date of birth cannot be in the future");
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error("Error calculating age:", error);
    throw new Error(`Invalid date of birth: ${error.message}`);
  }
};

/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (basic validation)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid phone format
 */
export const isValidPhone = (phone) => {
  // Remove all non-digit characters
  const cleanPhone = phone.replace(/\D/g, '');
  // Check if it's between 10-15 digits (international format)
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
};

/**
 * Validate pincode format (Indian pincode)
 * @param {string} pincode - Pincode to validate
 * @returns {boolean} True if valid pincode format
 */
export const isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(pincode);
};

/**
 * Check if a teacher already exists with the same email
 * @param {string} email - Email to check
 * @param {string} excludeId - Teacher ID to exclude from check (for updates)
 * @returns {Promise<boolean>} True if email already exists
 */
export const isEmailAlreadyExists = async (email, excludeId = null) => {
  try {
    const query = { 'profile.email_id': email.toLowerCase() };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }
    
    const existingTeacher = await Teacher.findOne(query);
    return !!existingTeacher;
  } catch (error) {
    console.error("Error checking email existence:", error);
    throw new Error("Failed to check email existence");
  }
};

/**
 * Check if a teacher is already working for another school
 * @param {string} email - Email to check
 * @param {string} schoolId - School ID to check against
 * @returns {Promise<boolean>} True if teacher is already working for another school
 */
export const isTeacherWorkingForAnotherSchool = async (email, schoolId) => {
  try {
    const existingTeacher = await Teacher.findOne({
      'profile.email_id': email.toLowerCase(),
      school_id: { $ne: schoolId },
      status: true
    });
    return !!existingTeacher;
  } catch (error) {
    console.error("Error checking teacher school assignment:", error);
    throw new Error("Failed to check teacher school assignment");
  }
};
