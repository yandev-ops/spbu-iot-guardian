function TypingDots() {
  return (
    <div className="flex gap-1 items-center px-1">
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
    </div>
  );
}

function ChatBubble({ role, text, typing = false }) {
  const isUser = role === "user";

  return (
    <div className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      {isUser ? (
        <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
          Y
        </span>
      ) : (
        <span className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
          </svg>
        </span>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
          isUser
            ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
            : "bg-slate-100 text-slate-800 rounded-2xl rounded-bl-sm"
        }`}
      >
        {typing ? <TypingDots /> : text}
      </div>
    </div>
  );
}

export default ChatBubble;
