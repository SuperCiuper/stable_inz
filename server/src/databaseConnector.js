const Pool = require("pg").Pool;
const pool = new Pool();

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
var imageList = ["1.jpg", "2.webp"];
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
		item: "Jazda indywidualna",
		forWhom: "Dla każdego",
		description: "Jazdy indywidualne dopasowane do umiejętności jeźdźca",
		proposedPrice: "70 zł/h",
	},
	{
		item: "Jazda terenowa",
		forWhom: "Dla ośób jeżdżących samodzielnie w 3 stylach",
		description: "Jazda terenowa w grupach od 3 do 10 osób. Czas trwania od 2 do 4 godzin.",
		proposedPrice: "200 zł",
	},
];
var priceList = [
	{
		item: "Jazda indywidualna - godzina",
		price: "70 zł",
	},
	{
		item: "Karnet na 10 godzinnych jazd",
		price: "600 zł",
	},
	{
		item: "Jazda terenowa - od 2 do 4 godzin",
		price: "200 zł",
	},
];

const DEFAULT_IMAGE = 0;

pool.query("SELECT NOW()", (err, res) => {
	console.log(err, res);
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

const getTextBlockList = () => {
	return textBlockList;
};

const createTextBlock = (newTextBlock) => {
	// if newTextBlock.image === null => inster NULL

	// pool.query(
	// 	"INSERT INTO main_page_text_block (description, image_name) VALUES $1 $2",
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

const getImageList = () => {
	return imageList;
};

const getHorseList = () => {
	return horseList;
};

const createHorse = (newHorse) => {
	if (newHorse.image === null) {
		newHorse.image = DEFAULT_IMAGE;
	}
	pool.query("INSERT INTO horse VALUES ($1, $2, $3)", [newHorse.name, newHorse.image, newHorse.description], (err) => {
		if (err) {
			console.log(err.stack);
		}
	});

	updateFromDatabase();
};

const updateHorse = (updatedHorse) => {
	if (updatedHorse.image === null) {
		updatedHorse.image = DEFAULT_IMAGE;
	}
	pool.query(
		"UPDATE horse SET profile_image_id = $2, description = $3 WHERE name = $1",
		[updatedHorse.name, updatedHorse.image, updatedHorse.description],
		(err) => {
			if (err) {
				console.log(err.stack);
			}
		}
	);

	updateFromDatabase();
};

const deleteHorse = (horseName) => {
	pool.query("DELETE FROM horse WHERE id = $1", [horseName], (err) => {
		if (err) {
			console.log(err.stack);
		}
	});

	updateFromDatabase();
};

const getOfferList = () => {
	return offerList;
};

const getPriceList = () => {
	return priceList;
};

const getPassword = () => {
	return "$2b$15$7X95ZlV0ELPq.ljtRqRFFucEZAkWY0Ga8F3sYfsW3A97z2HBZ9yia"; // "password"
};

const updateFromDatabase = () => {
	return true;
};

module.exports = {
	getColorInfo,
	updateColorInfo,
	getHorseList,
	createHorse,
	updateHorse,
	deleteHorse,
	getImageList,
	getContactInfo,
	getTextBlockList,
	createTextBlock,
	updateTextBlock,
	deleteTextBlock,
	getOfferList,
	getPriceList,
	getPassword,
};
