import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Extract token from URL query params
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      // Save token in localStorage (or Redux if you prefer)
      localStorage.setItem("token", token);

      // You can also decode token here to get user info if needed
      // Example: const user = JSON.parse(atob(token.split('.')[1]));
      navigate("/home");
    } else {
      // If no token, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen text-xl">
      Logging you in with Google...
    </div>
  );
};

export default AuthSuccess;