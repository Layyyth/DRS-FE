function saveToLocal(key, item) {
  // Save an item to localStorage as a JSON string
  localStorage.setItem(key, JSON.stringify(item));
}

function getFromLocal(key) {
  // Retrieve an item from localStorage and parse it as JSON
  const raw = localStorage.getItem(key);
  if (raw === "undefined" || !raw) return null;
  const item = JSON.parse(raw);
  return item;
}

function capitalizeFirstLetter(val) {
  // Capitalize the first letter of a string
  return String(val).charAt(0).toLocaleUpperCase() + val.slice(1);
}

function mergeObjects(oldObject, newProperties) {
  // Merge two objects recursively, preserving nested object structures
  const merged = { ...oldObject }; // Start with a shallow copy of the old object

  for (const [key, value] of Object.entries(newProperties)) {
    if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      // Recursively merge for nested objects
      merged[key] = mergeObjects(merged[key] || {}, value);
    } else {
      // Overwrite for non-object values
      merged[key] = value;
    }
  }

  return merged;
}

// Converts a slug or value to a human-readable label
function slg2str(slug) {
  if (!slug) return "";

  // Replace non-alphanumeric characters (like - or _) with spaces, then capitalize each word
  let words = slug.replace(/-|_/g, " ").split(" ");

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    words[i] = word.charAt(0).toUpperCase() + word.slice(1);
  }

  return words.join(" ");
}

// Converts a label or string to a slug or value
function str2slg(str) {
  if (!str) return "";

  str = str.trim(); // Trim leading/trailing whitespace
  str = str.toLowerCase(); // Convert to lowercase

  return str
    .replace(/[^a-z0-9/\s-]/g, "") // Remove invalid characters except '/' and '-'
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Collapse multiple hyphens
    .replace(/\/+/g, "/"); // Allow single '/' for paths like "wheat/gluten"
}

function randomBoolean(percentage = 0.5) {
  // Generate a random boolean value based on a probability percentage
  return Math.random() >= percentage;
}

export {
  saveToLocal, // Save an item to local storage
  getFromLocal, // Retrieve an item from local storage
  capitalizeFirstLetter, // Capitalize the first letter of a string
  mergeObjects, // Merge two objects recursively
  str2slg, // Convert a string to a slug
  slg2str, // Convert a slug to a human-readable string
  randomBoolean, // Generate a random boolean with a given probability
};
