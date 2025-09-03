import { toast } from "react-toastify";

export const handleApiError = (err, defaultMessage = "Something went wrong!") => {
  console.log("API Error:", err.response?.data || err.message);

  let errorMessage = defaultMessage;

  if (err.response?.data?.errors) {
    const errors = err.response.data.errors;

    if (Array.isArray(errors)) {
      // Case 1: errors is an array of objects [{ msg: "..." }]
      const specificErrors = errors.map(error => error.msg).join("\n");
      errorMessage += `\n${specificErrors}`;
    } else if (typeof errors === "string") {
      // Case 2: errors is a single string ("Invalid credentials")
      errorMessage += `\n${errors}`;
    }
  } else if (err.response?.data?.message) {
    // Case 3: single message field
    errorMessage += `\n${err.response.data.message}`;
  }

  toast.error(errorMessage, { autoClose: 5000 });
};
