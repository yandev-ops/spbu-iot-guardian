function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
          isUser
            ? "bg-slate-900 text-white rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-bl-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
}

export default ChatBubble;
