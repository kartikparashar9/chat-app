import { Search, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditProfile from "../profile/EditProfile";
import { searchApi } from "../../services/api";

const Sidebar = ({ setSelectedChat }) => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  const [userChats, setUserChats] = useState([]);
  const [searchUser, setSearchUser] = useState("");

  const dropdownRef = useRef();

  // CLOSE DROPDOWN
  useEffect(() => {
    const handleClick = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClick
      );
  }, []);

  // SEARCH USERS
  useEffect(() => {
  const searchUsers = async () => {
    try {
      setLoading(true);

      const response = await searchApi(searchUser);

      console.log(response);

      setUserChats(response);

      setFeedback("");
    } catch (error) {
      console.log(error);

      setFeedback("Failed to search users");
    } finally {
      setLoading(false);
    }
  };

  // EMPTY SEARCH
  if (!searchUser.trim()) {
    setUserChats([]);
    setFeedback("");
    return;
  }

  // DEBOUNCE
  const timer = setTimeout(() => {
    searchUsers();
  }, 500);

  return () => clearTimeout(timer);

}, [searchUser]);

  return (
    <div className="w-[300px] bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      {/* TOP BAR */}
      <div className="p-4 flex justify-between items-center">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            C
          </div>

          <h2 className="text-gray-800 dark:text-gray-200 font-semibold">
            ChatApp
          </h2>
        </div>

        {/* SETTINGS */}
        <div
          className="relative"
          ref={dropdownRef}
        >
          <Settings
            size={20}
            className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500"
            onClick={() =>
              setOpen(!open)
            }
          />

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-md z-20 overflow-hidden">
              {/* EDIT PROFILE */}
              <div
                onClick={() => {
                  setShowProfile(true);
                  setOpen(false);
                }}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm"
              >
                👤 Edit Profile
              </div>

              {/* LOGOUT */}
              <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-red-500">
                Logout
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-3 pb-3 relative">
        <Search
          size={16}
          className="absolute left-5 top-3 text-gray-400"
        />

        <input
          placeholder="Search users..."
          value={searchUser}
          onChange={(e) =>
            setSearchUser(
              e.target.value
            )
          }
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

      {/* LOADING */}
      {loading && (
        <p className="text-center text-sm text-gray-500 py-2">
          Searching...
        </p>
      )}

      {/* FEEDBACK */}
      {feedback && (
        <p className="text-center text-sm text-red-500 py-2">
          {feedback}
        </p>
      )}

      {/* USERS */}
      <div className="flex-1 overflow-y-auto">
        {/* NO USERS */}
        {!loading &&
          searchUser &&
          userChats.length === 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              No users found
            </p>
          )}

        {userChats.map((chat) => (
          <div
            key={chat._id}
            onClick={() =>
              setSelectedChat(chat)
            }
            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
          >
            {/* AVATAR */}
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {chat.avatar ? (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm font-semibold text-gray-700">
                  {chat.name
                    ?.charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>

            {/* USER INFO */}
            <div className="flex flex-col">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {chat.name}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                @{chat.username}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* EDIT PROFILE MODAL */}
      <EditProfile
        isOpen={showProfile}
        onClose={() =>
          setShowProfile(false)
        }
      />
    </div>
  );
};

export default Sidebar;