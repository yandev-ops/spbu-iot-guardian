import { useEffect, useState } from "react";
import { routeQuery } from "../logic/intentRouter.js";

function Copilot() {
  const [data, setData] = useState(null);
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/mock_data.json")
      .then((res) => res.json())
      .then((json) =>
        setData({ devices: json.devices, spareParts: json.spare_parts })
      );
  }, []);

  const handleAsk = () => {
    if (!query.trim() || !data) return;
    const result = routeQuery(query, data);
    setMessages((prev) => [...prev, { role: "user", text: query }, { role: "assistant", text: result.response_summary }]);
    setQuery("");
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">AI Copilot Chat</h2>

      {/* STUB: tampilan sementara, akan diganti komponen ChatBubble nanti */}
      <div className="bg-white border rounded-md p-4 h-80 overflow-y-auto mb-3 space-y-2">
        {messages.length === 0 && (
          <p className="text-slate-400 text-sm">
            Coba tanya: "perangkat mana yang butuh maintenance minggu ini?"
          </p>
        )}
        {messages.map((m, i) => (
          <p key={i} className={m.role === "user" ? "font-medium" : "text-slate-600"}>
            {m.role === "user" ? "🧑 " : "🤖 "}
            {m.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAsk()}
          placeholder="Tanya sesuatu..."
        />
        <button
          onClick={handleAsk}
          className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm"
        >
          Kirim
        </button>
      </div>
    </div>
  );
}

export default Copilot;
