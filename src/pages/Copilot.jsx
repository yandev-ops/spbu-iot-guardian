import { useEffect, useState, useRef } from "react";
import { routeQuery } from "../logic/intentRouter.js";
import { refreshAllInventoryStatuses } from "../logic/stateMachine.js";
import ChatBubble from "../components/ChatBubble.jsx";

const SUGGESTED_PROMPTS = [
  "Perangkat mana yang butuh maintenance minggu ini?",
  "Ada berapa perangkat kritis sekarang?",
  "Cek stok spare part yang menipis",
];

function Copilot() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetch("/mock_data.json")
      .then((res) => res.json())
      .then((json) =>
        setData({
          devices: json.devices,
          spareParts: refreshAllInventoryStatuses(json.spare_parts),
        })
      );
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    if (!text.trim() || !data) return;
    setMessages((prev) => [...prev, { role: "user", text }]);
    setQuery("");
    setIsTyping(true);

    // Simulasi jeda "mengetik" agar terasa natural seperti chat AI
    setTimeout(() => {
      const result = routeQuery(text, data);
      setMessages((prev) => [...prev, { role: "assistant", text: result.response_summary }]);
      setIsTyping(false);
    }, 500);
  };

  const handleAsk = () => sendMessage(query);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-4rem)]">
      {/* ===== HEADER ===== */}
      <div className="px-1 pb-3 shrink-0">
        <h2 className="text-xl font-bold text-slate-900">AI Copilot</h2>
        <p className="text-xs text-slate-400">Tanya apa saja soal perangkat & inventory SPBU</p>
      </div>

      {/* ===== CHAT AREA ===== */}
      <div className="flex-1 overflow-y-auto -mx-6 px-6 space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="pt-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            </div>
            <p className="text-sm text-slate-500 mb-4">
              Halo! Aku siap bantu cek status perangkat, jadwal maintenance, atau stok spare part. Coba salah satu pertanyaan ini:
            </p>
            <div className="space-y-2">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="w-full text-left text-sm text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <ChatBubble key={i} role={m.role} text={m.text} />
        ))}

        {isTyping && <ChatBubble role="assistant" typing />}

        <div ref={scrollRef} />
      </div>

      {/* ===== INPUT BAR ===== */}
      <div className="shrink-0 -mx-6 px-6 pt-3 pb-1 bg-slate-50 border-t border-slate-100">
        <div className="flex gap-2 items-end">
          <input
            className="flex-1 border border-slate-200 rounded-full px-4 text-sm h-11 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            placeholder="Tanya sesuatu..."
          />
          <button
            onClick={handleAsk}
            disabled={!query.trim()}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-blue-600 text-white disabled:bg-slate-300 transition-colors shrink-0"
            aria-label="Kirim"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Copilot;
