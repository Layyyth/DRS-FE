// Import Redux and middleware dependencies
import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk"; // Corrected import (it's not a named export)

// Import reducers
import accountReducer from "./features/accountSlice";
import nutriReducer from "./features/nutriSlice";

// Combine reducers into a single root reducer
const rootReducer = combineReducers({
  account: accountReducer, // Manages account-related state
  nutri: nutriReducer, // Manages nutrition-related state
});

// Create the Redux store with thunk middleware for async actions
const store = createStore(rootReducer, applyMiddleware(thunk));

// Export the store for use in your app
export default store;
