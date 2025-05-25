import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import MonitorHeartIcon from "@mui/icons-material/MonitorHeart";

import { SitemarkIcon } from "../CustomIcons";

const items = [
  {
    icon: <EnergySavingsLeafIcon sx={{ color: "text.secondary" }} />,
    title: "Track Progress & Achieve Goals",
    description:
      "Monitor your diet progress with calorie-calculated meal plans, portion sizes, and macro targets aligned with your fitness objectives.",
  },
  {
    icon: <MonitorWeightIcon sx={{ color: "text.secondary" }} />,
    title: "Personalized Meal Recommendations",
    description:
      "Tailored meal suggestions based on user preferences, dietary goals (weight loss, gain, or maintenance), and food allergies.",
  },
  {
    icon: <MonitorHeartIcon sx={{ color: "text.secondary" }} />,
    title: "Allergen-Safe Meal Options",
    description:
      "Ensure safe eating by filtering out meals that contain ingredients you're allergic to, providing peace of mind with every suggestion.",
  },
];

export default function Content() {
  return (
    <Stack
      sx={{
        flexDirection: "column",
        alignSelf: "center",
        gap: 4,
        maxWidth: 450,
      }}
    >
      <Box
        sx={{
          display: { xs: "none", md: "flex", alignItems: "center" },
          gap: ".5rem",
        }}
      >
        <SitemarkIcon />
        <Typography
          variant="h5"
          // gutterBottom
          fontFamily={("Kolker Brush", "sans-serif")}
        >
          DietApp
        </Typography>
      </Box>
      {items.map((item, index) => (
        <Stack key={index} direction="row" sx={{ gap: 2 }}>
          {item.icon}
          <div>
            <Typography gutterBottom sx={{ fontWeight: "medium" }}>
              {item.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {item.description}
            </Typography>
          </div>
        </Stack>
      ))}
    </Stack>
  );
}
