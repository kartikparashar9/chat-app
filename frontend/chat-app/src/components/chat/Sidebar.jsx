import { Search, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditProfile from "../profile/EditProfile";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  searchApi,
  sendFriendRequestApi,
  fetchPendingRequestsApi,
  fetchFriends
} from "../../services/api";

const Sidebar = ({ setSelectedChat }) => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [userChats, setUserChats] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const [requestLoading, setRequestLoading] = useState(null);
  const [sentRequests, setSentRequests] = useState([]);

  const dropdownRef = useRef();

  const navigate = useNavigate();

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // LOAD SENT REQUESTS
  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const { requests = [] } = await fetchPendingRequestsApi();

        setSentRequests(requests.map((r) => r.receiver));
      } catch (err) {
        console.log("Failed to fetch requests:", err);
        setFeedback("Failed to fetch requests");
        setSentRequests([]);
      }
    };

    fetchPendingRequests();
  }, []);

  // SEARCH USERS
  useEffect(() => {
    const searchUsers = async () => {
      try {
        setLoading(true);

        const response = await searchApi(searchUser);

        const users = response?.users ?? [];
        setUserChats(users);

        setFeedback("");
      } catch (error) {
        console.log(error);
        setFeedback("Failed to search users");
        setUserChats([]);
      } finally {
        setLoading(false);
      }
    };

    if (!searchUser.trim()) {
      setUserChats([]);
      setFeedback("");
      return;
    }

    const timer = setTimeout(() => {
      searchUsers();
    }, 500);

    return () => clearTimeout(timer);
  }, [searchUser]);

  // SEND FRIEND REQUEST
  const handleSendRequest = async (userId) => {
    if (sentRequests.includes(userId)) return;

    try {
      setRequestLoading(userId);

      await sendFriendRequestApi(userId);

      setSentRequests((prev) => [...prev, userId]);

      setFeedback("Request sent");
      setTimeout(() => setFeedback(""), 2000);
    } catch (err) {
      console.log(err);
      setFeedback(err.response?.data?.message || "Failed to send request");
    } finally {
      setRequestLoading(null);
    }
  };

  // FETCH CHATS
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await fetchFriends();
        console.log(response.requests);
        setUserChats(response.requests);
      } catch (error) {
        console.log(error);
        setFeedback("Failed to detect chats.");
      }
    }
  })

  return (
    <div className="w-[300px] bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* TOP BAR */}
      <div className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            C
          </div>
          <h2 className="text-gray-800 dark:text-gray-200 font-semibold">
            ChatApp
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification */}
          <div className="relative">
            <Bell
              size={20}
              className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500"
              onClick={() => navigate("/notifications")}
            />

            {sentRequests.length > 0 ? (
              <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                {sentRequests.length }
              </span>
            ) : ("")}
          </div>

          {/* Settings */}
          <div className="relative" ref={dropdownRef}>
            <Settings
              className="cursor-pointer"
              onClick={() => setOpen(!open)}
            />

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow z-50">
                <div
                  onClick={() => setShowProfile(true)}
                  className="p-2 hover:bg-gray-100 cursor-pointer"
                >
                  Edit Profile
                </div>

                <div className="p-2 text-red-500 cursor-pointer hover:bg-gray-100">
                  Logout
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-3 pb-3 relative">
        <Search size={16} className="absolute left-5 top-3 text-gray-400" />

        <input
          placeholder="Search users..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
          className="w-full pl-10 pr-3 h-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
        />
      </div>

      {/* AI CHAT */}
      <div
        onClick={() =>
          setSelectedChat({
            id: "ai",
            name: "AI Assistant",
            isAI: true,
          })
        }
        className="mx-3 mb-2 flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-lg">
          🤖
        </div>

        <div>
          <h3 className="font-medium text-gray-900 dark:text-white">
            AI Assistant
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Ask anything
          </p>
        </div>
      </div>

      {/* USERS LIST */}
      <div className="flex-1 overflow-y-auto">
        {/* EMPTY STATE */}
        {!loading && searchUser && userChats.length === 0 && (
          <p className="text-center text-sm text-gray-500 mt-4">
            No users found
          </p>
        )}

        {userChats.map((user) => (
          <div
            key={user._id}
            className="flex items-center justify-between p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            {/* USER INFO */}
            <div
              onClick={() => setSelectedChat(user)}
              className="flex items-center gap-3 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="flex items-center justify-center h-full">
                    {user.name?.charAt(0)}
                  </span>
                )}
              </div>

              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.username}</p>
              </div>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => handleSendRequest(user._id)}
              disabled={
                sentRequests.includes(user._id) || requestLoading === user._id
              }
              className={`px-3 py-1 text-sm rounded-lg transition
                ${
                  sentRequests.includes(user._id)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {requestLoading === user._id
                ? "Sending..."
                : sentRequests.includes(user._id)
                  ? "Request Sent"
                  : "Add"}
            </button>
          </div>
        ))}
      </div>

      {/* MODAL */}
      <EditProfile isOpen={showProfile} onClose={() => setShowProfile(false)} />

      {/* LOADING */}
      {loading && (
        <p className="text-center text-sm text-gray-500 py-2">Searching...</p>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <p className="text-center text-sm text-green-500 py-2">{feedback}</p>
      )}
    </div>
  );
};

export default Sidebar;
