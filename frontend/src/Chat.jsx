import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Loader2 } from "lucide-react";
import content from "./content.json";

const SUGGESTIONS = [
  "What is WebGPT?",
  "Has Saket shipped agents to production?",
  "Why is he a fit for a Forward Deployed Engineer role?",
  "Summarize his experience in three lines."
];

const GREETING = {
  role: "assistant",
  content:
    "Hi! I'm Saket's AI assistant — I know his whole resume. Ask about his projects or forward-deployed work, or paste a job description and I'll tell you exactly why he fits."
};

export default function Chat({ onActions }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const openIt = () => setOpen(true);
    window.addEventListener("open-ask-saket", openIt);
    return () => window.removeEventListener("open-ask-saket", openIt);
  }, []);

  useEffect(() => {
    if (open && listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, loading, open]);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  async function send(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || loading) return;
    setError("");
    const next = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.role === "user" || m.role === "assistant")
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
      setMessages((m) => [...m, { role: "assistant", content: data.reply || "…" }]);
      if (Array.isArray(data.actions) && data.actions.length && onActions) onActions(data.actions);
    } catch (err) {
      setError(err.message);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: `Sorry — ${err.message} You can email Saket directly at ${content.email}.` }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <>
      <button className={`chat-fab ${open ? "hidden" : ""}`} onClick={() => setOpen(true)} aria-label="Ask Saket">
        <Sparkles size={18} /> Ask Saket
      </button>

      {open && (
        <div className="chat-panel" role="dialog" aria-label="Ask Saket">
          <div className="chat-header">
            <div className="chat-title"><Sparkles size={16} /> Ask-Saket</div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg msg-${m.role}`}>{m.content}</div>
            ))}
            {loading && (
              <div className="msg msg-assistant typing"><Loader2 className="spin" size={15} /> thinking…</div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="chat-suggestions">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="chip">{s}</button>
              ))}
            </div>
          )}

          <div className="chat-input">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              placeholder="Ask anything, or paste a job description…"
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKey}
            />
            <button className="chat-send" onClick={() => send()} disabled={loading || !input.trim()} aria-label="Send">
              <Send size={18} />
            </button>
          </div>
          {error && <div className="chat-error">{error}</div>}
          <div className="chat-foot">AI can be wrong — verify specifics with Saket.</div>
        </div>
      )}
    </>
  );
}
