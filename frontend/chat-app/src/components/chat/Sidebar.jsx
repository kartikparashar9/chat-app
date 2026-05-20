import { Search, Settings } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import EditProfile from "../profile/EditProfile";

const Sidebar = ({ setSelectedChat }) => {
  const [open, setOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

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
        <div className="relative" ref={dropdownRef}>
          <Settings
            size={20}
            className="cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-500"
            onClick={() => setOpen(!open)}
          />

          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-lg shadow-md z-20 overflow-hidden">

              {/* 👤 EDIT PROFILE */}
              <div
                onClick={() => {
                  setShowProfile(true);
                  setOpen(false); // close dropdown
                }}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm"
              >
                👤 Edit Profile
              </div>

              {/* 🚪 LOGOUT */}
              <div className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer text-sm text-red-500">
                Logout
              </div>

            </div>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <div className="px-3 pb-3 relative">
        <Search size={16} className="absolute left-5 top-3 text-gray-400" />
        <input
          placeholder="Search chats..."
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
        className="mx-3 mb-2 flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        🤖 AI Assistant
      </div>

      {/* USERS */}
      <div className="flex-1 overflow-y-auto">
        {[1, 2, 3, 4].map((user) => (
          <div
            key={user}
            onClick={() =>
              setSelectedChat({
                id: user,
                name: `User ${user}`,
                isAI: false,
              })
            }
            className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
            <p>User {user}</p>
          </div>
        ))}
      </div>

      {/* 👇 MODAL OUTSIDE EVERYTHING (IMPORTANT FIX) */}
      <EditProfile
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

    </div>
  );
};

export default Sidebar;