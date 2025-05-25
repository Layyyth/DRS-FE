import { createSlice } from "@reduxjs/toolkit";
import {
  getRequest,
  postRequest,
  updateTokenInHeaders,
} from "../models/requests";
import { saveToLocal } from "../helpers/functions";

const initialState = {
  user: null, // Stores user details if logged in
  isAuthenticated: false, // Indicates if the user is authenticated
  isLoading: true, // Tracks the loading state of the application
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    // Logs in the user and updates the state
    login(state, action) {
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // if (action.payload.token) {
      //   // for feature requests in this session
      //   saveToLocal("access_token", action.payload.token); // Save session key locally
      //   updateTokenInHeaders(action.payload.token); // Update the token in default headers object
      // }
    },

    // Logs out the user and resets the state
    logout(state) {
      state.user = initialState.user;
      state.isAuthenticated = initialState.isAuthenticated;
      saveToLocal("access_token", null); // Remove session key from local storage
      saveToLocal("refresh_token", null);
      window.location.replace("/user/signin"); // Redirect to the login page
    },

    // Toggles the loading state
    switchLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

// Thunk for creating a new account
export function makeAccount(accObj, setDialogMsg) {
  return async function (dispatch) {
    try {
      dispatch({ type: "account/switchLoading", payload: true }); // Start loading
      console.log(accObj);
      const res = await postRequest("auth/signup", { ...accObj });

      console.log(res);
      if (res) {
        setDialogMsg(res.message); // Show error message
      } else {
        setDialogMsg(`Something went wrong`); // Prompt user to verify email
      }
      // saveToLocal("token", res.access_token); // Save the session key
    } catch (err) {
      console.log(err);
    } finally {
      dispatch({ type: "account/switchLoading", payload: false }); // Stop loading
    }
  };
}

// Thunk for logging in the user
export function authorizeToken(token, refresh_token) {
  return async function (dispatch) {
    // for feature requests
    updateTokenInHeaders(token); // Update the token in requests.js default header object

    dispatch({ type: "account/switchLoading", payload: true }); // Start loading
    let acc;
    acc = await getRequest("user/me");

    // if i didn't get a user but i have a refresh token, i'll try to get a new access_token
    if (!acc) {
      if (!refresh_token)
        return dispatch({ type: "account/switchLoading", payload: false }); // Stop loading // Exit if no user account found

      const response = await postRequest("auth/refresh", { refresh_token });
      if (response) {
        saveToLocal("access_token", response.access_token); // lives for 15min
        saveToLocal("refresh_token", response.refresh_token); // lives for longer
        location.reload();
      } else return dispatch({ type: "account/switchLoading", payload: false }); // Stop loading // Exit if no user account found
    }

    dispatch({ type: "account/login", payload: { user: acc } }); // Log in the user
    dispatch({ type: "account/switchLoading", payload: false }); // Stop loading

    return acc;
  };
}

// Exporting actions and reducer
export const { login, logout, switchLoading } = accountSlice.actions;

export default accountSlice.reducer;
