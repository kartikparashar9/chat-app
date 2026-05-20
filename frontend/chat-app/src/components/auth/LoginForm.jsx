import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [feedback, setFeedback] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation
    if (!data.email.trim()) {
      setFeedback("Please enter email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!emailRegex.test(data.email)) {
      setFeedback("Please enter valid email.");
      return;
    }

    if (!data.password.trim()) {
      setFeedback("Please enter password.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        data,
      );

      if (response.status === 200) {
        setFeedback("Signed in successfully.");

        localStorage.setItem("token", response.data.token);

        setData({
          email: "",
          password: "",
        });

        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setFeedback("Incorrect password.");
      }

      else if (error.response?.status === 404) {
        setFeedback("Email does not exist.");
      }

      else {
        setFeedback("Failed to sign in.");
      }
      console.error("Server error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition">
      <form
        className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-8 w-[450px] rounded-2xl shadow-md"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-800 dark:text-gray-200">
            Email
          </label>
        </div>

        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
          <input
            type="text"
            placeholder="Enter your Email"
            className="ml-2 w-full h-full outline-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="font-semibold text-gray-800 dark:text-gray-200">
            Password
          </label>
        </div>

        <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg h-12 px-3 focus-within:border-blue-500 transition">
          <input
            type="password"
            placeholder="Enter your Password"
            className="ml-2 w-full h-full outline-none bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-400"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
        </div>

        {/* Remember + Forgot */}
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-2">
            <input type="checkbox" />
            <label className="text-gray-700 dark:text-gray-300">
              Remember me
            </label>
          </div>
          <span className="text-blue-500 cursor-pointer">Forgot password?</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="mt-4 bg-black dark:bg-blue-600 text-white rounded-lg h-12 hover:opacity-90 transition"
        >
          Sign In
        </button>

        {/* Signup */}
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Don&apos;t have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Or With
        </p>

        {/* Google only */}
        <div>
          <button className="flex items-center justify-center gap-2 w-full h-12 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-blue-500 transition text-gray-700 dark:text-gray-200">
            Google
          </button>

          {/* Feedback */}
          {feedback && (
            <p
              className={`text-center text-sm mt-4 ${
                feedback === "Signed in successfully."
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {feedback}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
