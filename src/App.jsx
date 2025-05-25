// Import React dependencies
import { lazy, Suspense, useEffect, useState } from "react";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Import components and utilities
import LoadingFullPage from "./pages/LoadingFullPage";
import { authorizeToken, switchLoading } from "./features/accountSlice";
import { Button, Dialog, DialogActions, DialogTitle } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Toaster } from "react-hot-toast";

// Import lazy-loaded components
const SignUp = lazy(() => import("./pages/sign/signup/SignUp"));
const SignIn = lazy(() => import("./pages/sign/signin/SignInSide"));
const SignHeader = lazy(() => import("./pages/sign/SignHeader"));
const VerifyingEmail = lazy(() => import("./ui/VerifyingEmail"));

const Dashboard = lazy(() => import("./pages/Dashboard"));
const MealsFilters = lazy(() => import("./pages/MealsFilters"));
const MealsList = lazy(() => import("./pages/MealsList"));
const Meal = lazy(() => import("./pages/Meal"));

const AppLayout = lazy(() => import("./ui/AppLayout"));
const InfoForm = lazy(() => import("./ui/InfoForm"));
const PageNotFound = lazy(() => import("./pages/PageNotFound"));
const Settings = lazy(() => import("./pages/Settings"));

// Import theme, styles, and helper functions
import GlobalStyle from "./styles/globalStyles";
import { getFromLocal } from "./helpers/functions";
import { LocalizationProvider } from "@mui/x-date-pickers";

import { ThemeProvider } from "./features/themeContext";

// **ProtectedRoute Component**
// Ensures the user is authenticated; displays loading or redirects otherwise.
const ProtectedRoute = ({ children }) => {
  const { isLoading, isAuthenticated } = useSelector((store) => store.account);

  if (isLoading) return <LoadingFullPage />; // Show loading screen if authentication is in progress
  if (!isAuthenticated) {
    return <Navigate to="/user/signin" />; // Redirect to sign-in if user isn't authenticated
  }

  return children; // Render children if user is authenticated
};

// Retrieve token from local storage
const savedToken = getFromLocal("access_token");
const refreshToken = getFromLocal("refresh_token");

// **Main App Component**
function App() {
  const dispatch = useDispatch();
  const [dialogMsg, setDialogMsg] = useState(""); // For handling dialog messages
  const { user } = useSelector((store) => store.account);

  // **Effect for initializing user session**
  useEffect(() => {
    if (user) return; // If user data is already available, skip initialization

    async function init() {
      try {
        if (savedToken)
          dispatch(authorizeToken(savedToken, refreshToken)); // Attempt login with saved token
        else dispatch(switchLoading(false));
      } catch (err) {
        console.error(err);
      }
    }
    init();
  }, [dispatch, user]);

  // **Render the application**
  return (
    <ThemeProvider>
      <Toaster /> {/* Global notification system */}
      <GlobalStyle /> {/* Apply global CSS styles */}
      <BrowserRouter>
        {/* Fallback UI during lazy loading */}
        <Suspense fallback={<LoadingFullPage />}>
          {" "}
          <Routes>
            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Default route (index) => (/) */}
              <Route index element={<Navigate to="/dashboard" />} />{" "}
              {/* Dashboard page */}
              <Route path="/dashboard" element={<Dashboard />} />{" "}
              <Route
                path="/info"
                element={
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <InfoForm /> {/* Form with date picker */}
                  </LocalizationProvider>
                }
              />
              {/* Redirect */}
              <Route
                path="/meals"
                element={<Navigate to="/dashboard" />}
              />{" "}
              <Route path="/meals/" element={<MealsFilters />} />
              {/* Meals listing */}
              <Route path="/meals/result" element={<MealsList />} />{" "}
              <Route
                path="/meals/favorites"
                element={<MealsList type="fav" />}
              />{" "}
              {/* Single meal details */}
              <Route path="/meals/:meal" element={<Meal />} />{" "}
              {/* Settings page */}
              <Route path="/settings" element={<Settings />} />{" "}
            </Route>
            {/* Unprotected routes */}
            <Route
              path="user"
              element={
                <>
                  <Dialog open={Boolean(dialogMsg)}>
                    {" "}
                    {/* Dialog for displaying messages */}
                    <DialogTitle>{dialogMsg}</DialogTitle>
                    <DialogActions>
                      <Button onClick={() => setDialogMsg("")}>Ok</Button>
                    </DialogActions>
                  </Dialog>
                  <Outlet /> {/* Placeholder for nested routes */}
                </>
              }
            >
              <Route
                path="/user/signin"
                element={
                  <>
                    <SignHeader />
                    <SignIn /> {/* Sign-in page */}
                  </>
                }
              />
              <Route
                path="/user/signup"
                element={
                  <>
                    <SignHeader />
                    <SignUp setDialogMsg={setDialogMsg} /> {/* Sign-up page */}
                  </>
                }
              />
              {/* Default to sign-in */}
              <Route index element={<Navigate to="/user/signin" />} />{" "}
            </Route>
            {/* Email verification page */}
            <Route path="/verify" element={<VerifyingEmail />} />{" "}
            {/* Fallback route */}
            <Route path="*" element={<PageNotFound />} /> {/* Page not found */}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
