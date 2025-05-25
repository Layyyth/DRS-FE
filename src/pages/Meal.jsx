import { useNavigate, useParams } from "react-router-dom";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Divider,
  Container,
  Button,
  Stack,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  People as UsersIcon,
  Restaurant as ChefIcon,
  Microwave as MicrowaveIcon,
} from "@mui/icons-material";
import { Fragment, useEffect, useState } from "react";
import { capitalizeFirstLetter } from "../helpers/functions";
import { Icon } from "@iconify/react/dist/iconify.js";
import { getRequest, postRequest } from "../models/requests";
import { useDispatch, useSelector } from "react-redux";
import { setFavMeals } from "../features/nutriSlice";
import toast from "react-hot-toast";

function ConsumeModal({ open, handleClose, body }) {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: "form",
      }}
    >
      <DialogTitle>Consume meal?</DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}
      >
        <DialogContentText>
          By clicking confirm, You'll add this meal's nutrition info into your
          account's data
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>Close</Button>
        {
          <Button
            variant="outlined"
            color="success"
            type="button"
            onClick={async () => {
              const toastLoadingId = toast.loading("Please wait");
              try {
                await postRequest("user/user/consume", body);
                handleClose();
              } catch (err) {
                console.log(err);
              } finally {
                toast.remove(toastLoadingId);
              }
            }}
          >
            Submit
          </Button>
        }
      </DialogActions>
    </Dialog>
  );
}

const NutritionCard = ({ label, value, unit }) => (
  <Card sx={{ flex: 1 }}>
    <CardContent>
      <Stack spacing={1} alignItems="center">
        <Typography
          variant="h4"
          color="primary.main"
          style={{ wordBreak: "break-all", lineHeight: 0.7 }}
        >
          {value}
          <span style={{ color: "var(--color-grey-500)", fontSize: "1.5rem" }}>
            {unit}
          </span>
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {label}
        </Typography>
      </Stack>
    </CardContent>
  </Card>
);

function Meal() {
  const { meal: id } = useParams();
  const { favMeals } = useSelector((store) => store.nutri);
  const [isFav, setIsFav] = useState(favMeals.some((m) => +m.id === +id));
  const [openModal, setOpenModal] = useState(false);
  const [meal, setMeal] = useState(null);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.account);
  const dispatch = useDispatch();

  useEffect(
    function () {
      async function init() {
        const m = await getRequest(`predict/meal/${id}`);
        // console.log(m);
        const formatedM = {
          name: m.name,
          preparingTime: m.meal_cooking_time,
          serves: 1, // edit later
          difficulty: capitalizeFirstLetter(m.difficulty),
          cookingMethod: capitalizeFirstLetter(m.meal_cooking_method[0]),
          imageURL:
            "https://images.unsplash.com/photo-1577308856961-8e9ec50d0c67?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=%3D%3D?w=248&fit=crop&auto=format",
          nutritionInfo: {
            calories: m.calories,
            protein: m.protein,
            carbs: m.carbs,
            fat: m.fats,
          },
          instructions: m.instruction.split(","),
          ingredients: m.ingredients.split(","),

          // might not be used here but it can be used if seen in /meals/favorites
          // if the user decided to fav it
          id: +m.id,
          calories: m.calories,
          carbs: m.carbs,
          protein: m.protein,
          fats: m.fats,
        };

        setMeal(formatedM);
      }

      init();
    },
    [id]
  );

  // return;
  // const meal = {
  //   name: (mealName),
  //   preparingTime: 25,
  //   serves: 24,
  //   difficulty: "Easy",
  //   imageURL:
  //     "https://images.unsplash.com/photo-1577308856961-8e9ec50d0c67?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=%3D%3D?w=248&fit=crop&auto=format",
  //   nutritionInfo: {
  //     calories: 250,
  //     protein: 4,
  //     carbs: 32,
  //     fat: 12,
  //   },
  //   ingredients: [
  //     { name: "Flour", amount: "2 cups" },
  //     { name: "Sugar", amount: "1 cup" },
  //     { name: "Eggs", amount: "3" },
  //     { name: "Milk", amount: "1 cup" },
  //     { name: "Vanilla", amount: "1 tsp" },
  //     { name: "Chocolate Chips", amount: "2 cups" },
  //     { name: "Butter", amount: "1 cup" },
  //     { name: "Baking Soda", amount: "1 tsp" },
  //   ],
  //   instructions: [
  //     "Preheat oven to 375°F (190°C)",
  //     "Cream together butter and sugars until smooth",
  //     "Beat in eggs and vanilla",
  //     "Mix in flour and baking soda",
  //     "Stir in chocolate chips",
  //     "Drop by rounded tablespoons onto ungreased baking sheets",
  //     "Bake for 10-12 minutes or until golden brown",
  //   ],
  // };

  async function toggleFav() {
    if (isFav) {
      const newFavs = favMeals.filter((m) => +m.id !== +id);
      dispatch(setFavMeals(newFavs));
    } else dispatch(setFavMeals([...favMeals, meal]));

    setIsFav(!isFav);

    await postRequest("user/favorite", {
      user_id: +user.id,
      meal_id: id,
    });

    // dispatch(updateAnyValue({ key: "downloadedMeals", val: favMeals }));
  }

  if (!meal)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper
        sx={{
          position: "relative",
          height: 400,
          mb: 4,
          backgroundImage: `url(${meal.imageURL})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "white",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          }}
        />

        {/* Content overlay */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: 4,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            style={{ wordBreak: "break-word" }}
          >
            {meal.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <Icon icon="mdi:clock" width={24} height={24} />{" "}
              <Typography>{meal.preparingTime}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <UsersIcon /> <Typography>Serves {meal.serves}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <ChefIcon /> <Typography>{meal.difficulty}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexWrap: "wrap",
              }}
            >
              <MicrowaveIcon /> <Typography>{meal.cookingMethod}</Typography>
            </Box>
          </Box>
        </Box>
      </Paper>

      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap-reverse",
          paddingBottom: "1rem",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <Button
            startIcon={<Icon icon="fluent-mdl2:eat-drink" />}
            variant="outlined"
            onClick={() => setOpenModal(true)}
          >
            Consume
          </Button>{" "}
          <Button
            onClick={toggleFav}
            startIcon={
              <Icon
                icon={`line-md:star${isFav ? "-filled" : ""}`}
                style={{
                  color: "var(--color-yellow-400)",
                }}
              />
            }
            variant="text"
            style={{
              color: "var(--color-yellow-400)",
              borderColor: "var(--color-yellow-400)",
              // backgroundColor: "var(--color-yellow-400)",
            }}
          >
            Add to favourite
          </Button>
        </div>

        <Button onClick={() => navigate(-1)} color="error">
          go back
        </Button>
      </div>

      <ConsumeModal
        open={openModal}
        handleClose={() => setOpenModal(false)}
        body={{
          user_id: +user.id,
          meal_id: +meal.id,
        }}
      />

      {/* Nutrition Cards */}
      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Nutrition Information (per serving)
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <NutritionCard
              label="Calories"
              value={meal.nutritionInfo.calories}
              // unit="kl"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <NutritionCard
              label="Protein"
              value={meal.nutritionInfo.protein}
              unit="g"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <NutritionCard
              label="Carbs"
              value={meal.nutritionInfo.carbs}
              unit="g"
            />
          </Grid>
          <Grid item xs={6} sm={3}>
            <NutritionCard
              label="Fat"
              value={meal.nutritionInfo.fat}
              unit="g"
            />
          </Grid>
        </Grid>
      </Box>

      <br />

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Icon icon="ic:twotone-scale" width="24" height="24" />
                <Typography variant="h6">Ingredients</Typography>
              </Box>
              <List>
                {meal?.ingredients?.map((ingredient, index) => (
                  <Fragment key={index}>
                    <ListItem sx={{ py: 1 }} style={{ gap: ".8rem" }}>
                      <Icon
                        icon="icon-park-outline:dot"
                        width="16"
                        height="16"
                      />
                      <ListItemText
                        primary={capitalizeFirstLetter(ingredient.trim())}
                        primaryTypographyProps={{ color: "text.primary" }}
                        // secondary={ingredient.amount}
                        // secondaryTypographyProps={{ color: "text.secondary" }}
                      />
                    </ListItem>
                    {index < meal?.ingredients?.length - 1 && <Divider />}
                  </Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <Icon icon="fluent-mdl2:eat-drink" width="24" height="24" />
                <Typography variant="h6">Instructions</Typography>
              </Box>
              <List>
                {meal?.instructions?.map((instruction, index) => (
                  <Fragment key={index}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography sx={{ display: "flex", gap: 1 }}>
                            <Typography component="span" color="text.secondary">
                              {index + 1}.
                            </Typography>
                            {capitalizeFirstLetter(instruction.trim())}
                          </Typography>
                        }
                      />
                    </ListItem>
                    {index < meal?.instructions?.length - 1 && <Divider />}
                  </Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Meal;
