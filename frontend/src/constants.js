const API_URL = process.env.REACT_APP_REST_API_URL;
const GMAP_API_KEY = process.env.REACT_APP_GMAP_API_KEY;

const checkResponseOk = async (response) => {
  const data = response?.headers?.get("content-type")?.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    return Promise.reject(new Error(data || response.status));
  }
  return data;
};

export { API_URL, GMAP_API_KEY, checkResponseOk };
