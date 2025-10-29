import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaUser, FaComments, FaTimes } from "react-icons/fa";
import { sendMessage } from "../../api/chatApi";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      setMessages([
        {
          role: "assistant",
          content:
            "🤖 Xin chào! Tôi là trợ lý TienTech. Tôi có thể giúp gì cho bạn hôm nay?",
          time: new Date(),
        },
      ]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted]);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input, time: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessage(input);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, time: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Xin lỗi, tôi không thể trả lời lúc này.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (date) =>
    `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

  return (
    <>
      {/* Nút mở chat */}
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "15px",
          right: "15px",
          zIndex: 9999,
          cursor: "pointer",
          transition: "transform 0.2s",
        }}
        className="chat-toggle-btn"
      >
        <div
          style={{
            background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
            color: "#fff",
            padding: "14px",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          className="hover-scale"
        >
          {isOpen ? <FaTimes size={22} /> : <FaComments size={26} />}
        </div>
      </div>

      {/* Khung chat */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "70px",
            right: "20px",
            width: "360px",
            height: "480px",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            overflow: "hidden",
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1rem",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
            }}
          >
            <FaRobot className="me-2" />
            TienTech Trợ lý
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)"
                        : "#e2e3e5",
                    color: msg.role === "user" ? "#fff" : "#333",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    maxWidth: "75%",
                    wordBreak: "break-word",
                    boxShadow:
                      msg.role === "user"
                        ? "0 2px 8px rgba(0,0,0,0.15)"
                        : "0 1px 4px rgba(0,0,0,0.1)",
                    position: "relative",
                    transition: "all 0.2s",
                  }}
                  className="chat-message"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      fontSize: "0.75rem",
                      marginBottom: "4px",
                      opacity: 0.8,
                    }}
                  >
                    {msg.role === "user" ? (
                      <FaUser className="me-1" />
                    ) : (
                      <FaRobot className="me-1" />
                    )}
                    {msg.role === "user" ? "Bạn" : "AI"} •{" "}
                    {formatTime(msg.time)}
                  </div>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div
                style={{
                  textAlign: "center",
                  color: "#888",
                  fontSize: "0.8rem",
                }}
              >
                AI đang trả lời...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            style={{
              display: "flex",
              padding: "12px",
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <input
              type="text"
              className="form-control me-2"
              placeholder="Nhập tin nhắn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSend(e);
              }}
              style={{
                borderRadius: "20px",
                padding: "8px 16px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                padding: "8px 16px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                transition: "all 0.2s",
              }}
              className="hover-scale"
            >
              Gửi
            </button>
          </form>
        </div>
      )}
      {/* Hover effect */}
      <style>
        {`
          .hover-scale:hover {
            transform: scale(1.05);
            box-shadow: 0 4px 14px rgba(0,0,0,0.25);
          }
          .chat-message:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;
