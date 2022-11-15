var express = require("express");
var router = express.Router();
const fileUpload = require("express-fileupload");
var databaseConnector = require("../databaseConnector");
var { verifyToken } = require("../middleware/authorizator");
var authRouter = require("./authenticator");
var fs = require("fs");
const path = require("path");

router.use(fileUpload());
router.use("/auth", authRouter);

router.post("*", [verifyToken]);
router.patch("*", [verifyToken]);
router.delete("*", [verifyToken]);

router.get("/", (req, res) => {
	res.render("index", { title: "Praca inżynierska - REST API" });
});

router.get("/colorInfo", (req, res) => {
	return res.json(databaseConnector.getColorInfo());
});

router.patch("/colorInfo", (req, res) => {
	let updatedColorInfo = req.body;
	let oldColorInfo = databaseConnector.getColorInfo();

	// replace with manual test
	const areValuesMatching = (oldObject, newObject) => {
		let oldKeys = Object.keys(oldObject);
		let newKeys = Object.keys(newObject);

		if (oldKeys.length !== newKeys.length) return false;

		oldKeys.forEach((key) => {
			if (!Object.prototype.hasOwnProperty.call(newObject, key)) return false;
		});
		return true;
	};

	if (Object.keys(oldColorInfo).length !== Object.keys(updatedColorInfo).length || !areValuesMatching(oldColorInfo, updatedColorInfo))
		return res.status(406).json("Color info object properties does not match");

	const colorHexRegex = new RegExp("[0-9A-Fa-f]{6}");
	Object.values(updatedColorInfo).forEach((value) => {
		if (!colorHexRegex.test(value)) return res.status(406).json("Values are not color hex");
	});

	if (!databaseConnector.updateColorInfo(updatedColorInfo)) res.status(500).json("Unknown internal server error");

	return res.sendStatus(200);
});

router.get("/contactInfo", (req, res) => {
	return res.json(databaseConnector.getContactInfo());
});

router.patch("/contactInfo", (req, res) => {
	let updatedContactInfo = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(updatedContactInfo, "city") ||
		!Object.prototype.hasOwnProperty.call(updatedContactInfo, "gmapLat") ||
		!Object.prototype.hasOwnProperty.call(updatedContactInfo, "gmapLng") ||
		!Object.prototype.hasOwnProperty.call(updatedContactInfo, "mail") ||
		!Object.prototype.hasOwnProperty.call(updatedContactInfo, "phoneNumber") ||
		!Object.prototype.hasOwnProperty.call(updatedContactInfo, "street") ||
		!Object.prototype.hasOwnProperty.call(updatedContactInfo, "zipCode")
	)
		return res.status(406).json("Updated offer object lacks mandatory fields");

	Object.values(updatedContactInfo).forEach((value) => {
		if (value === null || value === undefined || value === "") return res.status(406).json("At least one value is not valid");
	});
	const phoneNumberRegex = new RegExp("[0-9]{9}");
	if (!phoneNumberRegex.test(updatedContactInfo.phoneNumber)) return res.status(406).json("Phone number is not valid");

	// parse lng lat, also check if correct

	if (!databaseConnector.updateContactInfo(updatedContactInfo)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.get("/textBlock", (req, res) => {
	return res.json(databaseConnector.getTextBlockList());
});

router.post("/textBlock", (req, res) => {
	let newTextBlock = req.body;

	if (!Object.prototype.hasOwnProperty.call(newTextBlock, "description") || !Object.prototype.hasOwnProperty.call(newTextBlock, "image"))
		return res.status(406).json("Object lacks mandatory fields");
	if (newTextBlock.image != null && !databaseConnector.getImageList().find((item) => item.image === newTextBlock.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.createTextBlock(newTextBlock)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.patch("/textBlock", (req, res) => {
	let updatedTextBlock = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(updatedTextBlock, "id") ||
		!Object.prototype.hasOwnProperty.call(updatedTextBlock, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedTextBlock, "image")
	)
		return res.status(406).json("Object lacks mandatory fields");

	updatedTextBlock.id = parseInt(updatedTextBlock.id);
	if (databaseConnector.getTextBlockList().find((item) => item.id === updatedTextBlock.id) === undefined)
		return res.status(406).json("Textblock with given id does not exist");
	if (updatedTextBlock.image != null && !databaseConnector.getImageList().find((item) => item.image === updatedTextBlock.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.updateTextBlock(updatedTextBlock)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.delete("/textBlock", (req, res) => {
	let deleteId;
	try {
		deleteId = parseInt(req.body.id);
	} catch {
		res.status(406).json("Id not provided");
	}

	if (databaseConnector.getTextBlockList().find((item) => item.id === deleteId) === undefined) return res.status(406).json("TextBlock does not exist");

	if (!databaseConnector.deleteTextBlock(deleteId)) res.status(500).json("Unknown internal server error");
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
	if (newHorse.image !== null && !databaseConnector.getImageList().find((item) => item.image === newHorse.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.createHorse(newHorse)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.patch("/horse", (req, res) => {
	let updatedHorse = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(updatedHorse, "name") ||
		!Object.prototype.hasOwnProperty.call(updatedHorse, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedHorse, "images")
	)
		return res.status(406).json("Updated horse object lacks mandatory fields");

	if (databaseConnector.getHorseList().find((item) => item.name === updatedHorse.name) === undefined)
		return res.status(406).json("Horse with given name does not exist");
	for (const image of updatedHorse.images) {
		if (!databaseConnector.getImageList().find((item) => item.image === image)) return res.status(406).json("One of images does not exist");
	}

	if (!databaseConnector.updateHorse(updatedHorse)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.delete("/horse", (req, res) => {
	let deleteName;
	try {
		deleteName = req.body.name;
		if (deleteName === null || deleteName === "" || deleteName === undefined) throw Error();
	} catch {
		return res.status(406).json("Name not provided");
	}

	if (databaseConnector.getHorseList().find((item) => item.name === deleteName) === undefined)
		return res.status(406).json("Horse with given name does not exist");

	if (!databaseConnector.deleteHorse(deleteName)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.get("/trainer", (req, res) => {
	return res.json(databaseConnector.getTrainerList());
});

router.post("/trainer", (req, res) => {
	let newTrainer = req.body;

	if (!Object.prototype.hasOwnProperty.call(newTrainer, "name") || !Object.prototype.hasOwnProperty.call(newTrainer, "description"))
		return res.status(406).json("New trainer object lacks mandatory fields");

	if (newTrainer.name === null || newTrainer.name === "" || newTrainer.name === undefined) return res.status(406).json("Name not correct");
	if (databaseConnector.getTrainerList().find((item) => item.name === newTrainer.name)) return res.status(406).json("Name taken");
	if (newTrainer.image !== null && !databaseConnector.getImageList().find((item) => item.image === newTrainer.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.createTrainer(newTrainer)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.patch("/trainer", (req, res) => {
	let updatedTrainer = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(updatedTrainer, "name") ||
		!Object.prototype.hasOwnProperty.call(updatedTrainer, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedTrainer, "images")
	)
		return res.status(406).json("Updated trainer object lacks mandatory fields");

	if (databaseConnector.getTrainerList().find((item) => item.name === updatedTrainer.name) === undefined)
		return res.status(406).json("Trainer with given name does not exist");
	for (const image of updatedTrainer.images) {
		if (!databaseConnector.getImageList().find((item) => item.image === image)) return res.status(406).json("One of images does not exist");
	}

	if (!databaseConnector.updateTrainer(updatedTrainer)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.delete("/trainer", (req, res) => {
	let deleteName;
	try {
		deleteName = req.body.name;
		if (deleteName === null || deleteName === "" || deleteName === undefined) throw Error();
	} catch {
		return res.status(406).json("Name not provided");
	}

	if (databaseConnector.getTrainerList().find((item) => item.name === deleteName) === undefined)
		return res.status(406).json("Trainer with given name does not exist");

	if (!databaseConnector.deleteTrainer(deleteName)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.get("/offer", (req, res) => {
	return res.json(databaseConnector.getOfferList());
});

router.post("/offer", (req, res) => {
	let newOffer = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(newOffer, "name") ||
		!Object.prototype.hasOwnProperty.call(newOffer, "forWhom") ||
		!Object.prototype.hasOwnProperty.call(newOffer, "description") ||
		!Object.prototype.hasOwnProperty.call(newOffer, "proposedPrice")
	)
		return res.status(406).json("New offer object lacks mandatory fields");

	if (newOffer.name === null || newOffer.name === "" || newOffer.name === undefined) return res.status(406).json("Name not correct");
	if (databaseConnector.getOfferList().find((item) => item.name === newOffer.name)) return res.status(406).json("Name taken");

	if (!databaseConnector.createOffer(newOffer)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.patch("/offer", (req, res) => {
	let updatedOffer = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(updatedOffer, "name") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "forWhom") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "proposedPrice") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "images")
	)
		return res.status(406).json("Updated offer object lacks mandatory fields");

	if (databaseConnector.getOfferList().find((item) => item.name === updatedOffer.name) === undefined)
		return res.status(406).json("Offer with given name does not exist");
	for (const image of updatedOffer.images) {
		if (!databaseConnector.getImageList().find((item) => item.image === image)) return res.status(406).json("One of images does not exist");
	}

	if (!databaseConnector.updateOffer(updatedOffer)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.delete("/offer", (req, res) => {
	let deleteName;
	try {
		deleteName = req.body.name;
		if (deleteName === null || deleteName === "" || deleteName === undefined) throw Error();
	} catch {
		return res.status(406).json("Name not provided");
	}

	if (databaseConnector.getOfferList().find((item) => item.name === deleteName) === undefined)
		return res.status(406).json("Offer with given name does not exist");

	if (!databaseConnector.deleteOffer(deleteName)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.get("/priceList", (req, res) => {
	return res.json(databaseConnector.getPriceList());
});

router.post("/price", (req, res) => {
	let newPrice = req.body;

	if (!Object.prototype.hasOwnProperty.call(newPrice, "name") || !Object.prototype.hasOwnProperty.call(newPrice, "price"))
		return res.status(406).json("New price object lacks mandatory fields");

	if (newPrice.name === null || newPrice.name === "" || newPrice.name === undefined) return res.status(406).json("Name not correct");
	if (databaseConnector.getPriceList().find((item) => item.name === newPrice.name)) return res.status(406).json("Name taken");

	if (!databaseConnector.createPrice(newPrice)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.patch("/price", (req, res) => {
	let updatedPrice = req.body;

	if (
		!Object.prototype.hasOwnProperty.call(updatedPrice, "id") ||
		!Object.prototype.hasOwnProperty.call(updatedPrice, "name") ||
		!Object.prototype.hasOwnProperty.call(updatedPrice, "price")
	)
		return res.status(406).json("Updated price object lacks mandatory fields");

	updatedPrice.id = parseInt(updatedPrice.id);

	if (databaseConnector.getPriceList().find((item) => item.id === updatedPrice.id) === undefined)
		return res.status(406).json("Price with given id does not exist");

	if (!databaseConnector.updatePrice(updatedPrice)) res.status(500).json("Unknown internal server error");
	return res.sendStatus(200);
});

router.delete("/price", (req, res) => {
	let deleteId;
	try {
		deleteId = parseInt(req.body.id);
	} catch {
		return res.status(406).json("Name not provided");
	}

	if (databaseConnector.getPriceList().find((item) => item.id === deleteId) === undefined) return res.status(406).json("Price with given id does not exist");

	databaseConnector.deletePrice(deleteId).then((result) => {
		//TODO rewrite this everywhere, move to files?
		return result ? res.sendStatus(200) : res.status(500).json("Unknown internal server error");
	});
});

router.get("/image", (req, res) => {
	return res.json(databaseConnector.getImageList());
});

router.get("/image/:name", (req, res) => {
	var files = fs.readdirSync(path.join(__dirname, "../../public/api/image/"));
	console.log(files);
	res.redirect(databaseConnector.DUMMY_IMAGE_PATH);
});

router.post("/image", (req, res) => {
	let images = req.files.images;
	if (!Array.isArray(images)) images = [images];

	if (images === null || images === undefined) return res.status(406).json("No images sent");

	for (const image of images) {
		if (databaseConnector.getImageList().find((item) => item.image === image.name)) return res.status(406).json("One of images already exists");
	}

	databaseConnector.uploadImages(images).then((result) => {
		return result ? res.sendStatus(200) : res.status(500).json("Unknown internal server error");
	});
});

router.patch("/image", (req, res) => {
	let imageList = req.body;
	console.log(imageList);
	if (imageList === null || imageList === undefined) return res.status(406).json("Image list not sent");

	for (const image of imageList) {
		if (!Object.prototype.hasOwnProperty.call(image, "image") || !Object.prototype.hasOwnProperty.call(image, "visible"))
			return res.status(406).json("One of updated images lacks mandatory fields");
		if (!databaseConnector.getImageList().find((item) => item.image === image.image)) return res.status(406).json("One of images does not exist");
	}

	databaseConnector.updateImages(imageList).then((result) => {
		return result ? res.sendStatus(200) : res.status(500).json("Unknown internal server error");
	});
});

router.delete("/image", (req, res) => {
	const images = req.body;

	if (images === null || images === undefined || images.length === 0) return res.status(406).json("No images sent");

	databaseConnector.deleteImages(images).then((result) => {
		return result ? res.sendStatus(200) : res.status(500).json("Unknown internal server error");
	});
});

module.exports = router;
