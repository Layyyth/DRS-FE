// Import necessary modules and components
import { useState } from "react";
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
} from "@mui/material"; // Material-UI components
import { allergies, goals, diets, activites, genders } from "../helpers/config"; // Helper configurations
import { login, logout } from "../features/accountSlice"; // Redux actions
import { Icon } from "@iconify/react/dist/iconify.js"; // Iconify for icons
import SwitchThemeButton from "./SwitchThemeButton"; // Custom theme switch button
import { useGuard } from "../hooks/useGuard"; // Custom hook for guarding routes
import { getFromLocal, mergeObjects, slg2str } from "../helpers/functions"; // Helper functions
import { patchRequest } from "../models/requests"; // Function for making POST requests
import dayjs from "dayjs"; // Day.js for date handling
import { useTheme } from "../features/themeContext"; // Custom theme context
import { DatePicker } from "@mui/x-date-pickers";

// Function to process and take data from the form
function takeData(event, selectedAllergiesObjs = [], birthdate) {
  const formData = new FormData(event.currentTarget); // Get form data
  let formJson = Object.fromEntries(formData.entries()); // Convert form data to JSON
  const finalData = {};

  // Check and set age
  // if (formJson.age) {
  //   finalData.age = +formJson.age;
  //   if (formJson.age < 7) return finalData;
  // }

  // Check and set weight
  if (formJson.weight) {
    finalData.weight = +formJson.weight;
    if (formJson.weight < 30) return finalData;
  }

  // Check and set height
  if (formJson.height) {
    finalData.height = +formJson.height;
    if (formJson.height < 70) return finalData;
  }

  if (formJson.name) {
    finalData.name = formJson.name;
  }

  // Process selected allergies
  finalData.allergies = [];
  selectedAllergiesObjs.map((al) => finalData.allergies.push(al.value));

  // Set goal
  finalData.goal = goals.find((goal) =>
    goal.label === document.getElementById("goal-tag").value ? goal : null
  )?.value;
  if (!finalData.goal) delete finalData.goal;

  // Set gender
  finalData.gender = genders.find((gender) =>
    gender.label === document.getElementById("gender-tag").value ? gender : null
  )?.value;
  if (!finalData.gender) delete finalData.gender;

  // Set diet
  finalData.diet_preference =
    diets.find((diet) =>
      diet.label === document.getElementById("diet-tag").value ? diet : null
    )?.value || null;

  // Set activity level
  finalData.activity_level = activites.find((activity) =>
    activity.label === document.getElementById("activity-tag").value
      ? activity
      : null
  )?.value;
  if (!finalData.activity_level) delete finalData.activity_level;

  finalData.birthdate = birthdate
    ? dayjs(birthdate).format("YYYY-MM-DD")
    : null;

  return finalData;
}

// InfoForm component
function InfoForm() {
  const { user } = useSelector((store) => store.account); // Get user info from Redux store
  const dispatch = useDispatch(); // Get dispatch function
  const [dialogMsg, setDialogMsg] = useState(""); // State for dialog message
  const [selectedAllergies, setSelectedAllergies] = useState(
    user?.NutriInfo?.allergies?.map((alg) => {
      return { label: slg2str(alg), value: alg };
    })
  ); // State for selected allergies
  const [birthdate, setBirthdate] = useState(null); // State for birthdate
  const [theme, setTheme] = useTheme(); // Custom theme context
  const [isLoading, setIsLoading] = useState(false);

  // Guard to check if the user can render this component
  const canRednder = useGuard(
    !(user?.info_gathered && user?.info_gathered_init),
    "/"
  );
  if (!canRednder) return;

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
        onSubmit: async (e) => {
          e.preventDefault();
          try {
            setIsLoading(true);

            const data = takeData(e, selectedAllergies, birthdate);
            if (
              !data.name ||
              !data.birthdate ||
              !data.weight ||
              !data.height ||
              !data.gender ||
              !data.goal ||
              !data.activity_level
            )
              return setDialogMsg("Please fill in the inputs correctly");

            // const token = getFromLocal("access_token");
            // console.log(newDataObj);
            const body = {
              ...mergeObjects({ ...user.NutriInfo, info_gathered: true }, data),
            };
            // console.log(body);
            const user2 = await patchRequest("user/update-health-form", body);
            // console.log(user);
            location.reload();
            // if (user2) dispatch(login({ user: user2 }));
            // else toast("Something went wrong");
          } catch (e) {
            console.log(e);
          } finally {
            setIsLoading(false);
          }
        },
      }}
    >
      <Stack
        display="flex"
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="center"
      >
        <DialogTitle>
          {user?.info_gathered ? "Editing" : "Gathering"} your info
        </DialogTitle>
        <SwitchThemeButton theme={theme} setTheme={setTheme} />
      </Stack>

      <DialogContent
        style={{
          display: "grid",
          gap: "1rem",
          maxWidth: "500px",
        }}
      >
        <DialogContentText>
          <strong>
            Please{" "}
            {user?.info_gathered ? "edit any input" : "fill in your info"} to
            store it in <span style={{ color: "#0369a1" }}>your account</span>
          </strong>
        </DialogContentText>

        <TextField
          autoFocus
          type="text"
          margin="dense"
          id="name"
          name="name"
          label="Name"
          variant="standard"
        />

        <DatePicker
          label="Select Date"
          value={birthdate}
          onChange={(newValue) => setBirthdate(newValue)}
          renderInput={(params) => <TextField {...params} />}
        />

        <TextField
          autoFocus
          type="number"
          margin="dense"
          id="weight"
          name="weight"
          label="Weight"
          variant="standard"
          defaultValue={user?.NutriInfo?.weight}
        />

        <TextField
          autoFocus
          type="number"
          margin="dense"
          id="height"
          name="height"
          label="Height"
          variant="standard"
          defaultValue={user?.NutriInfo?.height}
        />

        <Autocomplete
          id="gender-tag"
          options={genders}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Gender" placeholder="Gender" />
          )}
          defaultValue={{
            label: slg2str(user?.NutriInfo?.gender),
            value: user?.NutriInfo?.gender,
          }}
        />

        <Autocomplete
          limitTags={2}
          multiple
          id="allergy-tag"
          options={allergies}
          value={selectedAllergies} // Explicitly bind to selectedAllergies state
          onChange={(_, newValues) => {
            // Remove duplicates based on `value`
            const uniqueValues = newValues.filter(
              (v, i, self) =>
                self.findIndex((item) => item.value === v.value) === i
            );
            setSelectedAllergies(uniqueValues);
          }}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Allergies (optional)"
              placeholder="Allergies (optional)"
            />
          )}
        />

        <Autocomplete
          id="goal-tag"
          options={goals}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Goal" placeholder="Goal" />
          )}
          defaultValue={{
            label: slg2str(user?.NutriInfo?.goal),
            value: user?.NutriInfo?.goal,
          }}
        />

        <Autocomplete
          id="diet-tag"
          options={diets}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Diet Prefrences (optional)"
              placeholder="Diet Prefrences (optional)"
            />
          )}
          defaultValue={{
            label: slg2str(user?.NutriInfo?.diet),
            value: user?.NutriInfo?.diet,
          }}
        />

        <Autocomplete
          id="activity-tag"
          options={activites}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField {...params} label="Activity" placeholder="Activity" />
          )}
          defaultValue={{
            label: slg2str(user?.NutriInfo?.activity),
            value: user?.NutriInfo?.activity,
          }}
        />

        {dialogMsg && <Alert severity="error">{dialogMsg}</Alert>}
      </DialogContent>
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
        {user?.info_gathered_init ? (
          <Button
            variant="test"
            onClick={async () => {
              const res = await patchRequest("info-gathered-toggle", {
                access_token: getFromLocal("access_token"),
              });

              dispatch(login(res.user));
            }}
          >
            Cancel
          </Button>
        ) : (
          <IconButton
            color="error"
            variant="contained"
            type="button"
            onClick={() => dispatch(logout())}
          >
            <Icon icon="stash:signout-light" width="30px" height="30px" />
          </IconButton>
        )}

        <Button
          style={{ margin: 0 }}
          color="success"
          variant="contained"
          type="submit"
          disabled={isLoading}
        >
          {user?.info_gathered_init ? "Edit" : "Continue"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default InfoForm;
