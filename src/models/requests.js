import axios from "axios";
import { mergeObjects, saveToLocal } from "../helpers/functions";
import { NUTRIWISE_MIDDLEWARE_URL } from "../helpers/config";

/**
 * Default headers for API requests.
 * Includes JSON content type and allows cross-origin requests.
 */
const defaultHeaders = {
  "Content-Type": "application/json", // Ensures the request is JSON format
  Accept: "application/json", // Informs server to respond with JSON
  "Access-Control-Allow-Origin": "*", // Allows CORS, but this is typically set by the server
  "ngrok-skip-browser-warning": "69420", // Ngrok for testing
  Authorization: "",
};

function updateTokenInHeaders(token) {
  defaultHeaders.Authorization = `Bearer ${token}`; // Updates the Authorization header with the token
}

/**
 * Sends a POST request to the middleware API.
 *
 * @param {string} afterURL - The endpoint to append to the middleware URL.
 * @param {Object} body - The request body to send.
 * @param {Object} [addToHeaders={}] - Additional headers to merge with the default headers.
 * @returns {Promise<Object|undefined>} - The API response data, or undefined if an error occurs.
 */
async function postRequest(afterURL, body, addToHeaders = {}) {
  try {
    const response = await axios.post(
      NUTRIWISE_MIDDLEWARE_URL + afterURL,
      body,
      {
        headers: mergeObjects(defaultHeaders, addToHeaders),
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function getRequest(afterURL, params = {}, addToHeaders = {}) {
  try {
    const response = await axios.get(NUTRIWISE_MIDDLEWARE_URL + afterURL, {
      params,
      headers: mergeObjects(defaultHeaders, addToHeaders),
    });

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Sends a PATCH request to the middleware API.
 *
 * @param {string} afterURL - The endpoint to append to the middleware URL.
 * @param {Object} body - The request body to send.
 * @param {Object} [addToHeaders={}] - Additional headers to merge with the default headers.
 * @returns {Promise<Object|undefined>} - The API response data, or undefined if an error occurs.
 */
async function patchRequest(afterURL, body, addToHeaders = {}) {
  try {
    const response = await axios.patch(
      NUTRIWISE_MIDDLEWARE_URL + afterURL,
      body,
      {
        headers: mergeObjects(defaultHeaders, addToHeaders),
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
}

/**
 * Initiates Google sign-in by redirecting to the appropriate authentication URL.
 */
function signInWithGoogle() {
  const width = 500;
  const height = 600;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  const popup = window.open(
    `${NUTRIWISE_MIDDLEWARE_URL}auth/google/login`,
    "GoogleSignIn",
    `width=${width},height=${height},top=${top},left=${left}`
  );

  window.addEventListener("message", (event) => {
    if (event.origin + "/" !== `${NUTRIWISE_MIDDLEWARE_URL}`) return;

    const { access_token, refresh_token } = event.data;

    if (access_token && refresh_token) {
      // Handle tokens (e.g., save to localStorage and redirect)
      saveToLocal("access_token", access_token);
      saveToLocal("refresh_token", refresh_token);

      location.reload();
      // console.log("Access token:", access_token);
      // console.log("Refresh token:", refresh_token);
      popup?.close();
    }
  });
}

export {
  updateTokenInHeaders,
  signInWithGoogle,
  postRequest,
  patchRequest,
  getRequest,
};
