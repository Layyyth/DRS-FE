// import styled from "styled-components";
import EmptyBackground from "../ui/EmptyBackground";
import { Box, CircularProgress } from "@mui/material";
import { getFromLocal } from "../helpers/functions";

// const StyledContainer = styled.div`
//   height: 100dvh;

//   display: flex;
//   align-items: center;
//   justify-content: center;
//   flex-direction: column;
// `;

function LoadingFullPage() {
  return (
    <EmptyBackground
      className={`themeContainer ${getFromLocal("themeColor") || "dark"}`}
    >
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
    </EmptyBackground>
  );
}

export default LoadingFullPage;
