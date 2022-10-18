const Pool = require("pg").Pool;
const pool = new Pool();

var mainInfo = {};
var horseList = [];
var imageIdList = [];
var textBlockList = [];
const DEFAULT_IMAGE = 0;

pool.query("SELECT NOW()", (err, res) => {
	console.log(err, res);
	pool.end();
});

const getHorseList = () => {
	//return horseList;

	return [
		{
			name: "Malta",
			description:
				"Super konica. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,",
			images: [1, 2],
		},
		{
			name: "Super koń",
			description:
				"Super koń. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae,",
			images: [2, 1],
		},
	];
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
	if (updateHorse.image === null) {
		updateHorse.image = DEFAULT_IMAGE;
	}
	pool.query(
		"UPDATE horse SET profile_image_id = $2, description = $3 WHERE name = $1",
		[updateHorse.name, updateHorse.image, updateHorse.description],
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

const getImageIdList = () => {
	//return imageIdList;
	return [
		{ id: 1, name: "1.jpg" },
		{ id: 2, name: "2.webp" },
	];
};

const getMainInfo = () => {
	//return mainInfo;
	return {
		mainRGB: "fff6de",
		supportRGB: "d19b5e",
		backgroundRGB: "fdffe8",
		detailRGB: "111111",
		buttonsRGB: "000000",
		highlightRGB: "FFFF82",
	};
};

const dummyDescription =
	"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo, rhoncus ut, imperdiet a, venenatis vitae, justo. Nullam dictum felis eu pede mollis pretium. Integer tincidunt. Cras dapibus. Vivamus elementum semper nisi. Aenean vulputate eleifend tellus. Aenean leo ligula, porttitor eu, consequat vitae, eleifend ac, enim. Aliquam lorem ante, dapibus in, viverra quis, feugiat a, tellus.";
const getTextBlockList = () => {
	//return textBlockList;
	return [
		{ description: `1${dummyDescription}`, image: "1" },
		{ description: `2${dummyDescription}`, image: "2" },
		{ description: `3${dummyDescription}`, image: null },
	];
};

const updateFromDatabase = () => {};

module.exports = {
	getHorseList,
	createHorse,
	updateHorse,
	deleteHorse,
	getImageIdList,
	getMainInfo,
	getTextBlockList,
};
