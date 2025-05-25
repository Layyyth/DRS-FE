// import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CssBaseline from "@mui/material/CssBaseline";
import Stack from "@mui/material/Stack";
import SignInCard from "./SignInCard";
import Content from "./Content";
import TemplateFrame from "./TemplateFrame";
import { useTheme } from "../../../features/themeContext";

export default function SignInSide() {
  const { isAuthenticated } = useSelector((store) => store.account);
  const [theme] = useTheme();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <TemplateFrame mode={theme}>
      <CssBaseline enableColorScheme />
      <Stack
        direction="column"
        component="main"
        sx={[
          {
            justifyContent: "space-between",
            height: { xs: "auto", md: "100%" },
          },
          (theme) => ({
            ...theme.applyStyles("light", {}),
          }),
        ]}
      >
        <Stack
          direction={{ xs: "column-reverse", md: "row" }}
          sx={{
            justifyContent: "center",
            gap: { xs: 6, sm: 12 },
            p: 2,
            m: "auto",
          }}
        >
          <Content />
          <SignInCard />
        </Stack>
      </Stack>
    </TemplateFrame>
  );
}
