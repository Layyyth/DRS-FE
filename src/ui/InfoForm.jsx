import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Alert,
  Stack,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";

// Imports
import { allergies, goals, diets, activites, genders } from "../helpers/config";
import { logout } from "../features/accountSlice";
import { Icon } from "@iconify/react/dist/iconify.js";
import SwitchThemeButton from "./SwitchThemeButton";
import { useGuard } from "../hooks/useGuard";
import { mergeObjects, slg2str } from "../helpers/functions";
import { patchRequest } from "../models/requests";
import { useTheme } from "../features/themeContext";

// Constants for validation
const MIN_WEIGHT = 30;
const MIN_HEIGHT = 70;

/**
 * Validates and processes form data
 * @param {Event} event - Form submit event
 * @param {Array} selectedAllergiesObjs - Selected allergies array
 * @param {Object} birthdate - Dayjs birthdate object
 * @returns {Object} Processed form data
 */
function processFormData(event, selectedAllergiesObjs = [], birthdate) {
  const formData = new FormData(event.currentTarget);
  const formJson = Object.fromEntries(formData.entries());
  const processedData = {};

  // Process name
  if (formJson.name?.trim()) {
    processedData.name = formJson.name.trim();
  }

  // Process and validate weight
  if (formJson.weight) {
    const weight = Number(formJson.weight);
    if (weight >= MIN_WEIGHT) {
      processedData.weight = weight;
    }
  }

  // Process and validate height
  if (formJson.height) {
    const height = Number(formJson.height);
    if (height >= MIN_HEIGHT) {
      processedData.height = height;
    }
  }

  // Process allergies
  processedData.allergies = selectedAllergiesObjs.map(
    (allergy) => allergy.value
  );

  // Process goal
  const selectedGoal = goals.find(
    (goal) =>
      goal.value ===
      document.getElementById("goal-tag")?.value?.toLowerCase().split(" ")[0]
  );
  if (selectedGoal) {
    processedData.goal = selectedGoal.value;
  }

  // Process gender
  const selectedGender = genders.find(
    (gender) => gender.label === document.getElementById("gender-tag")?.value
  );
  if (selectedGender) {
    processedData.gender = selectedGender.value;
  }

  // Process diet preference
  const selectedDiet = diets.find(
    (diet) => diet.label === document.getElementById("diet-tag")?.value
  );
  if (selectedDiet) {
    processedData.preferred_diet = selectedDiet.value;
  }

  // Process activity level
  const selectedActivity = activites.find(
    (activity) =>
      activity.label === document.getElementById("activity-tag")?.value
  );
  if (selectedActivity) {
    processedData.activity_level = selectedActivity.value;
  }

  // Process birthdate
  if (birthdate) {
    processedData.birthdate = dayjs(birthdate).format("YYYY-MM-DD");
  }

  return processedData;
}

/**
 * Validates required form fields
 * @param {Object} data - Form data to validate
 * @returns {Array} Array of missing field names
 */
function validateRequiredFields(data) {
  const requiredFields = [
    "name",
    "birthdate",
    "weight",
    "height",
    "gender",
    "goal",
    "activity_level",
  ];
  console.log(data);
  return requiredFields.filter((field) => !data[field]);
}

/**
 * Creates default option object for autocomplete fields
 * @param {string} value - Field value
 * @returns {Object|null} Option object or null
 */
function createDefaultOption(value) {
  if (!value) return null;
  return {
    label: slg2str(value),
    value: value,
  };
}

function InfoForm() {
  // Redux state
  const { user } = useSelector((store) => store.account);
  const dispatch = useDispatch();

  // Component state
  const [dialogMsg, setDialogMsg] = useState("");
  const [selectedAllergies, setSelectedAllergies] = useState([]);
  const [birthdate, setBirthdate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Theme context
  const [theme, setTheme] = useTheme();

  // Initialize component state based on user data
  useEffect(() => {
    if (user) {
      // Set allergies from user data
      if (user.allergies?.length > 0) {
        const userAllergies = user.allergies.map((allergy) => ({
          label: slg2str(allergy),
          value: allergy,
        }));
        setSelectedAllergies(userAllergies);
      }

      // Set birthdate from user data
      if (user.birthdate) {
        setBirthdate(dayjs(user.birthdate));
      }
    }
  }, [user]);

  // Route guard - redirect if user info is already gathered
  const canRender = useGuard(
    !(user?.info_gathered && user?.info_gathered_init),
    "/"
  );

  if (!canRender) return null;

  // Determine if this is an edit mode or initial setup
  const isEditMode = user?.info_gathered;
  const isInitialSetup = user?.info_gathered_init;

  /**
   * Handles form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();
    setDialogMsg(""); // Clear previous error messages

    try {
      setIsLoading(true);

      // Process form data
      const processedData = processFormData(
        event,
        selectedAllergies,
        birthdate
      );

      // Validate required fields
      const missingFields = validateRequiredFields(processedData);
      if (missingFields.length > 0) {
        setDialogMsg("Please fill in all required fields correctly");
        return;
      }

      // Prepare data for API request
      const requestBody = {
        ...mergeObjects({ ...user, info_gathered: true }, processedData),
      };

      // Send update request
      await patchRequest("user/update-health-form", requestBody);

      // Reload page to refresh user data
      location.reload();
    } catch (error) {
      console.error("Error updating user info:", error);
      setDialogMsg("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles cancel action for edit mode
   */
  const handleCancel = async () => {
    try {
      await patchRequest("user/update-health-form", {
        info_gathered: true,
      });
      location.reload();
    } catch (error) {
      console.error("Error canceling edit:", error);
    }
  };

  /**
   * Handles allergy selection changes
   */
  const handleAllergyChange = (_, newValues) => {
    // Remove duplicates based on value property
    const uniqueValues = newValues.filter(
      (item, index, self) =>
        self.findIndex((selfItem) => selfItem.value === item.value) === index
    );
    setSelectedAllergies(uniqueValues);
  };

  return (
    <Dialog
      open={true}
      PaperProps={{
        style: {
          width: "100%",
          display: "flex",
          alignItems: "center",
          borderRadius: "10px",
        },
        component: "form",
        onSubmit: handleSubmit,
      }}
    >
      {/* Dialog Header */}
      <Stack
        display="flex"
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="center"
      >
        <DialogTitle>
          {isEditMode ? "Editing" : "Gathering"} your info
        </DialogTitle>
        <SwitchThemeButton theme={theme} setTheme={setTheme} />
      </Stack>

      {/* Dialog Content */}
      <DialogContent
        style={{
          display: "grid",
          gap: "1rem",
          maxWidth: "500px",
        }}
      >
        <DialogContentText>
          <strong>
            Please {isEditMode ? "edit any input" : "fill in your info"} to
            store it in <span style={{ color: "#0369a1" }}>your account</span>
          </strong>
        </DialogContentText>

        {/* Name Field */}
        <TextField
          autoFocus
          type="text"
          margin="dense"
          id="name"
          name="name"
          label="Name *"
          variant="standard"
          defaultValue={user?.name || ""}
        />

        {/* Birthdate Field */}
        <DatePicker
          label="Birthdate *"
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />

        {/* Weight Field */}
        <TextField
          type="number"
          margin="dense"
          id="weight"
          name="weight"
          label={`Weight * (min ${MIN_WEIGHT}kg)`}
          variant="standard"
          defaultValue={user?.weight || ""}
          inputProps={{ min: MIN_WEIGHT }}
        />

        {/* Height Field */}
        <TextField
          type="number"
          margin="dense"
          id="height"
          name="height"
          label={`Height * (min ${MIN_HEIGHT}cm)`}
          variant="standard"
          defaultValue={user?.height || ""}
          inputProps={{ min: MIN_HEIGHT }}
        />

        {/* Gender Field */}
        <Autocomplete
          id="gender-tag"
          options={genders}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Gender *"
              placeholder="Select gender"
            />
          )}
          defaultValue={createDefaultOption(user?.gender)}
        />

        {/* Allergies Field */}
        <Autocomplete
          limitTags={2}
          multiple
          id="allergy-tag"
          options={allergies}
          value={selectedAllergies}
          onChange={handleAllergyChange}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Allergies (optional)"
              placeholder="Select allergies"
            />
          )}
        />

        {/* Goal Field */}
        <Autocomplete
          id="goal-tag"
          options={goals}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Goal *" placeholder="Select goal" />
          )}
          defaultValue={createDefaultOption(user?.goal)}
        />

        {/* Diet Preferences Field */}
        <Autocomplete
          id="diet-tag"
          options={diets}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Diet Preferences (optional)"
              placeholder="Select diet preference"
            />
          )}
          defaultValue={createDefaultOption(user?.preferred_diet)}
        />

        {/* Activity Level Field */}
        <Autocomplete
          id="activity-tag"
          options={activites}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Activity Level *"
              placeholder="Select activity level"
            />
          )}
          defaultValue={createDefaultOption(user?.activity_level)}
        />

        {/* Error Message */}
        {dialogMsg && <Alert severity="error">{dialogMsg}</Alert>}
      </DialogContent>

      {/* Dialog Actions */}
      <DialogActions
        style={{
          display: "flex",
          flexWrap: "wrap-reverse",
          paddingTop: "1rem",
          gap: ".5rem",
          alignItems: "center",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        {/* Cancel/Logout Button */}
        {isInitialSetup ? (
          <Button variant="text" onClick={handleCancel}>
            Cancel
          </Button>
        ) : (
          <IconButton
            color="error"
            variant="contained"
            type="button"
            onClick={() => dispatch(logout())}
            title="Logout"
          >
            <Icon icon="stash:signout-light" width="30px" height="30px" />
          </IconButton>
        )}

        {/* Submit Button */}
        <Button
          style={{ margin: 0 }}
          color="success"
          variant="contained"
          type="submit"
          disabled={isLoading}
        >
          {isInitialSetup ? "Edit" : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InfoForm;
