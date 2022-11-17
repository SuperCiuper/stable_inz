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

const valuesPrecheck = (body) => {
	if (Object.values(body).some((item) => !item)) {
		console.log("At least one property not set", body);
		return "At least one property not set";
	}
	return "";
};

const checkNameFree = (name, array) => {
	if (array.some((item) => item.name === name)) {
		return "Name taken";
	}
	return "";
};

const checkName = (name, array, itemName) => {
	if (array.every((item) => item.name !== name)) {
		return `${itemName} with given name does not exist`;
	}
	return "";
};

const checkId = (id, array, itemName) => {
	if (array.every((item) => item.id !== id)) {
		return `${itemName} with given id does not exist`;
	}
	return "";
};

const checkImage = (image) => {
	console.log(image);
	console.log(databaseConnector.getImageList());
	if (databaseConnector.getImageList().every((item) => item.image !== image)) {
		console.log(image);
		return "Image does not exist";
	}
	return "";
};

const checkImages = (images) => {
	let imageList = databaseConnector.getImageList();
	if (images.some((image) => imageList.every((item) => item.image !== image))) {
		return "One of images does not exist";
	}
	return "";
};

router.get("/", (req, res) => {
	res.render("index", { title: "Praca inżynierska - REST API" });
});

router.get("/colorInfo", (req, res) => {
	return res.json(databaseConnector.getColorInfo());
});

// DONE
router.patch("/colorInfo", (req, res) => {
	let updatedColorInfo = req.body;
	if (
		!Object.prototype.hasOwnProperty.call(updatedColorInfo, "backgroundMain") ||
		!Object.prototype.hasOwnProperty.call(updatedColorInfo, "backgroundContent") ||
		!Object.prototype.hasOwnProperty.call(updatedColorInfo, "panel") ||
		!Object.prototype.hasOwnProperty.call(updatedColorInfo, "header") ||
		!Object.prototype.hasOwnProperty.call(updatedColorInfo, "detail") ||
		!Object.prototype.hasOwnProperty.call(updatedColorInfo, "button") ||
		!Object.prototype.hasOwnProperty.call(updatedColorInfo, "highlight")
	)
		return res.status(406).json("Color info object properties does not match");

	let precheckResult = valuesPrecheck(updatedColorInfo); // TODO check if needed
	if (precheckResult !== "") return res.status(406).json(precheckResult);

	const colorHexRegex = new RegExp("#[0-9a-f]{6}");
	if (!Object.values(updatedColorInfo).every((value) => colorHexRegex.test(value))) {
		return res.status(406).json("At least one value is not color hex");
	}
	databaseConnector.updateColorInfo(updatedColorInfo).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
});

router.get("/contactInfo", (req, res) => {
	return res.json(databaseConnector.getContactInfo());
});

// DONE
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

	let precheckResult = valuesPrecheck(updatedContactInfo);
	if (precheckResult !== "") return res.status(406).json(precheckResult);

	databaseConnector.updateContactInfo(updatedContactInfo).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
});

router.get("/textBlock", (req, res) => {
	return res.json(databaseConnector.getTextBlockList());
});

// DONE
router.post("/textBlock", (req, res) => {
	let newTextBlock = req.body;

	if (!Object.prototype.hasOwnProperty.call(newTextBlock, "description") || !Object.prototype.hasOwnProperty.call(newTextBlock, "image"))
		return res.status(406).json("Object lacks mandatory fields");

	let precheckResult = valuesPrecheck({ description: newTextBlock.description });
	if (precheckResult !== "") return res.status(406).json(precheckResult);

	let resultImage = checkImage(newTextBlock.image);
	if (resultImage !== "") return res.status(406).json(resultImage);

	databaseConnector.createTextBlock(newTextBlock).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
});

// DONE
router.patch("/textBlock", (req, res) => {
	let updatedTextBlock = req.body;
	if (
		!Object.prototype.hasOwnProperty.call(updatedTextBlock, "id") ||
		!Object.prototype.hasOwnProperty.call(updatedTextBlock, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedTextBlock, "image")
	)
		return res.status(406).json("Object lacks mandatory fields");

	let precheckResult = valuesPrecheck({ id: updatedTextBlock.id, description: updatedTextBlock.description });
	if (precheckResult !== "") return res.status(406).json(precheckResult);

	updatedTextBlock.id = parseInt(updatedTextBlock.id);
	let resultId = checkId(updatedTextBlock.id, databaseConnector.getTextBlockList());
	if (resultId !== "") return res.status(406).json(resultId);

	let resultImage = checkImage(updatedTextBlock.image, true);
	if (resultImage !== "") return res.status(406).json(resultImage);

	databaseConnector.updateTextBlock(updatedTextBlock).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
});

// DONE
router.delete("/textBlock", (req, res) => {
	let precheckResult = valuesPrecheck(req.body);
	if (precheckResult !== "") return res.status(406).json("Id not provided");

	deleteId = parseInt(req.body.id);
	let resultId = checkId(updatedTextBlock.id, databaseConnector.getTextBlockList());
	if (resultId !== "") return res.status(406).json(resultId);

	databaseConnector.deleteTextBlock(deleteId).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
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

	let precheckResult = valuesPrecheck(newHorse);
	if (precheckResult !== "") return res.status(406).json(precheckResult);

	let resultNameFree = checkNameFree(newHorse.name, databaseConnector.getHorseList());
	if (resultNameFree !== "") return res.status(406).json(resultNameFree);

	let resultImage = checkImage(newHorse.image);
	if (resultImage !== "") return res.status(406).json(resultImage);

	databaseConnector.createHorse(newHorse).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
});

// DONE
router.patch("/horse", (req, res) => {
	let updatedHorse = req.body;
	if (
		!Object.prototype.hasOwnProperty.call(updatedHorse, "name") ||
		!Object.prototype.hasOwnProperty.call(updatedHorse, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedHorse, "images")
	)
		return res.status(406).json("Updated horse object lacks mandatory fields");

	let precheckResult = valuesPrecheck(updatedHorse);
	if (precheckResult !== "") return res.status(406).json(precheckResult);

	let resultName = checkName(updatedHorse.name, databaseConnector.getHorseList());
	if (resultName !== "") return res.status(406).json(resultName);

	let resultImages = checkImages(updatedHorse.images);
	if (resultImages !== "") return res.status(406).json(resultImages);

	databaseConnector.updateHorse(updatedHorse).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
});

// DONE
router.delete("/horse", (req, res) => {
	let precheckResult = valuesPrecheck(req.body);
	if (precheckResult !== "") return res.status(406).json("Name not provided");

	let deleteName = req.body;
	let resultName = checkName(deleteName, databaseConnector.getHorseList());
	if (resultName !== "") return res.status(406).json(resultName);

	databaseConnector.deleteHorse(deleteName).then((result) => {
		return result.success ? res.sendStatus(200) : res.status(500).json(result.message);
	});
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

	if (updatedHorse.images.length !== 0) return res.status(406).json("No images sent");
	let imageList = databaseConnector.getImageList();
	if (!updatedTrainer.images.every((image) => imageList.some((item) => item.image === image))) return res.status(406).json("One of images does not exist");

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
		!Object.prototype.hasOwnProperty.call(updatedOffer, "id") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "name") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "forWhom") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "description") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "proposedPrice") ||
		!Object.prototype.hasOwnProperty.call(updatedOffer, "images")
	)
		return res.status(406).json("Updated offer object lacks mandatory fields");

	updatedPrice.id = parseInt(updatedPrice.id);

	if (databaseConnector.getOfferList().find((item) => item.id === updatedOffer.id) === undefined)
		return res.status(406).json("Offer with given id does not exist");

	let imageList = databaseConnector.getImageList();
	if (updatedHorse.images.length !== 0 && !updatedOffer.images.every((image) => imageList.find((item) => item.image === image)))
		return res.status(406).json("One of images does not exist");

	// for (const image of updatedOffer.images) {
	// 	if (!databaseConnector.getImageList().find((item) => item.image === image)) return res.status(406).json("One of images does not exist");
	// }

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
		return res.status(406).json("Id not provided");
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

	if (images === null || images === undefined || images.length === 0) return res.status(406).json("No images sent");
	let imageList = databaseConnector.getImageList();
	if (images.every((image) => imageList.some((item) => item.image !== image.name))) return res.status(406).json("One of images already exists");

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
