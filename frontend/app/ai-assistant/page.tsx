"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";

const SUGGESTIONS = [
  "What fish can I keep with a Betta?",
  "How do I cycle a new aquarium?",
  "Why is my fish not eating?",
  "Best plants for a low-light tank?",
  "How often should I change water?",
  "What causes cloudy aquarium water?",
];

const GREETING = {
  role: "assistant",
  content: "Hi! I'm AquaBot - your personal aquarium expert. Ask me anything about fish care, tank setup, water chemistry, or product recommendations. How can I help you today?",
};

type Tab = "chat" | "identify";

export default function AIAquaAssistantPage() {
  const [tab, setTab] = useState<Tab>("chat");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const [identifying, setIdentifying] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;

    const userMsg = { role: "user", content: userText };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const assistantMsg = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) {
        let errText = "AI unavailable";
        try {
          const err = await res.json();
          errText = err.error || err.detail || errText;
        } catch {}
        throw new Error(errText);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: updated[updated.length - 1].content + chunk };
            return updated;
          });
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: `⚠ ${message}`,
        };
        return updated;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const rendered = parts.map((part, j) =>
        j % 2 === 1 ? <strong key={j} style={{ color: "#fff", fontWeight: 700 }}>{part}</strong> : part
      );
      const isBullet = line.startsWith("- ") || line.startsWith("• ");
      return (
        <p key={i} style={{ margin: isBullet ? "3px 0 3px 12px" : "4px 0", lineHeight: 1.65, color: "rgba(255,255,255,0.85)", fontSize: 14 }}>
          {isBullet && <span style={{ color: "#4dd9e8", marginRight: 6 }}>•</span>}
          {isBullet ? rendered.slice(1) : rendered}
        </p>
      );
    });
  };

  const handleFile = (file?: File) => {
    if (!file) return;
    setImage(file);
    setResult("");
    setPreview(URL.createObjectURL(file));
  };

  const identify = async () => {
    if (!image) return;
    setIdentifying(true);
    setResult("");

    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      const res = await fetch("/api/ai/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: image.type,
        }),
      });

      const data = (await res.json()) as { result?: string; error?: string };

      if (!res.ok) {
        setResult(`Error: ${data.error || "Something went wrong."}`);
      } else {
        setResult(data.result || "Could not identify.");
      }
    } catch {
      setResult("Network error. Please check your connection and try again.");
    } finally {
      setIdentifying(false);
    }
  };

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: "#0a0e1a", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <header
        style={{
          background: "rgba(10,14,26,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "14px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link href="/dashboard" style={{ color: "rgba(255,255,255,0.4)", fontSize: 20, textDecoration: "none" }}>←</Link>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 18,
            }}
          >
            🐠
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>AI Aqua Assistant</p>
            <p
              style={{
                color: "#4ade80",
                fontSize: 11,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
              Online · Powered by Gemini AI
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button
            onClick={() => { setTab("chat"); setMessages([GREETING]); }}
            style={{
              background: tab === "chat" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "6px 14px",
              color: tab === "chat" ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: tab === "chat" ? 600 : 400,
            }}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setTab("identify")}
            style={{
              background: tab === "identify" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 20,
              padding: "6px 14px",
              color: tab === "identify" ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: 12,
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: tab === "identify" ? 600 : 400,
            }}
          >
            🔬 Identify
          </button>
        </div>
      </header>

      {tab === "chat" && (
        <>
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 16px",
              maxWidth: 760,
              width: "100%",
              margin: "0 auto",
              boxSizing: "border-box",
            }}
          >
            {messages.length === 1 && (
              <div style={{ marginBottom: 24 }}>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, marginBottom: 12, textAlign: "center" }}>
                  Try asking about:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => sendMessage(s)}
                      style={{
                        background: "rgba(255,255,255,0.05)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: 20,
                        padding: "8px 14px",
                        color: "rgba(255,255,255,0.7)",
                        fontSize: 12,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(77,217,232,0.4)";
                        e.currentTarget.style.color = "#fff";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    alignItems: "flex-end",
                    gap: 10,
                  }}
                >
                  {msg.role === "assistant" && (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      🐠
                    </div>
                  )}

                  <div
                    style={{
                      maxWidth: "75%",
                      background:
                        msg.role === "user"
                          ? "linear-gradient(135deg,#2d9cdb,#4dd9e8)"
                          : "rgba(255,255,255,0.05)",
                      border: msg.role === "user" ? "none" : "1px solid rgba(255,255,255,0.08)",
                      borderRadius:
                        msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding: "12px 16px",
                    }}
                  >
                    {msg.role === "assistant" && msg.content === "" ? (
                      <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
                        {[0, 1, 2].map((n) => (
                          <div
                            key={n}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: "#4dd9e8",
                              animation: `bounce 1.2s ease-in-out ${n * 0.2}s infinite`,
                            }}
                          />
                        ))}
                      </div>
                    ) : msg.role === "user" ? (
                      <p style={{ color: "#fff", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{msg.content}</p>
                    ) : (
                      renderContent(msg.content)
                    )}
                  </div>

                  {msg.role === "user" && (
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "rgba(255,255,255,0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        flexShrink: 0,
                      }}
                    >
                      👤
                    </div>
                  )}
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
          </div>

          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(10,14,26,0.95)",
              padding: "16px",
              position: "sticky",
              bottom: 0,
            }}
          >
            <div
              style={{
                maxWidth: 760,
                margin: "0 auto",
                display: "flex",
                gap: 10,
                alignItems: "flex-end",
              }}
            >
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about fish, tanks, water chemistry..."
                rows={1}
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14,
                  padding: "13px 16px",
                  color: "#fff",
                  fontSize: 14,
                  fontFamily: "inherit",
                  outline: "none",
                  resize: "none",
                  lineHeight: 1.5,
                  maxHeight: 120,
                  overflowY: "auto",
                  transition: "border-color 0.2s",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(77,217,232,0.4)")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  background: !input.trim() || loading ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
                  border: "none",
                  color: "#fff",
                  fontSize: 18,
                  cursor: !input.trim() || loading ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "background 0.2s",
                }}
              >
                {loading ? "⏳" : "↑"}
              </button>
            </div>
            <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, textAlign: "center", marginTop: 8 }}>
              Press Enter to send · Shift+Enter for new line
            </p>
          </div>
        </>
      )}

      {tab === "identify" && (
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 16px",
            maxWidth: 620,
            width: "100%",
            margin: "0 auto",
            boxSizing: "border-box",
          }}
        >
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
            AI Powered
          </p>
          <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Fish Identifier 🔬</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, marginBottom: 32 }}>
            Upload a photo of any fish and get instant species identification and care guide.
          </p>

          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              handleFile(e.dataTransfer.files[0]);
            }}
            style={{
              border: "2px dashed rgba(77,217,232,0.3)",
              borderRadius: 16,
              height: preview ? "auto" : 200,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              marginBottom: 20,
              overflow: "hidden",
              transition: "border-color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = "rgba(77,217,232,0.6)")}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(77,217,232,0.3)")}
          >
            {preview ? (
              <img src={preview} alt="Preview" style={{ width: "100%", maxHeight: 320, objectFit: "contain", borderRadius: 14 }} />
            ) : (
              <>
                <p style={{ fontSize: 40 }}>📷</p>
                <p style={{ color: "#4dd9e8", fontWeight: 600, marginTop: 12 }}>Click or drag a photo here</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, marginTop: 4 }}>
                  JPG, PNG, WEBP supported
                </p>
              </>
            )}
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <button
            onClick={identify}
            disabled={!image || identifying}
            style={{
              width: "100%",
              background: !image ? "rgba(255,255,255,0.06)" : "linear-gradient(135deg,#2d9cdb,#4dd9e8)",
              border: "none",
              borderRadius: 12,
              padding: "14px 0",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              cursor: !image || identifying ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              marginBottom: 24,
            }}
          >
            {identifying ? "Identifying..." : "Identify Fish →"}
          </button>

          {result && (
            <div
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 16,
                padding: 24,
              }}
            >
              <p style={{ color: "#4dd9e8", fontWeight: 700, fontSize: 13, marginBottom: 14 }}>
                🔬 Identification Result
              </p>
              {result.split("\n").map((line, i) => (
                <p key={i} style={{ color: "rgba(255,255,255,0.8)", fontSize: 14, lineHeight: 1.7, marginBottom: 4 }}>
                  {line.split(/\*\*(.*?)\*\*/g).map((part, j) =>
                    j % 2 === 1 ? <strong key={j} style={{ color: "#fff" }}>{part}</strong> : part
                  )}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30%            { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
