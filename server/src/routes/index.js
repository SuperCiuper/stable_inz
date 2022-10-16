var express = require("express");
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get("/index", function (req, res, next) {
	res.render("index", { title: "Praca inżynierska - server" });
});

module.exports = router;
