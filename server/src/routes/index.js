var express = require("express");
var router = express.Router();
const path = require("path");

/* GET home page. */
router.get("/index", function (req, res, next) {
	res.render("index", { title: "Recruitment task server" });
});

router.get("/*", function (req, res, next) {
	res.sendFile(path.join(__dirname, "../../../frontend/build", "index.html"));
});

module.exports = router;
