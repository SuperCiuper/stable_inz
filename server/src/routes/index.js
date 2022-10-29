var express = require("express");
var router = express.Router();
const path = require("path");

router.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "../../../frontend/build/index.html"));
});

/* GET home page. */
router.get("/", (req, res) => {
	res.render("error", { title: "Frontend not loaded" });
});

module.exports = router;
