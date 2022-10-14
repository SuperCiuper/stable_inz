const Pool = require("pg").Pool;

const pool = new Pool();

var mainInfo = {};
var horseList = [];
var imageList = [];
const DEFAULT_IMAGE = 0;

pool.query("SELECT NOW()", (err, res) => {
	console.log(err, res);
	pool.end();
});

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

const getImageList = () => {
	return imageList;
};

const getMainInfo = () => {
	return mainInfo;
};

const updateFromDatabase = () => {};

module.exports = {
	getHorseList,
	createHorse,
	editHorse,
	deleteHorse,
	getImageList,
	getMainInfo,
};
