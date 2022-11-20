const express = require("express");
const router = express.Router();
const path = require("path");

router.get("/*", (req, res) => {
	res.sendFile(path.join(__dirname, "../../../frontend/build/index.html"));
});

/* GET home page if frontend build not loaded */
router.get("/", (req, res) => {
	res.render("error", { title: "Frontend not loaded" });
});

module.exports = router;
