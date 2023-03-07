const validateCredentials = (req, res, next) => {
	const { username, password } = req.body;

	// Check if username and password are given
	if (!username || !password) {
		res.status(400).json({ error: "Must include username and password." });	// Status 400 = Bad Request
		return;
	}
	
	if (username.length < 3) {
		res.status(400).json({ error: "Username must be at least 3 characters." });	// Status 400 = Bad Request
		return;
	}

	if (username.length > 15) {
		res.status(400).json({ error: "Username must not exceed 15 characters." });	// Status 400 = Bad Request
		return;
	}
	
	if (password.length < 8) {
		res.status(400).json({ error: "Password must be at least 8 characters." });	// Status 400 = Bad Request
		return;
	}
	
	next();
};

const userAuth = (req, res, next) => {
	// Check if user is authenticated
	if (!req.session.userId) {
		res.status(401).redirect("/signin");		// Status 401 = Unauthorized
		return;
	}

	next();
};

const userNotAuth = (req, res, next) => {
	// Check if user is authenticated
	if (req.session.userId) {
		res.status(403).redirect("/");		// Status 403 = Forbidden
		return;
	}

	next();
};

module.exports = {
	validateCredentials,
	userAuth,
	userNotAuth,
};