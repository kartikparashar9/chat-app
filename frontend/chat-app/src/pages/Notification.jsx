import React, { useEffect, useState } from "react";
import {
  fetchPendingRequestsApi,
  acceptRequestApi,
  rejectRequestApi,
  deleteNotificationApi
} from "../services/api";

const Notifications = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const response = await fetchPendingRequestsApi();

        setRequests(response?.requests || []);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      await acceptRequestApi(requestId);

      setRequests((prev) =>
        prev.filter((r) => r._id !== requestId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await rejectRequestApi(requestId);

      setRequests((prev) =>
        prev.filter((r) => r._id !== requestId)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Notifications
        </h1>

        <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
          {requests.length}
        </div>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center mt-10">
          <p className="text-gray-500">Loading...</p>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && requests.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-10 text-center">
          <div className="text-5xl mb-3">🔔</div>

          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            No Notifications
          </h2>

          <p className="text-gray-500 mt-2">
            You don't have any notifications.
          </p>
        </div>
      )}

      {/* REQUESTS */}
      <div className="space-y-4">
        {requests.map((req) => (
          <div
            key={req._id}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 flex items-center justify-between"
          >
            {/* USER INFO */}
            <div className="flex items-center gap-4">
              {/* AVATAR */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg">
                {req.sender?.name?.charAt(0)?.toUpperCase()}
              </div>

              {/* DETAILS */}
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {req.sender?.name}
                </h3>

                <p className="text-sm text-gray-500">
                  Sent you a friend request
                </p>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-2">
              <button
                onClick={() => handleAccept(req._id)}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition"
              >
                Accept
              </button>

              <button
                onClick={() => handleReject(req._id)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;