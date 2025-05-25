import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook to guard access to a component or page.
 * Redirects the user to a specified path if the condition is not met.
 *
 * @param {boolean} condition - The condition to check for access.
 * @param {string} redirectPath - The path to redirect to if the condition fails.
 * @returns {boolean} - A boolean indicating whether the component can render.
 */
export const useGuard = (condition, redirectPath) => {
  const [canRender, setCanRender] = useState(false); // Tracks whether rendering is allowed
  const navigate = useNavigate();

  useEffect(() => {
    if (!condition) {
      navigate(redirectPath); // Redirect if condition is false
    } else {
      setCanRender(true); // Allow rendering if condition is true
    }
  }, [condition, navigate, redirectPath]); // Re-run effect if dependencies change

  return canRender;
};
