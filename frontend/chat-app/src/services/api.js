import axios from "axios";
import { getToken } from ".././utils/helpers"
// ================= Auth =================

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

// ================= Search =================

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

// ================= FRIEND REQUEST =================

// SEND REQUEST
export const sendFriendRequestApi = async (receiverId) => {
  const response = await axios.post(
    "https://chat-app-88n8.onrender.com/api/request/send",
    {
      receiverId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// ACCEPT REQUEST
export const acceptRequestApi = async (requestId) => {
  const response = await axios.post(
    "https://chat-app-88n8.onrender.com/api/request/accept",
    {
      requestId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// REJECT REQUEST
export const rejectRequestApi = async (requestId) => {
  const response = await axios.post(
    "https://chat-app-88n8.onrender.com/api/request/reject",
    {
      requestId,
    },
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// PENDING REQUESTS
export const fetchPendingRequestsApi = async () => {
  const response = await axios.get(
    "https://chat-app-88n8.onrender.com/api/request/pending",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

export const fetchFriends = async () => {
  const response = await axios.get("https://chat-app-88n8.onrender.com/api/request/", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
}

// ================= NOTIFICATIONS =================

// GET ALL NOTIFICATIONS
export const fetchNotificationsApi = async (data) => {
  const response = await axios.get(
    "https://chat-app-88n8.onrender.com/api/notification",
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );
  console.log(response.data);

  return response.data;
};

// DELETE NOTIFICATION

export const deleteNotificationApi = async (
  notificationId
) => {
  const response = await axios.delete(
    `https://chat-app-88n8.onrender.com/api/notification/${notificationId}`,
    {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  return response.data;
};

// ================= CHATS =================

export const fetchChats = async () => {
  const response = await axios.get("https://chat-app-88n8.onrender.com/api/chat/", {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};