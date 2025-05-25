import { Icon } from "@iconify/react/dist/iconify.js";
import { IconButton } from "@mui/material";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const StyledListItem = styled.li`
  height: 18rem;
  grid-column: span 2; // make all sizes the same

  /* &.large {
    grid-column: span 2;
  }

  @media (max-width: 463px) {
    &.large {
      grid-column: span 1;
    }
  } */

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  position: relative;
  /* overflow: hidden; */
  & .itemBar {
    position: absolute;
    bottom: 0;

    color: rgba(255, 255, 255, 0.855);
    height: auto;
    min-height: 3.5rem;
    width: 100%;
    background-color: var(--backdrop-color);
    line-height: 1;

    display: flex;
    flex: 1 1 auto; /* Allow shrinking and growing */
    align-items: center;
    justify-content: space-between;
    gap: 1rem;

    & .mealinfo {
      padding: 0 0.4rem;

      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;

      & .nutriinfo {
        font-size: 1.3rem;
        display: flex;
        gap: 0.5rem;

        & div {
          display: flex;
          gap: 0.1rem;
          align-items: center;
        }
      }
    }
  }
`;

function MealListItem({ meal }) {
  const navigate = useNavigate();

  return (
    <StyledListItem>
      <img
        src="https://images.unsplash.com/photo-1577308856961-8e9ec50d0c67?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?w=248&fit=crop&auto=format"
        alt={meal.name}
      />
      <div className="itemBar">
        <div className="mealinfo">
          <p>{meal.name}</p>

          <div className="nutriinfo">
            <div>
              <Icon icon="material-symbols:egg" />
              {meal.protein}
            </div>
            <div>
              <Icon icon="fa6-solid:wheat-awn" />
              {meal.carbs}
            </div>
            <div>
              <Icon icon="ph:cheese-fill" />
              {meal.fats}
            </div>
          </div>
        </div>

        <IconButton
          sx={{ color: "rgba(255, 255, 255, 0.789)" }}
          aria-label={`info about ${meal.name}`}
          onClick={() => navigate(`/meals/${meal.id}`)}
        >
          <Icon icon="cbi:mealie" width="1.5rem" height="1.5rem" />
        </IconButton>
      </div>
    </StyledListItem>
  );
}

export default MealListItem;
