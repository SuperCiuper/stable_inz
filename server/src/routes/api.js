var express = require("express");
var router = express.Router();
var databaseConnector = require("../databaseConnector");
var { verifyToken } = require("../middleware/authorizator");
var authRouter = require("./authenticator");

var apiaryList = [];
const DUMMY_IMAGE = "dummyImage.jpg";

router.use("/auth", authRouter);

router.post("*", [verifyToken]);
router.patch("*", [verifyToken]);
router.delete("*", [verifyToken]);

router.get("/", function (req, res) {
	res.render("index", { title: "Praca inżynierska - REST API" });
});

router.get("/colorInfo", (req, res) => {
	return res.json(databaseConnector.getColorInfo());
});

router.patch("/colorInfo", (req, res) => {
	let updatedColorInfo = req.body;
	let oldColorInfo = databaseConnector.getColorInfo();

	const areValuesMatching = (oldObject, newObject) => {
		let oldKeys = Object.keys(oldObject);
		let newKeys = Object.keys(newObject);

		if (oldKeys.length !== newKeys.length) return false;

		oldKeys.forEach((key) => {
			if (!Object.prototype.hasOwnProperty.call(newObject, key)) return false;
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

router.post("/textBlock", (req, res) => {
	let newTextBlock = req.body;

	if (!Object.prototype.hasOwnProperty.call(newTextBlock, "description") || !Object.prototype.hasOwnProperty.call(newTextBlock, "image"))
		return res.status(406).json("Object lacks mandatory fields");
	if (newTextBlock.image != null && !databaseConnector.getImageList().find((item) => item === newTextBlock.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.createTextBlock(newTextBlock)) res.status(500).json("Unknown error during code generation");
	return res.sendStatus(200);
});

router.patch("/textBlock", (req, res) => {
	let updatedTextBlock = req.body;

	if (!Object.prototype.hasOwnProperty.call(updatedTextBlock, "description") || !Object.prototype.hasOwnProperty.call(updatedTextBlock, "image"))
		return res.status(406).json("Object lacks mandatory fields");

	updatedTextBlock.id = parseInt(updatedTextBlock.id);
	if (databaseConnector.getTextBlockList().find((item) => item.id === updatedTextBlock.id) === undefined) return res.status(406).json("Wrong textBlock id");
	if (updatedTextBlock.image != null && !databaseConnector.getImageList().find((item) => item === updatedTextBlock.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.updateTextBlock(updatedTextBlock)) res.status(500).json("Unknown error during code generation");
	return res.sendStatus(200);
});

router.delete("/textBlock", (req, res) => {
	let id;
	try {
		id = parseInt(req.body.id);
	} catch {
		res.status(406).json("Id not provided");
	}

	if (databaseConnector.getTextBlockList().find((item) => item.id === id) === undefined) return res.status(406).json("TextBlock does not exist");

	if (!databaseConnector.deleteTextBlock(id)) res.status(500).json("Unknown error during code generation");
	return res.sendStatus(200);
});

router.get("/horse", (req, res) => {
	return res.json(databaseConnector.getHorseList());
});

router.post("/horse", (req, res) => {
	let newHorse = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(newHorse, "name") ||
		!Object.prototype.hasOwnProperty.call(newHorse, "description") ||
		!Object.prototype.hasOwnProperty.call(newHorse, "image")
	)
		return res.status(406).json("New horse object lacks mandatory fields");

	if (newHorse.name === null || newHorse.name === "" || newHorse.name === undefined) return res.status(406).json("Name not correct");
	if (databaseConnector.getHorseList().find((item) => item.name === newHorse.name)) return res.status(406).json("Name taken");
	if (newHorse.image !== null && !databaseConnector.getImageList().find((item) => item === newHorse.image)) return res.status(406).json("Image does not exist");

	if (!databaseConnector.createHorse(newHorse)) res.status(500).json("Unknown error during code generation");
	return res.sendStatus(200);
});

router.patch("/horse", (req, res) => {
	let updatedHorse = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(updatedHorse, "name") ||
		!Object.prototype.hasOwnProperty.call(updatedHorse, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedHorse, "images")
	)
		return res.status(406).json("New horse object lacks mandatory fields");

	for (const image of updatedHorse.images) {
		console.log(image);
		if (!databaseConnector.getImageList().find((item) => item === image)) return res.status(406).json("Image does not exist");
	}
	console.log("XD");
	if (!databaseConnector.updateHorse(updatedHorse)) res.status(500).json("Unknown error during code generation");
	return res.sendStatus(200);
});

router.delete("/horse", (req, res) => {
	let name;
	try {
		name = req.body.name;
		if (name === null || name === "" || name === undefined) throw Error();
	} catch {
		res.status(406).json("Name not provided");
	}

	if (databaseConnector.getHorseList().find((item) => item.name === name) === undefined) return res.status(406).json("Horse does not exist");

	if (!databaseConnector.deleteHorse(name)) res.status(500).json("Unknown error during code generation");
	return res.sendStatus(200);
});

router.get("/image", (req, res) => {
	return res.json(databaseConnector.getImageList());
});

router.get("/offer", (req, res) => {
	return res.json(databaseConnector.getOfferList());
});

router.get("/priceList", (req, res) => {
	return res.json(databaseConnector.getPriceList());
});

module.exports = router;
