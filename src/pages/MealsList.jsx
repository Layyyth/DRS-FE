import { useSelector } from "react-redux";
import styled from "styled-components";
import MealListItem from "../ui/MealListItem";
import { Typography } from "@mui/material";

const StyledContainer = styled.div`
  padding-top: 1rem;

  display: flex;
  gap: 1rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  & .excludedIngs {
    max-width: 18rem;
    margin: 0 1rem;
  }
`;

const StyledList = styled.ul`
  padding: 0 1rem;
  list-style: none;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  /* grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr)); */
`;

function MealsList({ type }) {
  const { downloadedMeals, favMeals } = useSelector((store) => store.nutri);
  let toRender = [];

  if (type === "fav") toRender = favMeals;
  else toRender = downloadedMeals;

  console.log(toRender);

  return (
    <StyledContainer>
      <p>{type === "fav" ? "Favorite meals" : "Filter results"}</p>

      {!toRender.length ? (
        <p>no meals...</p>
      ) : (
        <>
          <p>{toRender.length} Meal</p>
          <StyledList>
            {toRender.map((meal) => (
              <MealListItem
                key={meal.id}
                meal={meal}
                // large={randomBoolean(0.8)}
              />
            ))}
          </StyledList>
        </>
      )}
    </StyledContainer>
  );
}

export default MealsList;
