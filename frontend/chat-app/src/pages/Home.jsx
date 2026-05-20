import { useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import Messages from "../components/chat/Messages";
import MessageInput from "../components/chat/MessageInput";

const Home = () => {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">

      <Sidebar setSelectedChat={setSelectedChat} />

      <div className="flex-1 flex flex-col">
        <ChatHeader selectedChat={selectedChat} />
        <Messages selectedChat={selectedChat} />
        <MessageInput selectedChat={selectedChat} />
      </div>

    </div>
  );
};

export default Home;