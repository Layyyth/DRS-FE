import { createSlice } from "@reduxjs/toolkit";
import { getRequest } from "../models/requests";

const initialState = {
  // moved to accountSlice.user by layth
  // nutriInfo: {
  //   calories: 0, // Total calories consumed
  //   neededCalories: 0, // Targeted daily calorie intake
  //   protein: 0, // Amount of protein consumed
  //   carbs: 0, // Amount of carbohydrates consumed
  //   fat: 0, // Amount of fats consumed
  // },

  downloadedMeals: [], // Stores meals downloaded from the filter request (predict)
  favMeals: [], // Stores favorite meals of the user
};

const nutriSlice = createSlice({
  name: "nutri",
  initialState,
  reducers: {
    // Updates a specific nutritional value in the state
    // updateNutriValue(state, action) {
    //   state.nutriInfo[action.payload.key] = action.payload.val;
    // },
    // // layth moved this to account object

    // Updates any value in the state
    updateAnyValue(state, action) {
      // console.log("setting ", action.payload.key, " to ", action.payload.val);
      state[action.payload.key] = action.payload.val;
    },

    setFavMeals(state, action) {
      // console.log("setting favs to", action.payload);
      state.favMeals = action.payload;
    },
  },
});

// Thunk for getting favorite meals
export function getFavMeals(additionalParams) {
  return async function (dispatch) {
    try {
      // dispatch({ type: "account/switchLoading", payload: true }); // Start loading

      const res = await getRequest("user/favorites", additionalParams);
      if (res?.length) {
        dispatch({
          type: "nutri/setFavMeals",
          payload: res,
        });
      }
    } catch (err) {
      console.log(err);
    }
    //  finally {
    //   dispatch({ type: "account/switchLoading", payload: false }); // Stop loading
    // }
  };
}

export const { updateAnyValue, setFavMeals } = nutriSlice.actions;

export default nutriSlice.reducer;
