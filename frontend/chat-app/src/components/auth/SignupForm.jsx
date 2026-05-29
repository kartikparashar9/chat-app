import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signupAPi } from "../../services/api";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    bio: "",
    avatar: null,
  });

  const [preview, setPreview] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // Upload Avatar
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (preview) URL.revokeObjectURL(preview);

      setFormData((prev) => ({
        ...prev,
        avatar: file,
      }));

      setPreview(URL.createObjectURL(file));
    }
  };

  // Remove Avatar
  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);

    setPreview("");

    setFormData((prev) => ({
      ...prev,
      avatar: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    setFeedback("");

    if (!formData.name.trim()) {
      setFeedback("Full name is required.");
      return;
    }
    if (!formData.email.trim()) {
      setFeedback("Email is required.");
      return;
    }
    if (!formData.password.trim()) {
      setFeedback("Password is required.");
      return;
    }
    if (formData.password.length < 6) {
      setFeedback("Password must be at least 6 characters.");
      return;
    }
    if (!formData.gender) {
      setFeedback("Please select a gender.");
      return;
    }
    if (!formData.dob) {
      setFeedback("Date of birth is required.");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData(); // ← create FormData
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("password", formData.password);
      data.append("gender", formData.gender);
      data.append("dob", formData.dob);
      data.append("bio", formData.bio);

      if (formData.avatar) {
        data.append("avatar", formData.avatar); // ← File object appended correctly
      }

      const response = await signupAPi(data);

      console.log(response);

      setFeedback("Signed up successfully.");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setFeedback("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 transition px-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 bg-white dark:bg-gray-800 p-8 w-full max-w-[450px] rounded-2xl shadow-md"
      >
        <h2 className="text-2xl font-semibold text-center text-blue-800 dark:text-gray-200">
          Create Account
        </h2>

        {/* Avatar Upload */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            {/* Avatar Circle */}
            <div
              onClick={() => fileInputRef.current.click()}
              className="w-32 h-32 rounded-full border-4 border-dashed border-gray-400 overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 bg-white flex items-center justify-center shadow-md"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  className="w-16 h-16 text-gray-500"
                  fill="currentColor"
                >
                  <path d="M9.99296258,10.5729355 C12.478244,10.5729355 14.4929626,8.55821687 14.4929626,6.0729355 C14.4929626,3.58765413 12.478244,1.5729355 9.99296258,1.5729355 C7.5076812,1.5729355 5.49296258,3.58765413 5.49296258,6.0729355 C5.49296258,8.55821687 7.5076812,10.5729355 9.99296258,10.5729355 Z" />
                  <path d="M10,12C5.5,12 1.7,15 0.5,19h19C18.3,15 14.5,12 10,12z" />
                </svg>
              )}
            </div>

            {/* Buttons */}
            <div className="absolute bottom-0 right-0 flex gap-2">
              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-700 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
              >
                +
              </button>

              {/* Remove Button */}
              {preview && (
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="bg-red-600 text-white w-9 h-9 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition"
                >
                  X
                </button>
              )}
            </div>

            {/* Hidden Input */}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        </div>

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          className="h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-black outline-none focus:border-blue-500"
        />

        {/* Email */}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, email: e.target.value }))
          }
          className="h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-black outline-none focus:border-blue-500"
        />

        {/* Password */}
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, password: e.target.value }))
          }
          className="h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-black outline-none focus:border-blue-500"
        />

        {/* Gender */}
        <select
          name="gender"
          value={formData.gender}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, gender: e.target.value }))
          }
          className="h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-black outline-none focus:border-blue-500"
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* DOB */}
        <input
          type="date"
          name="dob"
          value={formData.dob}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, dob: e.target.value }))
          }
          className="h-12 px-3 rounded-lg border border-gray-300 dark:border-gray-600 text-black outline-none focus:border-blue-500"
        />

        {/* Bio */}
        <textarea
          name="bio"
          placeholder="Short Bio"
          value={formData.bio}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, bio: e.target.value }))
          }
          rows="3"
          className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 text-black outline-none focus:border-blue-500 resize-none"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-blue-800 dark:bg-blue-600 text-white rounded-lg h-12 hover:opacity-90 transition font-medium disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>

        {/* Login */}
        <p className="text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        {/* Feedback */}
        {feedback && (
          <p
            className={`text-center text-sm mt-2 ${
              feedback === "Signed up successfully."
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {feedback}
          </p>
        )}
      </form>
    </div>
  );
};

export default SignupForm;
