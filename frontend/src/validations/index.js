// Import libraries
const DOMPurify = require('dompurify');

/**
 * It takes an email address as a string, converts it to lowercase, and returns true if it matches theregex, and false if it doesn't
 * @param email - The email address to validate.
 * @returns A boolean value.
 */
const isValidEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

/**
 * This function validates a specific field of a group (signup, login, or project)
 * @param {string} group - The group of fields to validate.
 * @param {string} name - The name of the field to validate.
 * @param {*} value - The value of the field to validate.
 * @returns {string|null} A string containing an error message if the field is invalid, or null if it is valid.
 */
export const validate = (group, name, value) => {
  if (group === 'signup') {
    switch (name) {
      case 'name': {
        // Check if the field is not empty
        if (!value) return 'This field is required';
        // Sanitize user input
        const sanitizedValue = DOMPurify.sanitize(value);
        // Validate sanitized input
        if (sanitizedValue !== value) return 'Invalid characters found in input';
        return null;
      }
      case 'email': {
        // Check if the field is not empty
        if (!value) return 'This field is required';
        // Sanitize user input
        const sanitizedValue = DOMPurify.sanitize(value);
        // Validate sanitized input
        if (sanitizedValue !== value) return 'Invalid characters found in input';
        // Check if the email address is valid
        if (!isValidEmail(sanitizedValue)) return 'Please enter valid email address';
        return null;
      }
      case 'password': {
        // Check if the field is not empty
        if (!value) return 'This field is required';
        // Sanitize user input
        const sanitizedValue = DOMPurify.sanitize(value);
        // Validate sanitized input
        if (sanitizedValue !== value) return 'Invalid characters found in input';
        // Check if the password has at least 4 characters
        if (sanitizedValue.length < 8) return 'Password should be atleast 8 chars long';
        return null;
      }
      default:
        return null;
    }
  } else if (group === 'login') {
    switch (name) {
      case 'email': {
        // Check if the field is not empty
        if (!value) return 'This field is required';
        // Check if the email address is valid
        if (!isValidEmail(value)) return 'Please enter valid email address';
        return null;
      }
      case 'password': {
        // Check if the field is not empty
        if (!value) return 'This field is required';
        return null;
      }
      default:
        return null;
    }
  } else if (group === 'project') {
    switch (name) {
      case 'name': {
        // Sanitize the input using DOMPurify
        value = DOMPurify.sanitize(value);
        // Check if the field is not empty
        if (!value) return 'This field is required';
        // Check if the name is longer than 60 characters
        if (value.length > 60) return 'Max. limit is 60 characters.';
        return null;
      }
      case 'description': {
        // Sanitize the input using DOMPurify
        value = DOMPurify.sanitize(value);
        // Check if the description is longer than 100 characters
        if (value.length > 100) return 'Max. limit is 100 characters.';
        return null;
      }
      case 'workers': {
        // Check if the value is an array
        if (!Array.isArray(value)) return 'Invalid data type. Expected an array.';

        // Validate the name field of each worker object in the array
        for (let i = 0; i < value.length; i++) {
          const worker = value[i];
          if (worker.name) {
            // Sanitize the input using DOMPurify
            worker.name = DOMPurify.sanitize(worker.name);
            if (worker.name.length > 30) {
              return `Worker name at index ${i} exceeds the limit of 30 characters`;
            }
          }
        }
        return null;
      }
      case 'resources': {
        // Check if the value is an array
        if (!Array.isArray(value)) return 'Invalid data type. Expected an array.';

        // Validate the name field of each worker object in the array
        for (let i = 0; i < value.length; i++) {
          const resource = value[i];
          if (resource.name) {
            // Sanitize the input using DOMPurify
            resource.name = DOMPurify.sanitize(resource.name);
            if (resource.name.length > 30) {
              return `resource name at index ${i} exceeds the limit of 30 characters`;
            }
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
  // Create an empty array to hold the errors.
  const errors = [];

  // Iterate through each field in the list.
  for (const field in list) {
    // Get the value of the current field.
    const value = list[field];

    // Call the validate function with the current field, value, and group.
    const err = validate(group, field, value);

    // If an error is returned, push an object with the field and error message to the errors array.
    if (err) errors.push({ field, err });
  }
  // Return the array of errors.
  return errors;
};
// Export the function as a default export.
export default validateManyFields;
