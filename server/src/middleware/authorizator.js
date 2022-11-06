const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
	let token = req.headers["x-access-token"];

	if (!token) {
		return res.status(403).json("No token provided!");
	}

	jwt.verify(token, process.env.PRIVATE_KEY, (err) => {
		if (err) {
			return res.status(401).json("Unauthorized!");
		}
		next();
	});
};

module.exports = {
	verifyToken,
};
