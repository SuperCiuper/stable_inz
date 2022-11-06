var express = require("express");
var router = express.Router();
var databaseConnector = require("../databaseConnector");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 16;
var { verifyToken } = require("../middleware/authorizator");

const EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour

router.get("/", (req, res) => {
	res.render("index", { title: "Praca inżynierska - AUTH" });
});

router.post("/login", (req, res) => {
	const password = req.body.password;

	try {
		const passwordIsValid = bcrypt.compareSync(password, databaseConnector.getPassword());

		if (!passwordIsValid) {
			return res.status(401).json("Invalid Password!");
		}

		var token = jwt.sign({}, process.env.PRIVATE_KEY, {
			expiresIn: EXPIRATION_TIME,
		});

		return res.status(200).json({
			accessToken: token,
			expiresIn: EXPIRATION_TIME,
		});
	} catch (err) {
		console.log(err);
		res.status(500).json("Internal server error");
	}
});

router.patch("/update", [verifyToken], (req, res) => {
	res.render("index", { title: "update" });

	//return res.json(databaseConnector.getMainInfo());
});

module.exports = router;
