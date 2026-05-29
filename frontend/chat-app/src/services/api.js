import axios from "axios";

export const loginApi = async (data) => {
    const response = await axios.post(
        "https://chat-app-88n8.onrender.com/api/user/login",
        data
    );

    return response.data;
};

export const signupAPi = async (formData) => {
  const response = await axios.post("https://chat-app-88n8.onrender.com/api/user/signup", formData);
  return response.data;
};