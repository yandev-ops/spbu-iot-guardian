import { useEffect, useState } from "react";
import { routeQuery } from "../logic/intentRouter.js";
import { refreshAllInventoryStatuses } from "../logic/stateMachine.js";
import ChatBubble from "../components/ChatBubble.jsx";

function Copilot() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

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

  const handleAsk = () => {
    if (!query.trim() || !data) return;
    const result = routeQuery(query, data);
    setMessages((prev) => [...prev, { role: "user", text: query }, { role: "assistant", text: result.response_summary }]);
    setQuery("");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <h2 className="text-xl font-semibold mb-4 px-4">AI Copilot Chat</h2>

      <div className="flex-1 px-4">
        <div className="bg-white border rounded-md p-4 h-full overflow-y-auto mb-3 space-y-2 pb-28">
          {messages.length === 0 && (
            <p className="text-slate-400 text-sm">Coba tanya: "perangkat mana yang butuh maintenance minggu ini?"</p>
          )}
          {messages.map((m, i) => (
            <ChatBubble key={i} role={m.role} text={m.text} />
          ))}
        </div>
      </div>

      <div className="fixed left-0 right-0 px-4" style={{ bottom: 64 }}>
        <div className="bg-white/95 backdrop-blur-md border-t py-3 max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded-md px-3 text-sm h-11"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
              placeholder="Tanya sesuatu..."
            />
            <button
              onClick={handleAsk}
              className="bg-slate-900 text-white px-4 rounded-md text-sm h-11"
            >
              Kirim
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Copilot;
