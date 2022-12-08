/* disables incorrect eslint error on err */
/* global err:writeable */

const express = require("express");
const router = express.Router();
const fileUpload = require("express-fileupload");

const authRouter = require("./authenticator");
const databaseConnector = require("../databaseConnector");
const { verifyToken } = require("../middleware/authorizator");

router.use(fileUpload());
router.use("/auth", authRouter);

router.post("*", [verifyToken]);
router.put("*", [verifyToken]);
router.delete("*", [verifyToken]);

const checkNameFree = (name, array) => {
  if (array.some((item) => item.name === name)) {
    return "Name taken";
  }
  return false;
};

const checkName = (name, array, itemName) => {
  if (array.every((item) => item.name !== name)) {
    return `${itemName} with given name does not exist`;
  }
  return false;
};

const checkId = (id, array, itemName) => {
  if (array.every((item) => item.id !== id)) {
    return `${itemName} with given id does not exist`;
  }
  return false;
};

const checkImage = (image) => {
  if (databaseConnector.getImageList().every((item) => item.image !== image)) {
    console.log(image);
    return "Image does not exist";
  }
  return false;
};

const checkImages = (images) => {
  const imageList = databaseConnector.getImageList();
  if (images.some((image) => imageList.every((item) => item.image !== image))) {
    console.log(images);
    return "One of images does not exist";
  }
  return false;
};

router.get("/", (req, res) => {
  res.render("index", { title: "Stajnia Malta - REST API" });
});

router.get("/colors", (req, res) => {
  return res.json(databaseConnector.getColors());
});

router.put("/colors", (req, res) => {
  const updatedColors = req.body;
  if (
    !updatedColors ||
    !updatedColors.backgroundMain ||
    !updatedColors.backgroundContent ||
    !updatedColors.panel ||
    !updatedColors.header ||
    !updatedColors.detail ||
    !updatedColors.button ||
    !updatedColors.highlight
  )
    return res.status(406).json("Mandatory fields not set");

  const colorHexRegex = new RegExp("#[0-9a-f]{6}");
  if (!Object.values(updatedColors).every((value) => colorHexRegex.test(value))) {
    return res.status(406).json("At least one value is not color hex");
  }
  databaseConnector.updateColors(updatedColors).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.get("/contactInfo", (req, res) => {
  return res.json(databaseConnector.getContactInfo());
});

router.put("/contactInfo", (req, res) => {
  const updatedContactInfo = req.body;
  if (
    !updatedContactInfo ||
    !updatedContactInfo.city ||
    !updatedContactInfo.gmapLat ||
    !updatedContactInfo.gmapLng ||
    !updatedContactInfo.mail ||
    !updatedContactInfo.phoneNumber ||
    !updatedContactInfo.street ||
    !updatedContactInfo.zipCode
  )
    return res.status(406).json("Mandatory fields not set");

  databaseConnector.updateContactInfo(updatedContactInfo).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.get("/textBlocks", (req, res) => {
  return res.json(databaseConnector.getTextBlockList());
});

router.post("/textBlocks", (req, res) => {
  const newTextBlock = req.body;
  if (!newTextBlock || !newTextBlock.description || !Object.prototype.hasOwnProperty.call(newTextBlock, "image"))
    return res.status(406).json("Mandatory fields not set");

  databaseConnector.createTextBlock(newTextBlock).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(201);
  });
});

router.put("/textBlocks", (req, res) => {
  let updatedTextBlock = req.body;
  if (
    !updatedTextBlock ||
    !updatedTextBlock.id ||
    !updatedTextBlock.description ||
    !Object.prototype.hasOwnProperty.call(updatedTextBlock, "image")
  )
    return res.status(406).json("Mandatory fields not set");
  updatedTextBlock.id = parseInt(updatedTextBlock.id);

  if ((err = checkId(updatedTextBlock.id, databaseConnector.getTextBlockList(), "Text block")))
    return res.status(406).json(err);

  if (updatedTextBlock.image && (err = checkImage(updatedTextBlock.image))) return res.status(406).json(err);

  databaseConnector.updateTextBlock(updatedTextBlock).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.delete("/textBlocks", (req, res) => {
  if (!req.body || !req.body.id) return res.status(406).json("Id not provided");
  const deleteId = parseInt(req.body.id);

  if ((err = checkId(deleteId, databaseConnector.getTextBlockList(), "Text block"))) return res.status(406).json(err);

  databaseConnector.deleteTextBlock(deleteId).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.get("/horses", (req, res) => {
  return res.json(databaseConnector.getHorseList());
});

router.post("/horses", (req, res) => {
  const newHorse = req.body;
  if (!newHorse || !newHorse.name || !newHorse.description || !newHorse.image)
    return res.status(406).json("Mandatory fields not set");

  if ((err = checkNameFree(newHorse.name, databaseConnector.getHorseList()))) return res.status(406).json(err);
  if ((err = checkImage(newHorse.image))) return res.status(406).json(err);

  databaseConnector.createHorse(newHorse).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(201);
  });
});

router.put("/horses", (req, res) => {
  const updatedHorse = req.body;
  if (
    !updatedHorse ||
    !updatedHorse.name ||
    !updatedHorse.description ||
    !updatedHorse.images ||
    updatedHorse.images.length === 0
  )
    return res.status(406).json("Mandatory fields not set");

  if ((err = checkName(updatedHorse.name, databaseConnector.getHorseList(), "Horse"))) return res.status(406).json(err);
  if ((err = checkImages(updatedHorse.images))) return res.status(406).json(err);

  databaseConnector.updateHorse(updatedHorse).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.delete("/horses", (req, res) => {
  if (!req.body || !req.body.name) return res.status(406).json("Name not provided");
  const deleteName = req.body.name;

  if ((err = checkName(deleteName, databaseConnector.getHorseList(), "Horse"))) return res.status(406).json(err);

  databaseConnector.deleteHorse(deleteName).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.get("/trainers", (req, res) => {
  return res.json(databaseConnector.getTrainerList());
});

router.post("/trainers", (req, res) => {
  const newTrainer = req.body;
  if (!newTrainer || !newTrainer.name || !newTrainer.description || !newTrainer.image)
    return res.status(406).json("Mandatory fields not set");

  if ((err = checkNameFree(newTrainer.name, databaseConnector.getTrainerList()))) return res.status(406).json(err);

  if ((err = checkImage(newTrainer.image))) return res.status(406).json(err);

  databaseConnector.createTrainer(newTrainer).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(201);
  });
});

router.put("/trainers", (req, res) => {
  const updatedTrainer = req.body;
  if (
    !updatedTrainer ||
    !updatedTrainer.name ||
    !updatedTrainer.description ||
    !updatedTrainer.images ||
    updatedTrainer.images.length === 0
  )
    return res.status(406).json("Mandatory fields not set");

  if ((err = checkName(updatedTrainer.name, databaseConnector.getTrainerList(), "Trainer")))
    return res.status(406).json(err);

  if ((err = checkImages(updatedTrainer.images))) return res.status(406).json(err);

  databaseConnector.updateTrainer(updatedTrainer).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.delete("/trainers", (req, res) => {
  if (!req.body || !req.body.name) return res.status(406).json("Name not provided");
  const deleteName = req.body.name;

  if ((err = checkName(deleteName, databaseConnector.getTrainerList(), "Trainer"))) return res.status(406).json(err);

  databaseConnector.deleteTrainer(deleteName).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.get("/offers", (req, res) => {
  return res.json(databaseConnector.getOfferList());
});

router.post("/offers", (req, res) => {
  const newOffer = req.body;
  if (!newOffer || !newOffer.name || !newOffer.forWhom || !newOffer.description || !newOffer.proposedPrice)
    return res.status(406).json("Mandatory fields not set");

  if ((err = checkNameFree(newOffer.name, databaseConnector.getOfferList()))) return res.status(406).json(err);

  databaseConnector.createOffer(newOffer).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(201);
  });
});

router.put("/offers", (req, res) => {
  let updatedOffer = req.body;
  if (
    !updatedOffer ||
    !updatedOffer.id ||
    !updatedOffer.name ||
    !updatedOffer.forWhom ||
    !updatedOffer.description ||
    !updatedOffer.proposedPrice ||
    !updatedOffer.images
  )
    return res.status(406).json("Mandatory fields not set");
  updatedOffer.id = parseInt(updatedOffer.id);

  if ((err = checkId(updatedOffer.id, databaseConnector.getOfferList(), "Offer"))) return res.status(406).json(err);
  if ((err = checkImages(updatedOffer.images))) return res.status(406).json(err);

  databaseConnector.updateOffer(updatedOffer).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.delete("/offers", (req, res) => {
  if (!req.body || !req.body.id) return res.status(406).json("Id not provided");
  const deleteId = parseInt(req.body.id);

  if ((err = checkId(deleteId, databaseConnector.getOfferList(), "Offer"))) return res.status(406).json(err);

  databaseConnector.deleteOffer(deleteId).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.get("/prices", (req, res) => {
  return res.json(databaseConnector.getPriceList());
});

router.post("/prices", (req, res) => {
  const newPrice = req.body;
  if (!newPrice || !newPrice.name || !newPrice.price) return res.status(406).json("Mandatory fields not set");

  if ((err = checkNameFree(newPrice.name, databaseConnector.getPriceList()))) return res.status(406).json(err);

  databaseConnector.createPrice(newPrice).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(201);
  });
});

router.put("/prices", (req, res) => {
  let updatedPrice = req.body;
  if (!updatedPrice || !updatedPrice.id || !updatedPrice.name || !updatedPrice.price)
    return res.status(406).json("Mandatory fields not set");
  updatedPrice.id = parseInt(updatedPrice.id);

  if ((err = checkId(updatedPrice.id, databaseConnector.getPriceList(), "Price"))) return res.status(406).json(err);

  databaseConnector.updatePrice(updatedPrice).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.delete("/prices", (req, res) => {
  if (!req.body || !req.body.id) return res.status(406).json("Id not provided");
  const deleteId = parseInt(req.body.id);

  if ((err = checkId(deleteId, databaseConnector.getPriceList(), "Price"))) return res.status(406).json(err);

  databaseConnector.deletePrice(deleteId).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.get("/images", (req, res) => {
  return res.json(databaseConnector.getImageList());
});

router.get("/images/:name", (req, res) => {
  res.redirect(databaseConnector.DUMMY_IMAGE_PATH);
});

router.post("/images", (req, res) => {
  if (!req.files || !req.files.images) return res.status(406).json("No images sent");
  let images = req.files.images;

  if (!Array.isArray(images)) images = [images];
  else if (images.length === 0) return res.status(406).json("Image list not sent");

  const imageList = databaseConnector.getImageList();
  if (images.some((image) => imageList.some((item) => item.image === image.name)))
    return res.status(406).json("One of images already exists");

  databaseConnector.uploadImages(images).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(201);
  });
});

router.put("/images", (req, res) => {
  let images = req.body;
  if (!images || images.length === 0) return res.status(406).json("Image list not sent");

  const imageList = databaseConnector.getImageList();
  for (const image of images) {
    if (!image.image || !(typeof image.visible === "boolean"))
      return res.status(406).json("One of updated images lacks mandatory fields");

    if (imageList.every((item) => item.image !== image.image)) {
      console.log(image);
      return res.status(406).json("One of images does not exist");
    }
  }

  databaseConnector.updateImages(images).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

router.delete("/images", (req, res) => {
  const deleteImageNames = req.body;
  if (!deleteImageNames || deleteImageNames.length === 0) return res.status(406).json("No images sent");

  if ((err = checkImages(deleteImageNames))) return res.status(406).json(err);

  databaseConnector.deleteImages(deleteImageNames).then((err) => {
    return err ? res.status(500).json(err) : res.sendStatus(200);
  });
});

module.exports = router;
