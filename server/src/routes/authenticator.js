const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const databaseConnector = require("../databaseConnector");
const { verifyToken } = require("../middleware/authorizator");

const SALT_ROUNDS = 16;
const EXPIRATION_TIME = 60 * 60 * 1000; /* 1 hour */

router.get("/", (req, res) => {
  res.render("index", { title: "Praca inżynierska - AUTH" });
});

router.post("/login", async (req, res) => {
  try {
    if (!req.body || !req.body.password) return res.status(406).json("Password not sent");
    const password = req.body.password;

    const passwordIsValid = bcrypt.compareSync(password, await databaseConnector.getPassword());
    if (!passwordIsValid) return res.status(401).json("Invalid Password!");

    const token = jwt.sign({}, process.env.PRIVATE_KEY, {
      expiresIn: EXPIRATION_TIME,
    });

    return res.status(200).json({
      accessToken: token,
      expiresIn: EXPIRATION_TIME,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Internal server error, contact maintainer");
  }
});

router.patch("/update", [verifyToken], (req, res) => {
  if (!req.body || !req.body.password) return res.status(406).json("Password not sent");
  const password = req.body.password;
  const newPasswordHash = bcrypt.hashSync(password, SALT_ROUNDS);

  databaseConnector.updatePassword(newPasswordHash).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

module.exports = router;
