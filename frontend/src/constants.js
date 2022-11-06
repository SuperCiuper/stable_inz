const API_URL = process.env.REACT_APP_REST_API_URL || "http://localhost:3001/api/";
const GMAP_API_KEY = process.env.REACT_APP_GMAP_API_KEY || "http://localhost:3001/api/";
const DUMMY_IMAGE = "dummyImage.jpg";

const checkResponseOk = async (response) => {
	const data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : null;

	if (!response.ok) {
		return Promise.reject(new Error(data || response.status));
	}

	return await data;
};

export { API_URL, GMAP_API_KEY, DUMMY_IMAGE, checkResponseOk };
