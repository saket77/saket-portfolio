import { useEffect, useRef, useState } from "react";
import { X, Send, Sparkles, Loader2, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
  const [expanded, setExpanded] = useState(false);
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

    // Append streamed text to the in-progress assistant bubble (created on first token).
    let started = false;
    const appendToken = (value) => {
      setMessages((m) => {
        if (!started) {
          started = true;
          return [...m, { role: "assistant", content: value }];
        }
        const copy = m.slice();
        const last = copy[copy.length - 1];
        copy[copy.length - 1] = { ...last, content: last.content + value };
        return copy;
      });
    };

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.filter((m) => m.role === "user" || m.role === "assistant")
        })
      });
      // Pre-stream errors (rate limit / not configured / bad request) arrive as JSON.
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Request failed (${res.status}).`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let streamError = null;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let sep;
        while ((sep = buffer.indexOf("\n\n")) !== -1) {
          const raw = buffer.slice(0, sep).trim();
          buffer = buffer.slice(sep + 2);
          if (!raw.startsWith("data:")) continue;
          let evt;
          try { evt = JSON.parse(raw.slice(5).trim()); } catch { continue; }
          if (evt.type === "token") appendToken(evt.value);
          else if (evt.type === "action" && onActions) onActions([evt.action]);
          else if (evt.type === "error") streamError = evt.message;
        }
      }

      if (streamError) throw new Error(streamError);
      if (!started) appendToken("…"); // model produced no text
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
        <div className={`chat-panel ${expanded ? "expanded" : ""}`} role="dialog" aria-label="Ask Saket">
          <div className="chat-header">
            <div className="chat-title"><Sparkles size={16} /> Ask-Saket</div>
            <div className="chat-header-actions">
              <button className="chat-icon-btn" onClick={() => setExpanded((v) => !v)} aria-label={expanded ? "Shrink chat" : "Expand chat"}>
                {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat"><X size={18} /></button>
            </div>
          </div>

          <div className="chat-messages" ref={listRef}>
            {messages.map((m, i) => (
              <div key={i} className={`msg msg-${m.role}`}>
                {m.role === "assistant"
                  ? <div className="md"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown></div>
                  : m.content}
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
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
