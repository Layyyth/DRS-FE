import { useState } from "react";
import {
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Divider,
  Box,
  Typography,
  Paper,
  Container,
  Grid,
  useTheme,
  Radio,
  RadioGroup,
  Slider,
  Autocomplete,
  TextField,
} from "@mui/material";

import {
  // ingsToFilter,
  mealTimes,
  mealCookingMethods,
  MIN_MEALS_LIMIT,
  MAX_MEALS_LIMIT,
  MIN_COOKING_TIME,
  MAX_COOKING_TIME,
} from "../helpers/config";
import { useDispatch, useSelector } from "react-redux";
import { getRequest, postRequest } from "../models/requests";
import { useNavigate } from "react-router-dom";
import { updateAnyValue } from "../features/nutriSlice";
import { Icon } from "@iconify/react/dist/iconify.js";

const MealsFilters = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const { user } = useSelector((store) => store.account);
  const { favMeals } = useSelector((store) => store.nutri);

  // Excluded ings
  const [options, setOptions] = useState([]);

  const [selectedOptions, setSelectedOptions] = useState({
    mealTime: "", // Changed from array to string for radio selection
    mealCookingMethods: [],
    excludedIngredients: [],
  });

  const [limit, setLimit] = useState(MIN_MEALS_LIMIT);
  const [cookingTime, setCookingTime] = useState(MIN_COOKING_TIME);

  const handleCheckboxChange = (category, value) => {
    setSelectedOptions((prev) => {
      const updatedCategory = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value];
      return { ...prev, [category]: updatedCategory };
    });
  };

  // New handler for radio button change
  const handleRadioChange = (event) => {
    setSelectedOptions((prev) => ({
      ...prev,
      mealTime: event.target.value,
    }));
  };

  const handleInputChange = async (event, value) => {
    // setInputValue(value);

    if (value.trim() === "") {
      setOptions([]);
      return;
    }

    try {
      const res = await getRequest(
        `predict/ingredients/suggest?query=${value}`
      );
      console.log(res);
      setOptions(res.suggestions || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
    }
  };

  const handleSubmit = async () => {
    // console.log("Selected Choices:", selectedOptions);

    const body = {
      user_id: user.id,
      meal_type: selectedOptions.mealTime,
      meal_cooking_method: selectedOptions.mealCookingMethods,
      excluded_ingredients: selectedOptions.excludedIngredients,
      limit,
      meal_cooking_time: `${cookingTime}`,
    };
    // console.log(user);
    // console.log(body);

    // return;
    const result = await postRequest("predict/predict", body);
    // console.log(result);
    dispatch(
      updateAnyValue({ key: "downloadedMeals", val: result.recommended_meals })
    );
    navigate("/meals/result");
  };

  const handleClear = () => {
    setSelectedOptions({
      mealTime: "", // Changed from array to empty string
      mealCookingMethods: [],
      excludedIngredients: [],
    });
  };

  // Count selected options (modified to handle mealTime as string)
  const totalSelected =
    (selectedOptions.mealTime ? 1 : 0) +
    selectedOptions.mealCookingMethods.length +
    selectedOptions.excludedIngredients.length;

  return (
    <Container maxWidth="lg" sx={{ my: 4, py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          gutterBottom
          sx={{ mb: 3, fontWeight: 600 }}
        >
          Meal Filters
        </Typography>

        <FormControl component="fieldset" fullWidth>
          <Grid container spacing={3}>
            {/* Meal Type */}
            <Grid
              item
              xs={12}
              // custom media query to warp at less than 1000px
              sx={{ "@media (min-width: 1000px)": { flex: "0 0 33.3333%" } }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 1,
                  bgcolor: theme.palette.grey[50],
                }}
              >
                <Typography
                  variant="subtitle1"
                  fontWeight="bold"
                  color="primary"
                  mb={1}
                >
                  Meal Type
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {/* Changed from FormGroup with Checkboxes to RadioGroup with Radio buttons */}
                <RadioGroup
                  value={selectedOptions.mealTime}
                  onChange={handleRadioChange}
                >
                  {mealTimes.map((meal) => (
                    <FormControlLabel
                      key={meal.value}
                      control={<Radio color="primary" />}
                      value={meal.value}
                      label={meal.label}
                    />
                  ))}
                </RadioGroup>
              </Paper>
            </Grid>

            {/* Cooking Method */}
            <Grid
              item
              xs={12}
              // custom media query to warp at less than 1000px
              sx={{ "@media (min-width: 1000px)": { flex: "0 0 33.3333%" } }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 1,
                  bgcolor: theme.palette.grey[50],
                }}
              >
                <FormGroup>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    mb={1}
                  >
                    Cooking Method
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  {mealCookingMethods.map((method) => (
                    <FormControlLabel
                      key={method.value}
                      control={
                        <Checkbox
                          checked={selectedOptions.mealCookingMethods.includes(
                            method.value
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              "mealCookingMethods",
                              method.value
                            )
                          }
                          color="primary"
                        />
                      }
                      label={method.label}
                    />
                  ))}
                </FormGroup>
              </Paper>
            </Grid>

            {/* Excluded Ingredients */}
            <Grid
              item
              xs={12}
              // custom media query to warp at less than 1000px
              sx={{ "@media (min-width: 1000px)": { flex: "0 0 33.3333%" } }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  height: "100%",
                  borderRadius: 1,
                  bgcolor: theme.palette.grey[50],
                }}
              >
                <FormGroup>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    mb={1}
                  >
                    Excluded Ingredients
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Autocomplete
                    freeSolo
                    multiple
                    options={options}
                    onInputChange={handleInputChange}
                    onChange={(e, value) =>
                      setSelectedOptions((prev) => ({
                        ...prev,
                        excludedIngredients: value,
                      }))
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Ingredients"
                        variant="outlined"
                      />
                    )}
                  />
                  {/* {ingsToFilter.map((item) => (
                    <FormControlLabel
                      key={item.value}
                      control={
                        <Checkbox
                          checked={selectedOptions.excludedIngredients.includes(
                            item.value
                          )}
                          onChange={() =>
                            handleCheckboxChange(
                              "excludedIngredients",
                              item.value
                            )
                          }
                          color="error"
                        />
                      }
                      label={item.label}
                    />
                  ))} */}
                </FormGroup>
              </Paper>
            </Grid>
          </Grid>

          {/* SLIDERS */}
          <div
            style={{
              display: "flex",
              gap: "3rem",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "2rem",
            }}
          >
            <Box sx={{ width: 250 }}>
              <Typography>Number of meals</Typography>
              <Slider
                marks={[
                  {
                    value: MIN_MEALS_LIMIT,
                    label: "",
                  },
                  {
                    value: MAX_MEALS_LIMIT,
                    label: "",
                  },
                ]}
                step={MIN_MEALS_LIMIT}
                value={limit}
                valueLabelDisplay="auto"
                min={MIN_MEALS_LIMIT}
                max={MAX_MEALS_LIMIT}
                onChange={(_, newValue) => {
                  setLimit(newValue);
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  onClick={() => setLimit(MIN_MEALS_LIMIT)}
                  sx={{ cursor: "pointer" }}
                >
                  {MIN_MEALS_LIMIT} meal
                </Typography>
                <Typography
                  variant="body2"
                  onClick={() => setLimit(MAX_MEALS_LIMIT)}
                  sx={{ cursor: "pointer" }}
                >
                  {MAX_MEALS_LIMIT} meal
                </Typography>
              </Box>
            </Box>

            <Box sx={{ width: 250 }}>
              <Typography>Cooking time</Typography>

              <Slider
                marks={[
                  {
                    value: MIN_COOKING_TIME,
                    label: "",
                  },
                  {
                    value: MAX_COOKING_TIME,
                    label: "",
                  },
                ]}
                step={MIN_COOKING_TIME}
                value={cookingTime}
                valueLabelDisplay="auto"
                min={MIN_COOKING_TIME}
                max={MAX_COOKING_TIME}
                onChange={(_, newValue) => {
                  setCookingTime(newValue);
                }}
              />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                  variant="body2"
                  onClick={() => setCookingTime(MIN_COOKING_TIME)}
                  sx={{ cursor: "pointer" }}
                >
                  {MIN_COOKING_TIME} min
                </Typography>
                <Typography
                  variant="body2"
                  onClick={() => setCookingTime(MAX_COOKING_TIME)}
                  sx={{ cursor: "pointer" }}
                >
                  {MAX_COOKING_TIME} min
                </Typography>
              </Box>
            </Box>
          </div>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mt: 4,
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2">
              {totalSelected > 0
                ? `${totalSelected} filters selected`
                : "No filters selected"}
            </Typography>

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
              <Button
                variant="outlined"
                onClick={handleClear}
                disabled={totalSelected === 0}
              >
                Clear All
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disableElevation
                sx={{ px: 3 }}
              >
                Apply Filters
              </Button>
            </Box>
            <Button
              onClick={() => {
                // dispatch(
                //   updateAnyValue({ key: "downloadedMeals", val: favMeals })
                // );
                navigate("/meals/favorites");
              }}
              startIcon={<Icon icon="line-md:star-filled" />}
              variant="text"
              style={{
                color: "var(--color-yellow-400)",
                borderColor: "var(--color-yellow-400)",
                // backgroundColor: "var(--color-yellow-400)",
              }}
            >
              favourites
            </Button>
          </Box>
        </FormControl>
      </Paper>
    </Container>
  );
};

export default MealsFilters;
