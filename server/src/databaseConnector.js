const Pool = require("pg").Pool;
const pool = new Pool();

const dummyDescription =
	"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.";

var mainInfo = {
	mainRGB: "fff6de",
	supportRGB: "d19b5e",
	backgroundRGB: "fdffe8",
	detailRGB: "111111",
	buttonsRGB: "000000",
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
	{ description: `1${dummyDescription}`, image: "1.jpg" },
	{ description: `2${dummyDescription}`, image: "2.webp" },
	{ description: `3${dummyDescription}`, image: null },
];
var imageList = [
	{
		id: 1,
		name: "1.jpg",
	},
	{
		id: 2,
		name: "2.webp",
	},
];
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
	{
		name: "Super koń v2",
		description:
			"Super koń v2. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,",
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

const getMainInfo = () => {
	return mainInfo;
};

const getContactInfo = () => {
	return contactInfo;
};

const getTextBlockList = () => {
	return textBlockList;
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
	pool.query("INSERT INTO horse VALUES ($1, $2, $3)", [newHorse.name, newHorse.image, newHorse.description], (err, res) => {
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
		(err, res) => {
			if (err) {
				console.log(err.stack);
			}
		}
	);

	updateFromDatabase();
};

const deleteHorse = (horseName) => {
	pool.query("DELETE FROM horse WHERE id = $1", [horseName], (err, res) => {
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

const updateFromDatabase = () => {};

module.exports = {
	getHorseList,
	createHorse,
	updateHorse,
	deleteHorse,
	getImageList,
	getMainInfo,
	getContactInfo,
	getTextBlockList,
	getOfferList,
	getPriceList,
};
