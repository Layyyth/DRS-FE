import EmptyBackground from "../ui/EmptyBackground";
import styled from "styled-components";
import { getFromLocal } from "../helpers/functions";

const StyledContainer = styled.div`
  height: 100dvh;

  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  flex-direction: column;

  & a {
    text-decoration: underline;
  }
`;

function PageNotFound({ error, resetErrorBoundary }) {
  return (
    <EmptyBackground
      className={`themeContainer ${getFromLocal("themeColor") || "dark"}`}
    >
      <StyledContainer>
        <h1>Error!</h1>
        <p>{error?.message ? error?.message : "404 Error"}</p>
        <a href="/">Go back</a>
      </StyledContainer>
    </EmptyBackground>
  );
}

export default PageNotFound;
