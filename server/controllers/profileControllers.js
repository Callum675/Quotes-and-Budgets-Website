const User = require('../models/User');

// This function gets the user profile
exports.getProfile = async (req, res) => {
  try {
    // Find the user by their ID and exclude the password field from the response
    const user = await User.findById(req.user.id).select('-password');

    // Respond with a success status and the user object
    res.status(200).json({ user, status: true, msg: 'Profile found successfully..' });
  } catch (err) {
    // Log any errors that occur and respond with a 500 status and error message
    console.error(err);
    return res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};
