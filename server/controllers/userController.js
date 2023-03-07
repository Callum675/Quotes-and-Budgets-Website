const User = require("../models/user.js");
const CONSTANTS = require('../config/constants');
const passwordHash = require('../utils/password-hash');


const signUp = async (req, res) => {
	try {
		const { username, password } = req.body;

		// Check if username already exists
		const allUsers = await User.find().select("username").exec();
		if (allUsers.find(user => user.username.toLowerCase() === username.toLowerCase())) {
			res.status(400).json({ error: "User already exists with that name." });
			return;
		}
	
		// Hash password with salt
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(password, salt);
	
		// Create new User with username and password
		const user = await User.create({ username, password: hash });
		if (!user) {
			res.status(500).json({ error: "Error occurred while creating user" });
			return;
		}

		// Save user as session variables
		req.session.userId = user._id;
		req.session.username = user.username;

		res.status(201).json({ success: true });
	}
	catch(error) {
		console.log(error.message);
		res.status(500).json({ error: "Error occurred while signing up" });
	}
};

const signIn = async (req, res) => {
	try {
		const { username, password } = req.body;
	
		// Get user from database with username
		const user = await User.findOne({ username })
			.select("_id username password locations videos")
			.populate("locations videos")
			.exec();
		
		if (!user) {
			res.status(401).json({ error: "Incorrect username or password." });
			return;
		}
	
		// Compare password with saved hash
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			res.status(401).json({ error: "Incorrect username or password." });
			return;
		}
	
		// Save user as session variables
		req.session.userId = user._id;
		req.session.username = user.username;

		res.status(200).json({ success: true });
	}
	catch(error) {
		console.error(error.message);
		res.status(500).json({ error: "Error occurred while signing in" });
	}
};

const signOut = (req, res) => {
	try {
		req.session.userId = null;
		req.session.username = null;
		req.session.destroy();
		res.status(200).json({ success: true });
	}
	catch(error) {
		console.error(error.message);
		res.status(500).json({ error: "Error occurred while signing out" });
	}
};

const changePassword = async (req, res) => {
	try {
		const { password, newPassword } = req.body;

		// Get user from database with username
		const user = await User.findOne({ _id: req.session.userId })
			.select("password")
			.exec();
	
		if (!user) {
			res.status(401).json({ error: "Authentication error while changing password" });
			return;
		}

		// Compare password with saved hash
		const match = await bcrypt.compare(password, user.password);
		if (!match) {
			res.status(401).json({ error: "Incorrect password" });
			return;
		}

		// Hash password with salt
		const salt = await bcrypt.genSalt(10);
		const hash = await bcrypt.hash(newPassword, salt);
	
		// Update the database
		await User.updateOne({ _id: req.session.userId }, { $set: { password: hash } }).exec();
		res.status(200).json({ success: true });
	}
	catch(error) {
		console.error(error);
		res.status(500).json({ error: "Error occurred while changing password" });
	}
};

const deleteUser = async (req, res) => {
	try {
		const result = await User.deleteOne({ _id: req.session.userId }).exec();
		req.session.userId = null;
		req.session.username = null;
		req.session.destroy();
		res.status(200).json(result);
	}
	catch(error) {
		console.error(error.message);
		res.status(500).json({ error: "Error occurred while deleting user" });
	}
};

module.exports = {
	signUp,
	signIn,
	signOut,
	changePassword,
	deleteUser
};