var express = require("express");
var router = express.Router();
var databaseConnector = require("../databaseConnector");
var { verifyToken } = require("../middleware/authorizator");
var authRouter = require("./authenticator");

var apiaryList = [];

router.use("/auth", authRouter);

router.post("*", [verifyToken]);
router.patch("*", [verifyToken]);
router.delete("*", [verifyToken]);

router.get("/", function (req, res) {
	res.render("index", { title: "Praca inżynierska - REST API" });
});

router.get("/XD", [verifyToken], function (req, res) {
	res.render("index", { title: "Praca inżynierska - REST API" });
});

router.get("/colorInfo", (req, res) => {
	return res.json(databaseConnector.getColorInfo());
});

router.patch("/colorInfo", [], (req, res) => {
	let updatedColorInfo = req.body;
	let oldColorInfo = databaseConnector.getColorInfo();

	const areValuesMatching = (oldObject, newObject) => {
		let oldKeys = Object.keys(oldObject);
		let newKeys = Object.keys(newObject);

		if (oldKeys.length !== newKeys.length) return false;

		oldKeys.forEach((key) => {
			if (!newObject.hasOwnProperty(key)) return false;
		});
		return true;
	};

	if (!areValuesMatching(oldColorInfo, updatedColorInfo)) return res.status(406).json("Color info object properties does not match");

	if (Object.keys(oldColorInfo).length !== Object.keys(updatedColorInfo).length || !areValuesMatching(oldColorInfo, updatedColorInfo))
		return res.status(406).json("Color info object properties does not match");

	const colorHexRegex = new RegExp("[0-9A-Fa-f]{6}");
	Object.values(updatedColorInfo).forEach((value) => {
		if (!colorHexRegex.test(value)) return res.status(406).json("Values are not color hex");
	});

	if (!databaseConnector.updateColorInfo(updatedColorInfo)) res.status(500).json("Unknown error during code generation");

	return res.sendStatus(200);
});

router.get("/contactInfo", (req, res) => {
	return res.json(databaseConnector.getContactInfo());
});

router.get("/textBlock", (req, res) => {
	return res.json(databaseConnector.getTextBlockList());
});

router.get("/image", (req, res) => {
	console.log(databaseConnector.getImageList());
	return res.json(databaseConnector.getImageList());
});

router.get("/horse", (req, res) => {
	return res.json(databaseConnector.getHorseList());
});

router.post("/horse", (req, res) => {
	let newHorse = req.body;
	newHorse.image = parseInt(newHorse.image);

	if (!newHorse.hasOwnProperty("name") || !newHorse.hasOwnProperty("description") || !newHorse.hasOwnProperty("image"))
		return res.status(406).json("New horse object lacks mandatory fields");
	if (newHorse.getHorseList().find((item) => item.name === newHorse.name)) return res.status(406).json("Name taken");
	if (newHorse.image != null && !databaseConnector.getImageList().find((item) => item.id === newHorse.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.createHorse(newHorse)) res.status(500).json("Unknown error during code generation");

	return res.sendStatus(200);
});

router.patch("/horse/:name", (req, res) => {
	let updatedHorse = req.body;
	newHorse.image = parseInt(newHorse.image);
	updatedHorse.name = req.params.name;

	if (!updatedHorse.hasOwnProperty("description") || !updatedHorse.hasOwnProperty("image")) return res.status(406).json("Object lacks mandatory fields");
	if (newHorse.image != null && !databaseConnector.getImageList().find((item) => item.id === updatedHorse.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.updatHorse(updatedHorse)) res.status(500).json("Unknown error during code generation");
	res.sendStatus(200);
});

router.delete("/horse/:name", (req, res) => {
	return res.json(databaseConnector.getHorseList());
});

router.get("/offer", (req, res) => {
	return res.json(databaseConnector.getOfferList());
});

router.get("/priceList", (req, res) => {
	return res.json(databaseConnector.getPriceList());
});

router.post("/apiaries", (req, res) => {
	let newApiary = req.body;

	try {
		if (newApiary.name == "") return res.status(406).json("Name not specified");
	} catch (error) {
		console.log(error);
		return res.status(406).json("Name is not correct");
	}

	try {
		let date = new Date();
		newApiary.date = date.toLocaleDateString("pl-PL");

		let number = date.toISOString().split("T")[0];
		number = number.split("-").join("");

		// sort by date then id to allow finding first free id number
		apiaryList.sort((a, b) => {
			return a.number.slice(0, -3) - b.number.slice(0, -3);
		});

		let val = apiaryList
			.filter((item) => newApiary.date === item.date)
			.reduce((previousVal, item) => {
				return parseInt(item.number.slice(8, -3)) === previousVal ? ++previousVal : previousVal;
			}, 1);

		if (newApiary.number === "") number += String(val).padStart(5, "0");
		else if (newApiary.number <= 0 || newApiary.number >= 100000) return res.status(406).json("Number has to be in range 1 - 99999");
		else if (newApiary.number < val) return res.status(406).json("Number already taken, you can try to get it tommorow");
		else number += String(newApiary.number).padStart(5, "0");

		number += calculateControlSum(number);
		newApiary.number = number;
		apiaryList.push(newApiary);

		res.sendStatus(200);
	} catch (error) {
		console.log(error);
		res.status(500).json("Unknown error during code generation");
	}
});

module.exports = router;
