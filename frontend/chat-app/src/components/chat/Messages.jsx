const Messages = ({ selectedChat }) => {
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
      {selectedChat.isAI ? (
        <p className="text-gray-500">Start conversation with AI 🤖</p>
      ) : (
        <p className="text-gray-500">Chat messages here...</p>
      )}
    </div>
  );
};

export default Messages;