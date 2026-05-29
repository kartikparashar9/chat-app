import axios from "axios";
import { getToken } from ".././utils/helpers"

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

export const searchApi = async (searchData) => {
  const response = await axios.get(
    "https://chat-app-88n8.onrender.com/api/user/search",
    {
      params: {
        search: searchData,
      },

      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};