import { useState } from "react";
import { Send } from "lucide-react";

const AIChatBox = () => {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const askAI = () => {
    if (!msg.trim()) return;

    setMessages((prev) => [
      ...prev,
      { type: "user", text: msg },
      { type: "ai", text: "AI response..." },
    ]);

    setMsg("");
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-2 flex flex-col h-[250px]">

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-1 mb-2 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`${
              m.type === "user"
                ? "text-right text-blue-500"
                : "text-left text-gray-700 dark:text-gray-200"
            }`}
          >
            {m.text}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="flex items-center gap-1">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Ask AI..."
          className="flex-1 px-2 py-1 rounded-lg text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 outline-none"
        />

        <button
          onClick={askAI}
          className="bg-blue-500 text-white p-1.5 rounded-full"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default AIChatBox;