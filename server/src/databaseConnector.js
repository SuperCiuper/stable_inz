const { Deta } = require("deta");
const Pool = require("pg").Pool;

const path = require("path");
const fs = require("fs");

const pool = new Pool();
const detaIntance = Deta(process.env.DETA_KEY);
const detaImageDrive = detaIntance.Drive("images");

const INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error, contact maintainer";
const IMAGE_PATH = path.join(__dirname, "../public/api/image/");
const DUMMY_IMAGE = "dummyImage.jpg";
const DUMMY_IMAGE_PATH = "/api/image/" + DUMMY_IMAGE;

var colorInfo = {};
var contactInfo = {};
var textBlockList = [];
var imageList = [];
var horseList = [];
var trainerList = [];
var offerList = [];
var priceList = [];

const getColorInfo = () => {
  return colorInfo;
};

const updateColorInfo = async (updatedColorInfo) => {
  try {
    await pool.query(
      "UPDATE main_info SET background_main_rgb = $1, background_content_rgb = $2, panel_rgb = $3, header_rgb = $4, details_rgb = $5, button_rgb = $6, highlight_rgb = $7 WHERE id = true",
      [
        updatedColorInfo.backgroundMain,
        updatedColorInfo.backgroundContent,
        updatedColorInfo.panel,
        updatedColorInfo.header,
        updatedColorInfo.detail,
        updatedColorInfo.button,
        updatedColorInfo.highlight,
      ]
    );
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const getContactInfo = () => {
  return contactInfo;
};

const updateContactInfo = async (updatedContactInfo) => {
  try {
    await pool.query(
      "UPDATE contact_info SET street = $1, zip_code = $2, city = $3, phone_number = $4, mail = $5, gmap_lat = $6, gmap_lng = $7 WHERE id = true",
      [
        updatedContactInfo.street,
        updatedContactInfo.zipCode,
        updatedContactInfo.city,
        updatedContactInfo.phoneNumber,
        updatedContactInfo.mail,
        updatedContactInfo.gmapLat,
        updatedContactInfo.gmapLng,
      ]
    );
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const getTextBlockList = () => {
  return textBlockList;
};

const createTextBlock = async (newTextBlock) => {
  try {
    await pool.query("INSERT INTO main_page_text_block (description, image_name) VALUES ($1, $2)", [
      newTextBlock.description,
      newTextBlock.image,
    ]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const updateTextBlock = async (updatedTextBlock) => {
  try {
    await pool.query("UPDATE main_page_text_block SET image_name = $2, description = $3 WHERE id = $1", [
      updatedTextBlock.id,
      updatedTextBlock.image,
      updatedTextBlock.description,
    ]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const deleteTextBlock = async (textBlockId) => {
  try {
    await pool.query("DELETE FROM main_page_text_block WHERE id = $1", [textBlockId]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const getHorseList = () => {
  return horseList;
};

const createHorse = async (newHorse) => {
  try {
    await pool.query("INSERT INTO horse VALUES ($1, $2, $3)", [newHorse.name, newHorse.image, newHorse.description]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const updateHorse = async (updatedHorse) => {
  try {
    await pool.query("UPDATE horse SET profile_image_name = $2, description = $3 WHERE name = $1", [
      updatedHorse.name,
      updatedHorse.images[0],
      updatedHorse.description,
    ]);
    await pool.query("DELETE FROM image_horse_junction WHERE horse_name = $1", [updatedHorse.name]);
    updatedHorse.images.shift();

    if (updatedHorse.images.length !== 0) {
      let insertImagesQuery = "INSERT INTO image_horse_junction VALUES";
      updatedHorse.images.map((image, index) => {
        insertImagesQuery += index === 0 ? ` ($${index + 2}, $1)` : `, ($${index + 2}, $1)`;
      });
      await pool.query(insertImagesQuery, [updatedHorse.name, ...updatedHorse.images]);
    }
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const deleteHorse = async (horseName) => {
  try {
    await pool.query("DELETE FROM horse WHERE name = $1", [horseName]);
    await pool.query("DELETE FROM image_horse_junction WHERE horse_name = $1", [horseName]);

    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const getTrainerList = () => {
  return trainerList;
};

const createTrainer = async (newTrainer) => {
  try {
    await pool.query("INSERT INTO trainer VALUES ($1, $2, $3)", [
      newTrainer.name,
      newTrainer.image,
      newTrainer.description,
    ]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const updateTrainer = async (updatedTrainer) => {
  try {
    await pool.query("UPDATE trainer SET profile_image_name = $2, description = $3 WHERE name = $1", [
      updatedTrainer.name,
      updatedTrainer.images[0],
      updatedTrainer.description,
    ]);
    await pool.query("DELETE FROM image_trainer_junction WHERE trainer_name = $1", [updatedTrainer.name]);
    updatedTrainer.images.shift();

    if (updatedTrainer.images.length !== 0) {
      let insertImagesQuery = "INSERT INTO image_trainer_junction VALUES";
      updatedTrainer.images.map((image, index) => {
        insertImagesQuery += index === 0 ? ` ($${index + 2}, $1)` : `, ($${index + 2}, $1)`;
      });
      await pool.query(insertImagesQuery, [updatedTrainer.name, ...updatedTrainer.images]);
    }
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const deleteTrainer = async (trainerName) => {
  try {
    await pool.query("DELETE FROM trainer WHERE name = $1", [trainerName]);
    await pool.query("DELETE FROM image_trainer_junction WHERE trainer_name = $1", [trainerName]);

    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const getOfferList = () => {
  return offerList;
};

const createOffer = async (newOffer) => {
  try {
    await pool.query("INSERT INTO offer (name, for_whom, description, proposed_price) VALUES ($1, $2, $3, $4)", [
      newOffer.name,
      newOffer.forWhom,
      newOffer.description,
      newOffer.proposedPrice,
    ]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const updateOffer = async (updatedOffer) => {
  console.log(updatedOffer);
  try {
    await pool.query("UPDATE offer SET name = $2, for_whom = $3, description = $4, proposed_price = $5 WHERE id = $1", [
      updatedOffer.id,
      updatedOffer.name,
      updatedOffer.forWhom,
      updatedOffer.description,
      updatedOffer.proposedPrice,
    ]);
    await pool.query("DELETE FROM image_offer_junction WHERE offer_id = $1", [updatedOffer.id]);

    if (updatedOffer.images.length !== 0) {
      let insertImagesQuery = "INSERT INTO image_offer_junction VALUES";
      updatedOffer.images.map((image, index) => {
        insertImagesQuery += index === 0 ? ` ($${index + 2}, $1)` : `, ($${index + 2}, $1)`;
      });
      await pool.query(insertImagesQuery, [updatedOffer.id, ...updatedOffer.images]);
    }
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const deleteOffer = async (offerId) => {
  try {
    await pool.query("DELETE FROM offer WHERE id = $1", [offerId]);
    await pool.query("DELETE FROM image_offer_junction WHERE offer_id = $1", [offerId]);

    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const getPriceList = () => {
  return priceList;
};

const createPrice = async (newPrice) => {
  try {
    await pool.query("INSERT INTO price_list (name, price) VALUES ($1, $2)", [newPrice.name, newPrice.price]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const updatePrice = async (updatedPrice) => {
  try {
    await pool.query("UPDATE price_list SET name = $2, price = $3 WHERE id = $1", [
      updatedPrice.id,
      updatedPrice.name,
      updatedPrice.price,
    ]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const deletePrice = async (priceId) => {
  try {
    await pool.query("DELETE FROM price_list WHERE id = $1", [priceId]);
    return updateFromDatabase();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const getImageList = () => {
  return imageList;
};

const uploadImages = async (images) => {
  const err = await Promise.all(
    images.map(async (newImage) => {
      try {
        await newImage.mv(IMAGE_PATH + newImage.name);

        await pool.query("INSERT INTO image (name, visible) VALUES ($1, true)", [newImage.name]);
        await detaImageDrive.put(newImage.name, { path: IMAGE_PATH + newImage.name });

        console.log(`Saved ${newImage.name}`);
        return false;
      } catch (err) {
        console.error(err);
        return true;
      }
    })
  );
  if (err.some((item) => item)) return INTERNAL_SERVER_ERROR_MESSAGE;

  return updateFromDatabase();
};

const updateImages = async (images) => {
  const err = await Promise.all(
    images.map(async (updatedImage) => {
      try {
        await pool.query("UPDATE image SET visible=$2 WHERE name=$1", [updatedImage.image, updatedImage.visible]);
        return false;
      } catch (err) {
        console.error(err);
        return true;
      }
    })
  );
  if (err.some((item) => item)) return INTERNAL_SERVER_ERROR_MESSAGE;

  return updateFromDatabase();
};

const deleteImages = async (images) => {
  const err = await Promise.all(
    images.map(async (deleteImage) => {
      try {
        await pool.query("DELETE FROM image WHERE name = $1", [deleteImage]);
        await detaImageDrive.delete(deleteImage);

        fs.unlinkSync(IMAGE_PATH + deleteImage);
        console.log(`Deleted ${deleteImage}`);

        return false;
      } catch (err) {
        console.error(err);
        return true;
      }
    })
  );
  if (err.some((item) => item)) return INTERNAL_SERVER_ERROR_MESSAGE;

  return updateFromDatabase();
};

const getPassword = async () => {
  try {
    const passwordHash = await pool
      .query("SELECT password_hash FROM main_info WHERE id = true")
      .then((res) => res.rows[0].password_hash);
    return passwordHash.toString();
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const updatePassword = async (newPasswordHash) => {
  try {
    await pool.query("UPDATE main_info SET password_hash = $1 WHERE id = true", [newPasswordHash]);
  } catch (err) {
    console.error(err);
    return INTERNAL_SERVER_ERROR_MESSAGE;
  }
};

const pullDeta = async () => {
  const err = await Promise.all(
    imageList.map(async (image) => {
      try {
        console.log(image);
        const blob = await detaImageDrive.get(image.image);
        const buffer = Buffer.from(await blob.arrayBuffer());

        if (fs.existsSync(IMAGE_PATH + image.image)) {
          fs.unlinkSync(IMAGE_PATH + image.image);
        }
        fs.writeFileSync(IMAGE_PATH + image.image, buffer);
        console.log(`Pulled ${image.image}`);

        return false;
      } catch (err) {
        console.error(err);
        return true;
      }
    })
  );
  if (err.some((item) => item)) return "Images not pulled from DETA, contact maintainer";
  return false;
};

const updateFromDatabase = async () => {
  try {
    colorInfo = await pool.query("SELECT * FROM color_info_view").then((res) => res.rows[0]);
    contactInfo = await pool.query("SELECT * FROM contact_info_view").then((res) => res.rows[0]);
    imageList = await pool.query("SELECT * FROM image_list_view").then((res) => res.rows);
    textBlockList = await pool.query("SELECT * FROM text_block_list_view").then((res) => res.rows);
    horseList = await pool.query("SELECT * FROM horse_list_view").then((res) => res.rows);
    trainerList = await pool.query("SELECT * FROM trainer_list_view").then((res) => res.rows);
    offerList = await pool.query("SELECT * FROM offer_list_view").then((res) => res.rows);
    priceList = await pool.query("SELECT * FROM price_list").then((res) => res.rows);

    return false;
  } catch (err) {
    console.error(err);
    return "Update from database error, try again then contact maintainer";
  }
};

const serverStartup = async () => {
  const errDB = await updateFromDatabase();
  if (errDB) return errDB;

  console.log(colorInfo);
  console.log(contactInfo);
  console.log(imageList);
  console.log(textBlockList);
  console.log(horseList);
  console.log(trainerList);
  console.log(offerList);
  console.log(priceList);

  const errDETA = await pullDeta();
  if (errDETA) return errDETA;
};

module.exports = {
  getColorInfo,
  updateColorInfo,
  getContactInfo,
  updateContactInfo,
  getTextBlockList,
  createTextBlock,
  updateTextBlock,
  deleteTextBlock,
  getHorseList,
  createHorse,
  updateHorse,
  deleteHorse,
  getTrainerList,
  createTrainer,
  updateTrainer,
  deleteTrainer,
  getOfferList,
  createOffer,
  updateOffer,
  deleteOffer,
  getPriceList,
  createPrice,
  updatePrice,
  deletePrice,
  getImageList,
  updateImages,
  uploadImages,
  deleteImages,
  getPassword,
  updatePassword,
  serverStartup,
  DUMMY_IMAGE_PATH,
};
