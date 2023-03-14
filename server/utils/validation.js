const mongoose = require("mongoose");
const validator = require("validator");

/**
 * It takes an email address as a string, sanitizes it, and then validates it
 * @param email - The email address to validate.
 * @returns A boolean value.
 */
const validateEmail = (email) => {
  const sanitizedEmail = validator.normalizeEmail(email);
  return validator.isEmail(sanitizedEmail);
};

/**
 * It returns true if the string is a valid ObjectId, otherwise it returns false
 * @param string - The string to validate.
 * @returns A boolean value.
 */
const validateObjectId = (string) => {
  return mongoose.Types.ObjectId.isValid(string);
};

module.exports = {
  validateEmail,
  validateObjectId,
};
