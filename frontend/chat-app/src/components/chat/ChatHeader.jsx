import { Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ selectedChat }) => {
  if (!selectedChat) return null;

  return (
    <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">

      {/* User Info */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-300"></div>
        <div>
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            {selectedChat.name}
          </p>
          <p className="text-sm text-green-500">
            {selectedChat.isAI ? "AI Assistant" : "Online"}
          </p>
        </div>
      </div>

      {/* Actions */}
      {!selectedChat.isAI && (
        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
          <Phone className="cursor-pointer hover:text-blue-500" size={20} />
          <Video className="cursor-pointer hover:text-blue-500" size={20} />
          <MoreVertical className="cursor-pointer" size={20} />
        </div>
      )}
    </div>
  );
};

export default ChatHeader;