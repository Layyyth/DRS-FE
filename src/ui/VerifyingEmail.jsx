// Import necessary modules and components
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import EmptyBackground from "./EmptyBackground"; // Custom background component
import { useGuard } from "../hooks/useGuard"; // Custom hook for guarding routes
import { postRequest } from "../models/requests"; // Function for making POST requests

// VerifyingEmail component
function VerifyingEmail() {
  // Get authentication status from Redux store
  const { isAuthenticated } = useSelector((store) => store.account);
  const [searchParams] = useSearchParams(); // Hook to get URL search parameters
  const navigate = useNavigate(); // Hook to navigate programmatically
  const canRednder = useGuard(!isAuthenticated, "/"); // Guard to check if the user can render this component

  useEffect(() => {
    const verifyEmail = async () => {
      if (!canRednder) return;
      const actionCode = searchParams.get("oobCode"); // Get the verification code from URL
      if (!actionCode) {
        alert("Invalid verification link");
        return;
      }

      try {
        const response = await postRequest("auth/verify-email", {
          actionCode,
        }); // Send POST request to verify email
        if (response?.data?.emailVerified) {
          alert("Email verified successfully!");
        }
      } catch (error) {
        console.error("Error verifying email:", error);
        alert("Error verifying email. Please try again later.");
      } finally {
        window.location.href = "/"; // Redirect user after verification
        // navigate("/");
      }
    };

    verifyEmail();
  }, [searchParams, canRednder, navigate]); // Dependencies for useEffect

  return <EmptyBackground>Verifying your email...</EmptyBackground>; // Render message while verifying
}

export default VerifyingEmail;
