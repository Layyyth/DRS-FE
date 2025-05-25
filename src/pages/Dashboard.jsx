import { useSelector } from "react-redux";
import styled from "styled-components";
import { Button, Typography } from "@mui/material";
import { Gauge, gaugeClasses } from "@mui/x-charts";
import { Icon } from "@iconify/react/dist/iconify.js";
import Stat from "../ui/Stat";
import { useGuard } from "../hooks/useGuard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequest } from "../models/requests";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h4 {
    padding: 1rem;
  }

  & .main {
    padding: 1.5rem;
    display: flex;

    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap-reverse;

    max-width: 70rem;
    & .gauge {
      width: 15rem;
      max-width: 20rem;
      & text {
        text-align: center;
      }
    }

    & h5:first-child {
      text-align: center;
    }
    & .nutrisFlex {
      /* width: 1fr; */
      max-width: 40rem;

      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
  }

  & .Allowedmeals {
    width: 100%;
    background-color: var(--color-grey-100);
    padding: 2rem 1rem;
    text-align: center;
  }
`;

function Dashboard() {
  const { user } = useSelector((store) => store.account);
  const { daily_calories } = user;
  const [nutriState, setNutriState] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(
    function () {
      async function init() {
        const data = await getRequest("user/user/consumption", {
          user_id: user.id,
        });
        setNutriState({
          calories: data.total_calories,
          protein: data.protein,
          carbs: data.carbs,
          fats: data.fats,
        });
      }
      init();
    },
    [user.id, setNutriState]
  );

  const canRender = useGuard(user.info_gathered, "/info");

  if (!canRender) return;

  const caloriesMustTake = +daily_calories.toFixed(1);
  const caloriesITook = +nutriState.calories.toFixed(1);

  return (
    <StyledContainer>
      <Typography variant="h4">Dashboard</Typography>
      <div className="main">
        <div>
          <Typography variant="h5" paddingBottom={"1rem"}>
            Macronutrients
          </Typography>

          <div className="nutrisFlex">
            <Stat
              title="Protein"
              color="green"
              icon={<Icon icon="material-symbols:egg-outline" />}
              value={`${nutriState.protein.toFixed(1)}/${user.protein.toFixed(1)}`}
            />
            <Stat
              title="Carbs"
              color="yellow"
              icon={<Icon icon="lucide:wheat" />}
              value={`${nutriState.carbs.toFixed(1)}/${user.carbs.toFixed(1)}`}
            />
            <Stat
              title="Fat"
              color="red"
              icon={<Icon icon="fluent-emoji-high-contrast:peanuts" />}
              value={`${nutriState.fats.toFixed(1)}/${user.fats.toFixed(1)}`}
            />
          </div>
        </div>

        <div className="gauge">
          <Gauge
            value={caloriesITook}
            valueMax={caloriesMustTake || 0}
            startAngle={-91}
            endAngle={91}
            height={150}
            sx={{
              [`& .${gaugeClasses.valueText}`]: {
                fontSize: 20,
                transform: "translate(0px, -30px)",
              },
            }}
            text={({ value, valueMax }) =>
              `${value} / ${valueMax % 2 === 0 ? valueMax.toFixed(0) : valueMax.toFixed(1)} \n Calorie`
            }
          />
        </div>
      </div>
      <div className="Allowedmeals">
        <Link to="/meals">
          <Button size="large">Go to meals</Button>
        </Link>
      </div>
      {/*  
        <Typography variant="h5" paddingBottom={"2rem"}>
          Allowed Meals
        </Typography>

        <ul className="mealsList">
          {itemData.map((item) => (
            <Link key={item.img} to={`/meals/${item.title.toLowerCase()}`}>
              <ImageListItem>
                <img
                  src={`${item.img}?w=248&fit=crop&auto=format`}
                  alt={item.title}
                  loading="lazy"
                />
                <ImageListItemBar
                  title={item.title}
                  actionIcon={
                    <IconButton
                      sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                      aria-label={`info about ${item.title}`}
                    >
                      <Icon icon="cbi:mealie" width="2rem" height="2rem" />
                    </IconButton>
                  }
                />
              </ImageListItem>
            </Link>
          ))}
        </ul> 
     */}
    </StyledContainer>
  );
}

export default Dashboard;
