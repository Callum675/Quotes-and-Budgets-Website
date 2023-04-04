const User = require('../models/User');
const bcrypt = require('bcrypt');
const { createAccessToken } = require('../utils/token');
const { validateEmail } = require('../utils/validation');

/* This is a signup route. It is used to signup the user. */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    /* This is a validation. It is checking if the user has entered all the details or not. If the user
    has not entered all the details then it will return an error message. */
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please fill all the fields' });
    }
    /* This is a validation. It is checking if the user has entered all the details or not. If the user
        has not entered all the details then it will return an error message. */
    if (typeof name !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ msg: 'Please send string values only' });
    }

    /* Checking if the password length is less than 4 characters or not. If it is less than 4
    characters then it will return an error message. */
    if (password.length < 4) {
      return res.status(400).json({ msg: 'Password length must be atleast 4 characters' });
    }

    /* Checking if the email is valid or not. */
    if (!validateEmail(email)) {
      return res.status(400).json({ msg: 'Invalid Email' });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'This email is already registered' });
    }

    /* Hashing the password and then creating a new user. */
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });
    res.status(200).json({ msg: 'Congratulations!! Account has been created for you..' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Internal Server Error' });
  }
};

/* This is a login route. It is used to login the user. */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    /* This is a validation. It is checking if the user has entered all the details or not. If the user
            has not entered all the details then it will return an error message. */
    if (!email || !password) {
      return res.status(400).json({ status: false, msg: 'Please enter all details!!' });
    }
    /* This is a validation. It is checking if the user is registered or not. If the user is not
    registered then it will return an error message. */
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: false, msg: 'This email is not registered!!' });

    /* Comparing the password entered by the user with the password stored in the database. */
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ status: false, msg: 'Password or Email is incorrect!!' });

    /* This is creating a token for the user and then deleting the password from the user object. */
    const token = createAccessToken({ id: user._id });
    delete user.password;
    res.status(200).json({ token, user, status: true, msg: 'Login successful..' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: false, msg: 'Internal Server Error' });
  }
};
