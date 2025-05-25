// Import React dependencies and necessary utilities
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { ErrorBoundary } from "react-error-boundary";

// Import application-specific modules
import store from "./store.jsx";
import App from "./App.jsx";
import "./styles/fonts.css"; // Custom font styles
import PageNotFound from "./pages/PageNotFound.jsx"; // Fallback UI for errors

// Render the root React component
createRoot(document.getElementById("root")).render(
  <ErrorBoundary
    FallbackComponent={PageNotFound} // Display this on uncaught errors
  >
    {/* Provide Redux store to the app */}
    <Provider store={store}>
      <StrictMode>
        {/* Main App component */}
        <App />
      </StrictMode>
    </Provider>
  </ErrorBoundary>
);
