const Pool = require("pg").Pool;
const pool = new Pool();
const { Deta } = require("deta");
const detaIntance = Deta(process.env.DETA_KEY);
const detaImageDrive = detaIntance.Drive("images");
const path = require("path");
var fs = require("fs");

const IMAGE_PATH = path.join(__dirname, "../public/api/image/");
const DUMMY_IMAGE = "dummyImage.jpg";
const dummyDescription =
	"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.";

var colorInfo = {
	mainRGB: "fff6de",
	supportRGB: "d19b5e",
	backgroundRGB: "fdffe8",
	detailRGB: "111111",
	buttonsRGB: "FFFFFF",
	highlightRGB: "FFFF82",
};
var contactInfo = {
	street: "Klepacka 21",
	zipCode: "15-698",
	city: "Biedastok",
	phoneNumber: 123456789,
	mail: "stajnia.malta@gmail.com",
	gmapLat: "53.053995",
	gmapLng: "23.095907",
};
var textBlockList = [
	{ id: 1, description: `1${dummyDescription}`, image: "1.jpg" },
	{ id: 2, description: `2${dummyDescription}`, image: "2.webp" },
	{ id: 3, description: `3${dummyDescription}`, image: null },
];
var imageList = [];
var horseList = [
	{
		name: "Malta",
		description:
			"Super konica. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,",
		images: ["1.jpg", "2.webp"],
	},
	{
		name: "Super koń",
		description:
			"Super koń. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,",
		images: ["2.webp", "1.jpg"],
	},
	{
		name: "Super koń v2",
		description:
			"Super koń v2. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,",
		images: ["2.webp", "1.jpg"],
	},
];
var offerList = [
	{
		name: "Jazda indywidualna",
		forWhom: "Dla każdego",
		description: "Jazdy indywidualne dopasowane do umiejętności jeźdźca",
		proposedPrice: "70 zł/h",
		images: ["2.webp", "1.jpg"],
	},
	{
		name: "Jazda terenowa",
		forWhom: "Dla osób jeżdżących samodzielnie w 3 stylach",
		description: "Jazda terenowa w grupach od 3 do 10 osób. Czas trwania od 2 do 4 godzin.",
		proposedPrice: "200 zł",
		images: [],
	},
];
var priceList = [
	{
		id: 1,
		name: "Jazda indywidualna - godzina",
		price: "70 zł",
	},
	{
		id: 2,
		name: "Karnet na 10 godzinnych jazd",
		price: "600 zł",
	},
	{
		id: 3,
		name: "Jazda terenowa - od 2 do 4 godzin",
		price: "200 zł",
	},
];

pool.query("SELECT NOW()", (err, res) => {
	//console.log(err, res);
	pool.end();
});

const getColorInfo = () => {
	return colorInfo;
};

const updateColorInfo = (updatedColorInfo) => {
	// pool.query(
	// 	"UPDATE horse SET main_theme_rgb = $1, support_theme_rgb = $2, background_rgb = $3, details_rgb = $4, highlight_rgb = $5",
	// 	[updatedColorInfo.name, updatedColorInfo.image, updatedColorInfo.description],
	// 	(err, res) => {
	// 		if (err) {
	// 			console.log(err.stack);
	// 		}
	// 	}
	// );
	colorInfo = updatedColorInfo;
	return updateFromDatabase();
};

const getContactInfo = () => {
	return contactInfo;
};

const updateContactInfo = (updatedContactInfo) => {
	// pool.query(
	// 	"UPDATE horse SET main_theme_rgb = $1, support_theme_rgb = $2, background_rgb = $3, details_rgb = $4, highlight_rgb = $5",
	// 	[updatedColorInfo.name, updatedColorInfo.image, updatedColorInfo.description],
	// 	(err, res) => {
	// 		if (err) {
	// 			console.log(err.stack);
	// 		}
	// 	}
	// );
	contactInfo = updatedContactInfo;
	return updateFromDatabase();
};

const getTextBlockList = () => {
	return textBlockList;
};

const createTextBlock = (newTextBlock) => {
	// if newTextBlock.image === null => inster NULL

	// pool.query(
	// 	"INSERT INTO main_page_text_block (description, image_name) VALUES ($1, $2)",
	// 	[newTextBlock.description, newTextBlock.image],
	// 	(err, res) => {
	// 		if (err) {
	// 			console.log(err.stack);
	// 		}
	// 	}
	// );
	const id = Math.max(...textBlockList.map((item) => item.id)) + 1;
	textBlockList.push({ ...newTextBlock, id: id });

	return updateFromDatabase();
};

const updateTextBlock = (updatedTextBlock) => {
	// pool.query(
	// 	"UPDATE main_page_text_block SET image_name = $2, description = $3 WHERE name = $1",
	// 	[updatedTextBlock.id, updatedTextBlock.image, updatedTextBlock.description],
	// 	(err, res) => {
	// 		if (err) {
	// 			console.log(err.stack);
	// 		}
	// 	}
	// );
	textBlockList[textBlockList.findIndex((item) => item.id === updatedTextBlock.id)] = updatedTextBlock;

	return updateFromDatabase();
};

const deleteTextBlock = (textBlockId) => {
	// pool.query("DELETE FROM main_page_text_block WHERE id = $1", [textBlockId], (err) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 	}
	// });

	textBlockList = textBlockList.filter((item) => item.id !== textBlockId);

	return updateFromDatabase();
};

const getHorseList = () => {
	return horseList;
};

const createHorse = (newHorse) => {
	if (newHorse.image === null) newHorse.image = DUMMY_IMAGE;

	// pool.query("INSERT INTO horse VALUES ($1, $2, $3)", [newHorse.name, newHorse.image, newHorse.description], (err) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 	}
	// });

	newHorse = { ...newHorse, images: [newHorse.image] };
	delete newHorse["image"];
	horseList.push(newHorse);
	return updateFromDatabase();
};

const updateHorse = (updatedHorse) => {
	if (updatedHorse.images === []) updatedHorse.images[0] = DUMMY_IMAGE;

	// pool.query(
	// 	"UPDATE horse SET profile_image_name = $2, description = $3 WHERE name = $1",
	// 	[updatedHorse.name, updatedHorse.images[0], updatedHorse.description],
	// 	(err) => {
	// 		if (err) {
	// 			console.log(err.stack);
	// 		}
	// 	}
	// ); // TODO add image table update

	horseList[horseList.findIndex((item) => item.name === updatedHorse.name)] = updatedHorse;

	return updateFromDatabase();
};

const deleteHorse = (horseName) => {
	// pool.query("DELETE FROM horse WHERE name = $1", [horseName], (err) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 	}
	// });
	horseList = horseList.filter((item) => item.name !== horseName);

	return updateFromDatabase();
};

const getOfferList = () => {
	return offerList;
};

const createOffer = (newOffer) => {
	// pool.query("INSERT INTO offer VALUES ($1, $2, $3, $4)", [newOffer.item, newOffer.forWhom, newOffer.description, newOffer.proposedPrice], (err) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 	}
	// });
	newOffer.images = [];
	offerList.push(newOffer);
	return updateFromDatabase();
};

const updateOffer = (updatedOffer) => {
	// pool.query(
	// 	"UPDATE offer SET forWhom = $2, description = $3 proposedPrice = $4 WHERE name = $1",
	// 	[updatedOffer.name, updatedOffer.image, updatedOffer.description, newOffer.proposedPrice],
	// 	(err) => {
	// 		if (err) {
	// 			console.log(err.stack);
	// 		}
	// 	}
	// );
	offerList[offerList.findIndex((item) => item.name === updatedOffer.name)] = updatedOffer;

	return updateFromDatabase();
};

const deleteOffer = (offerName) => {
	// pool.query("DELETE FROM offer WHERE name = $1", [offerName], (err) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 	}
	// });
	offerList = offerList.filter((item) => item.name !== offerName);

	return updateFromDatabase();
};

const getPriceList = () => {
	return priceList;
};

const createPrice = (newPrice) => {
	// pool.query("INSERT INTO price (name, price) VALUES ($1, $2)", [newPrice.name, newPrice.price], (err) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 	}
	// });
	const id = Math.max(...priceList.map((item) => item.id)) + 1;
	priceList.push({ ...newPrice, id: id });

	return updateFromDatabase();
};

const updatePrice = (updatedPrice) => {
	// pool.query(
	// 	"UPDATE price SET price = $2 WHERE name = $1",
	// 	[updatedPrice.name, updatedPrice.image, updatedPrice.description, newPrice.proposedPrice],
	// 	(err) => {
	// 		if (err) {
	// 			console.log(err.stack);
	// 		}
	// 	}
	// );

	priceList[priceList.findIndex((item) => item.id === updatedPrice.id)] = updatedPrice;

	return updateFromDatabase();
};

const deletePrice = (priceId) => {
	// pool.query("DELETE FROM price WHERE id = $1", [priceId], (err) => {
	// 	if (err) {
	// 		console.log(err.stack);
	// 	}
	// });
	priceList = priceList.filter((item) => item.id !== priceId);

	return updateFromDatabase();
};

const getImageList = () => {
	return imageList;
};

const uploadImages = async (images) => {
	await Promise.all(
		images.map(async (newImage) => {
			// pool.query("INSERT INTO image (name) VALUES ($1)", [newImage.name], (err) => {
			// 	if (err) {
			// 		console.log(err.stack);
			// 	}
			// });

			await newImage.mv(IMAGE_PATH + newImage.name);
			try {
				await detaImageDrive.put(newImage.name, { path: IMAGE_PATH + newImage.name });
				console.log(`Saved ${newImage.name}`);
			} catch {
				(err) => {
					console.error(err);
					return false;
				};
			}
			imageList.push(newImage.name);
		})
	);

	// deta pull;
	console.log("done");
	return updateFromDatabase();
};

const deleteImages = async (images) => {
	await Promise.all(
		images.map(async (deleteImage) => {
			// pool.query("DELETE FROM image WHERE name = $1", [deleteImage], (err) => {
			// 	if (err) {
			// 		console.log(err.stack);
			// 	}
			// });

			fs.unlink(IMAGE_PATH + deleteImage, (err) => {
				if (err) {
					console.error(err);
					return false;
				}
				console.log(`${deleteImage} deleted`);
			});
			try {
				await detaImageDrive.delete(deleteImage);
			} catch (err) {
				console.error(err);
				return false;
			}
			imageList = imageList.filter((item) => item !== deleteImage);
			console.log(deleteImage);
		})
	);

	let arr = await detaImageDrive.list();
	console.log(arr, imageList);
	return updateFromDatabase();
};

const getPassword = () => {
	return "$2b$15$7X95ZlV0ELPq.ljtRqRFFucEZAkWY0Ga8F3sYfsW3A97z2HBZ9yia"; // "password"
};

const pullDeta = async () => {
	let images = await detaImageDrive.list();
	images = images.names;
	await Promise.all(
		images.map(async (image) => {
			try {
				const blob = await detaImageDrive.get(image);
				const buffer = Buffer.from(await blob.arrayBuffer());

				if (fs.existsSync(IMAGE_PATH + image)) {
					fs.unlink(IMAGE_PATH + image, (err) => {
						if (err) throw err;
					});
				}

				fs.writeFile(IMAGE_PATH + image, buffer, () => console.log(`Saved ${image}`));
			} catch {
				(err) => {
					console.error(err);
					return false;
				};
			}
		})
	);
	imageList = images; //TODO remove
	imageList = imageList.filter((item) => item !== DUMMY_IMAGE);
};

const updateFromDatabase = () => {
	return true;
};

const serverStartup = () => {
	pullDeta();
	return updateFromDatabase();
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
	getOfferList,
	createOffer,
	updateOffer,
	deleteOffer,
	getPriceList,
	createPrice,
	updatePrice,
	deletePrice,
	getImageList,
	uploadImages,
	deleteImages,
	getPassword,
	serverStartup,
	DUMMY_IMAGE,
};
