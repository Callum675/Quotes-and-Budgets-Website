const validator = require("validator");

/**
 * It takes an email address as a string, sanitizes it, and then validates it
 * @param email - The email address to validate.
 * @returns A boolean value.
 */
const isValidEmail = (email) => {
  const sanitizedEmail = validator.normalizeEmail(email);
  return validator.isEmail(sanitizedEmail);
};

export const validate = (group, name, value) => {
  if (group === "signup") {
    switch (name) {
      case "name": {
        if (!value) return "This field is required";
        return null;
      }
      case "email": {
        if (!value) return "This field is required";
        if (!isValidEmail(value)) return "Please enter valid email address";
        return null;
      }
      case "password": {
        if (!value) return "This field is required";
        if (value.length < 4) return "Password should be atleast 4 chars long";
        return null;
      }
      default:
        return null;
    }
  } else if (group === "login") {
    switch (name) {
      case "email": {
        if (!value) return "This field is required";
        if (!isValidEmail(value)) return "Please enter valid email address";
        return null;
      }
      case "password": {
        if (!value) return "This field is required";
        return null;
      }
      default:
        return null;
    }
  } else if (group === "project") {
    switch (name) {
      case "name": {
        if (!value) return "This field is required";
        if (value.length > 60) return "Max. limit is 60 characters.";
        return null;
      }
      case "description": {
        if (value.length > 100) return "Max. limit is 100 characters.";
        return null;
      }
      case "workers": {
        if (!Array.isArray(value))
          return "Invalid data type. Expected an array.";

        // Validate the name field of each worker object in the array
        for (let i = 0; i < value.length; i++) {
          const worker = value[i];
          if (worker.name && worker.name.length > 30) {
            return `Worker name at index ${i} exceeds the limit of 30 characters`;
          }
        }
        return null;
      }
      case "resources": {
        if (!Array.isArray(value))
          return "Invalid data type. Expected an array.";

        // Validate the name field of each worker object in the array
        for (let i = 0; i < value.length; i++) {
          const resource = value[i];
          if (resource.name && resource.name.length > 30) {
            return `resource name at index ${i} exceeds the limit of 30 characters`;
          }
        }
        return null;
      }
      default:
        return null;
    }
  } else {
    return null;
  }
};

/**
 * It takes a group of fields, and a list of fields to validate, and returns an array of errors
 * @param group - the group of fields to validate
 * @param list - an object with the fields to validate
 * @returns An array of objects with the field and error message.
 */
const validateManyFields = (group, list) => {
  const errors = [];
  for (const field in list) {
    const value = list[field];
    const err = validate(group, field, value);
    if (err) errors.push({ field, err });
  }
  return errors;
};
export default validateManyFields;
