const mongoose = require("mongoose");

/**
 * It takes an email address as a string, converts it to lowercase, and returns true if it matches the
 * regex, and false if it doesn't
 * @param email - The email address to validate.
 * @returns A boolean value.
 */
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
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
