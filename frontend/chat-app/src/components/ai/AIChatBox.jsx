// import { useState } from "react";
// import { Bot, Send, X } from "lucide-react";

// const AIChatBox = () => {
//   const [open, setOpen] = useState(false);
//   const [msg, setMsg] = useState("");
//   const [messages, setMessages] = useState([]);

//   const askAI = async () => {
//     if (!msg.trim()) return;

//     const userMsg = msg;

//     // UI update only
//     setMessages((prev) => [...prev, { type: "user", text: userMsg }]);
//     setMsg("");

//     try {
//       const res = await fetch("/api/ai", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ msg: userMsg }),
//       });

//       const data = await res.json();

//       setMessages((prev) => [
//         ...prev,
//         { type: "ai", text: data.reply || "AI response..." },
//       ]);
//     } catch {
//       setMessages((prev) => [
//         ...prev,
//         { type: "ai", text: "Error fetching response" },
//       ]);
//     }
//   };

//   return (
//     <>
//       {/* Floating Button */}
//       <button
//         onClick={() => setOpen(!open)}
//         className="fixed bottom-5 right-5 bg-blue-500 text-white p-3 rounded-full shadow-lg hover:opacity-90"
//       >
//         <Bot size={20} />
//       </button>

//       {/* Chat Box */}
//       {open && (
//         <div className="fixed bottom-20 right-5 w-[320px] h-[420px] bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex flex-col overflow-hidden">

//           {/* Header */}
//           <div className="flex justify-between items-center p-3 border-b dark:border-gray-700">
//             <span className="text-gray-800 dark:text-gray-200 font-medium">
//               AI Assistant
//             </span>
//             <X
//               size={18}
//               className="cursor-pointer text-gray-500 hover:text-red-500"
//               onClick={() => setOpen(false)}
//             />
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-3 space-y-2">
//             {messages.map((m, i) => (
//               <div
//                 key={i}
//                 className={`flex ${
//                   m.type === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`px-3 py-2 rounded-xl max-w-[75%] text-sm ${
//                     m.type === "user"
//                       ? "bg-blue-500 text-white"
//                       : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
//                   }`}
//                 >
//                   {m.text}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Input */}
//           <div className="p-2 border-t dark:border-gray-700 flex items-center gap-2">
//             <input
//               value={msg}
//               onChange={(e) => setMsg(e.target.value)}
//               placeholder="Ask something..."
//               className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 outline-none"
//             />

//             <button
//               onClick={askAI}
//               className="bg-blue-500 text-white p-2 rounded-full"
//             >
//               <Send size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AIChatBox;

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