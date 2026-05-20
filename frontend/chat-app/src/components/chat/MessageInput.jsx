import { Send, Smile, Mic } from "lucide-react";
import Input from "../common/Input";

const MessageInput = () => {
  return (
    <div className="p-3 flex items-center gap-2 border-t dark:border-gray-700">

      <Smile className="cursor-pointer" />

      <Input placeholder="Type message..." />

      <Mic className="cursor-pointer" />

      <button className="bg-blue-500 p-2 rounded-full text-white">
        <Send size={16} />
      </button>

    </div>
  );
};

export default MessageInput;