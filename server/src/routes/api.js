var express = require("express");
var router = express.Router();
var databaseConnector = require("../databaseConnector");
const path = require("path");
const fs = require("fs");

var apiaryList = [];

router.get("/", function (req, res, next) {
	res.render("index", { title: "Apiary API" });
});

router.get("/mainInfo", (req, res, next) => {
	return res.json(databaseConnector.getMainInfo());
});

router.get("/textBlock", (req, res, next) => {
	return res.json(databaseConnector.getTextBlockList());
});

router.get("/image", (req, res, next) => {
	console.log(databaseConnector.getImageList());
	return res.json(databaseConnector.getImageList());
});

router.get("/horse", (req, res, next) => {
	return res.json(databaseConnector.getHorseList());
});

router.post("/horse", (req, res, next) => {
	let newHorse = req.body;
	newHorse.image = parseInt(newHorse.image);

	if (!newHorse.hasOwnProperty("name") || !newHorse.hasOwnProperty("description") || !newHorse.hasOwnProperty("image"))
		return res.status(406).json("Object lacks mandatory fields");
	if (newHorse.getHorseList().find((item) => item.name === newHorse.name)) return res.status(406).json("Name taken");
	if (newHorse.image != null && !databaseConnector.getImageList().find((item) => item.id === newHorse.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.createHorse(newHorse)) res.status(500).json("Unknown error during code generation");
	res.status(200);
});

router.patch("/horse/:name", (req, res, next) => {
	let updatedHorse = req.body;
	newHorse.image = parseInt(newHorse.image);
	updatedHorse.name = req.params.name;

	if (!updatedHorse.hasOwnProperty("description") || !updatedHorse.hasOwnProperty("image")) return res.status(406).json("Object lacks mandatory fields");
	if (newHorse.image != null && !databaseConnector.getImageList().find((item) => item.id === updatedHorse.image))
		return res.status(406).json("Image does not exist");

	if (!databaseConnector.updatHorse(updatedHorse)) res.status(500).json("Unknown error during code generation");
	res.status(200);
});

router.delete("/horse/:name", (req, res, next) => {
	return res.json(databaseConnector.getHorseList());
});

router.get("/offer", (req, res, next) => {
	return res.json(databaseConnector.getOfferList());
});

router.post("/apiaries", (req, res, next) => {
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
