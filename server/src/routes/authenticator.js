var express = require("express");
var router = express.Router();
var databaseConnector = require("../databaseConnector");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const SALT_ROUNDS = 16;
var { verifyToken } = require("../middleware/authorizator");

const EXPIRATION_TIME = "2h"; // 2 hours

router.get("/", (req, res) => {
	res.render("index", { title: "Praca inżynierska - AUTH" });
});

router.post("/login", (req, res) => {
	const password = req.body.password;
	console.log(password);
	try {
		const passwordIsValid = bcrypt.compareSync(password, databaseConnector.getPassword());

		if (!passwordIsValid) {
			return res.status(401).send({
				accessToken: null,
				message: "Invalid Password!",
			});
		}

		var token = jwt.sign({}, process.env.PRIVATE_KEY, {
			expiresIn: EXPIRATION_TIME,
		});

		res.status(200).send({
			accessToken: token,
		});
	} catch (err) {
		console.log(err);
		res.status(500).send({ message: err.message });
	}
});

router.patch("/update", [verifyToken], (req, res) => {
	res.render("index", { title: "update" });

	//return res.json(databaseConnector.getMainInfo());
});

module.exports = router;
