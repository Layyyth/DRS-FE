import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import EmptyBackground from "./EmptyBackground";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { Avatar, createTheme } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";
import { DEFAULT_PIC, LOGO } from "../helpers/config";
import { useTheme } from "../features/themeContext";

function AppLayout() {
  // Retrieve the user state from Redux
  const { user } = useSelector((store) => store.account);
  const navigate = useNavigate(); // Navigation hook for route changes
  const { pathname } = useLocation(); // Current location information
  const [theme, setTheme] = useTheme(); // Custom theme hook for light/dark mode

  // Memoize router to avoid unnecessary re-renders
  const router = useMemo(() => {
    return {
      pathname, // Current path
      searchParams: new URLSearchParams(), // Initialize empty search params
      navigate: (path) => {
        if (path !== "/changeTheme")
          navigate(path); // Navigate to the path unless it's theme switch
        else setTheme(theme === "light" ? "dark" : "light"); // Toggle theme
      },
    };
  }, [pathname, navigate, theme, setTheme]);

  // Create a custom Material UI theme with defined breakpoints and light mode
  const demoTheme = createTheme({
    colorSchemes: { light: theme === "light" }, // Define color scheme based on current theme

    breakpoints: {
      values: {
        xs: 0, // Extra small screens
        sm: 600, // Small screens
        md: 700, // Medium screens
        lg: 1200, // Large screens
        xl: 1536, // Extra large screens
      },
    },
  });

  // Generate navigation title dynamically based on current path
  let navTitle = pathname.slice(1).split(""); // Remove the leading slash and split into characters
  navTitle[0] = navTitle[0]?.toUpperCase(); // Capitalize the first character
  navTitle = navTitle.join(""); // Join the characters back into a string

  // Define navigation structure with segments and titles
  const NAVIGATION = [
    {
      kind: "header",
      title: navTitle, // Header title based on current path
    },
    {
      segment: "dashboard", // Dashboard segment
      title: "Dashboard",
      icon: (
        <Icon icon="material-symbols:dashboard" width="30px" height="30px" />
      ),
    },
    {
      segment: "meals", // Meals segment with nested children
      title: "Meals",
      icon: <Icon icon="cbi:mealie" width="30px" height="30px" />,
      // children: [
      //   {
      //     segment: "breakfast", // Breakfast child segment
      //     title: "Breakfast",
      //     icon: (
      //       <Icon icon="fluent-mdl2:breakfast" width="30px" height="30px" />
      //     ),
      //   },
      //   {
      //     segment: "lunch", // Lunch child segment
      //     title: "Lunch",
      //     icon: (
      //       <Icon
      //         icon="material-symbols:lunch-dining-outline"
      //         width="30px"
      //         height="30px"
      //       />
      //     ),
      //   },
      //   {
      //     segment: "drink", // Drink child segment
      //     title: "Drink",
      //     icon: <Icon icon="tdesign:drink" width="30px" height="30px" />,
      //   },
      //   {
      //     segment: "dinner", // Dinner child segment
      //     title: "Dinner",
      //     icon: (
      //       <Icon icon="ic:outline-dinner-dining" width="30px" height="30px" />
      //     ),
      //   },
      //   {
      //     segment: "dessert", // Dessert child segment
      //     title: "Dessert",
      //     icon: <Icon icon="lucide:dessert" width="30px" height="30px" />,
      //   },
      // ],
    },
    {
      segment: "changeTheme", // Segment to switch theme
      title: "Switch Theme",
      icon: (
        <Icon
          icon={
            theme === "light"
              ? "si:light-mode-line" // Light mode icon
              : "material-symbols:dark-mode-outline" // Dark mode icon
          }
          width="30px"
          height="30px"
        />
      ),
    },
    {
      segment: "settings", // User settings segment
      title: user.displayName, // Display user name
      icon: (
        <Avatar
          style={{ width: "30px", height: "30px" }}
          src={user.photoURL || DEFAULT_PIC}
        />
      ),
    },
  ];

  // Render the app layout with navigation and branding
  return (
    <div>
      <AppProvider
        navigation={NAVIGATION} // Pass navigation configuration
        theme={demoTheme} // Apply custom theme
        router={router} // Pass router
        branding={{
          logo: <img src={LOGO} width={35} alt="logo" />, // Display app logo
          title: "DietApp", // App title
        }}
      >
        <DashboardLayout>
          <EmptyBackground>
            <Outlet /> {/* Render child components */}
          </EmptyBackground>
        </DashboardLayout>
      </AppProvider>
    </div>
  );
}

export default AppLayout;
