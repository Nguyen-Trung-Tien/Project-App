import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FaRobot,
  FaComments,
  FaTimes,
  FaUser,
  FaExpand,
  FaCompress,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { sendMessage } from "../../api/chatApi";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullMode, setFullMode] = useState(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [typing, setTyping] = useState("");
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const user = useSelector((state) => state.user.user);
  const userId = user?.id || null;

  /** Quick actions */
  const quickActions = [
    "🔍 Tìm sản phẩm theo nhu cầu",
    "🔥 Xem sản phẩm đang giảm giá",
    "📦 Tra cứu đơn hàng",
    "📋 Chính sách bảo hành",
    "💡 Gợi ý sản phẩm phù hợp",
  ];

  /** Autocomplete gợi ý */
  const autoComplete = [
    "Kiểm tra đơn hàng của tôi",
    "Giảm giá hôm nay có gì?",
    "Tìm laptop văn phòng",
    "Tư vấn PC gaming 15 triệu",
    "Điện thoại tầm giá 7 triệu",
  ];

  /** Auto scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  /** Focus input */
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  /** Format time */
  const formatTime = (date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  /** Add message */
  const addMessage = (role, content, type = "text") => {
    setMessages((prev) => [...prev, { role, content, type, time: new Date() }]);
  };

  /** Streaming effect (giống ChatGPT) */
  const streamText = useCallback(async (text) => {
    setTyping("");
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 8));
      setTyping((prev) => prev + text[i]);
    }
    addMessage("assistant", text);
    setTyping("");
  }, []);

  /** Handle send */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");

    addMessage("user", userText);
    setLoading(true);

    try {
      let reply = await sendMessage(userText, userId);

      if (/không hiểu|xin lỗi/i.test(reply)) {
        reply += `
Tôi có thể giúp bạn:
• Kiểm tra đơn hàng
• Tìm sản phẩm
• Xem giảm giá
• Gợi ý theo nhu cầu`;
      }

      await streamText(reply);
    } catch (e) {
      console.log(e);
      await streamText("Xin lỗi, hệ thống đang bận. Vui lòng thử lại 😥");
    }

    setLoading(false);
  };

  /** Autocomplete khi gõ */
  const filteredAutocomplete =
    input.length > 1
      ? autoComplete.filter((s) =>
          s.toLowerCase().includes(input.toLowerCase())
        )
      : [];

  return (
    <>
      {/* Button open */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed",
          bottom: "22px",
          right: "20px",
          zIndex: 9999,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg,#4facfe,#00f2fe)",
            color: "#fff",
            padding: "14px",
            borderRadius: "50%",
            boxShadow: "0 4px 14px rgba(0,0,0,.28)",
            transition: ".25s",
          }}
        >
          {isOpen ? <FaTimes size={22} /> : <FaComments size={26} />}
        </div>
      </div>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: fullMode ? "420px" : "360px",
            height: fullMode ? "560px" : "480px",
            background: "#fff",
            display: "flex",
            flexDirection: "column",
            borderRadius: "18px",
            boxShadow: "0 12px 34px rgba(0,0,0,.25)",
            animation: "chatOpen .25s ease",
            overflow: "hidden",
            zIndex: 9998,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(90deg,#4facfe,#00f2fe)",
              color: "#fff",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span>
              <FaRobot className="me-2" /> TienTech AI
            </span>

            <button
              onClick={() => setFullMode(!fullMode)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              {fullMode ? <FaCompress /> : <FaExpand />}
            </button>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              padding: "12px",
              overflowY: "auto",
              background: "#f6f8fa",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                  alignItems: "flex-end",
                  gap: "6px",
                  marginBottom: "10px",
                }}
              >
                {/* Avatar */}
                {msg.role === "assistant" && (
                  <div
                    style={{
                      background: "#fff",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,.15)",
                    }}
                  >
                    <FaRobot color="#4facfe" />
                  </div>
                )}

                <div
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg,#4facfe,#00d0fe)"
                        : "#fff",
                    color: msg.role === "user" ? "#fff" : "#333",
                    padding: "10px 14px",
                    borderRadius: "14px",
                    maxWidth: "75%",
                    wordBreak: "break-word",
                    boxShadow: "0 2px 10px rgba(0,0,0,.14)",
                    animation: "fadeIn .2s ease",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      marginBottom: "4px",
                      opacity: 0.6,
                    }}
                  >
                    {msg.role === "user" ? "Bạn" : "AI"} •{" "}
                    {formatTime(msg.time)}
                  </div>
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div
                    style={{
                      background: "#fff",
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 6px rgba(0,0,0,.15)",
                    }}
                  >
                    <FaUser />
                  </div>
                )}
              </div>
            ))}

            {/* Typing */}
            {typing && (
              <div
                style={{
                  background: "#fff",
                  padding: "10px 14px",
                  borderRadius: "14px",
                  width: "fit-content",
                  marginBottom: "10px",
                  animation: "fadeIn .2s ease",
                }}
              >
                {typing}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          <div
            style={{
              padding: "8px",
              display: "flex",
              gap: "8px",
              overflowX: "auto",
              background: "#fff",
            }}
          >
            {quickActions.map((q) => (
              <div
                key={q}
                onClick={() => {
                  setInput(q.replace(/^[^ ]+ /, ""));
                  setTimeout(() => handleSend({ preventDefault() {} }), 50);
                }}
                style={{
                  padding: "6px 10px",
                  background: "#eef3f7",
                  borderRadius: "14px",
                  fontSize: ".8rem",
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {q}
              </div>
            ))}
          </div>

          {/* Input box */}
          <form
            onSubmit={handleSend}
            style={{
              padding: "10px",
              borderTop: "1px solid #ddd",
              display: "flex",
              gap: "8px",
              background: "#fff",
            }}
          >
            <div style={{ position: "relative", flex: 1 }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Nhập tin nhắn..."
                className="form-control"
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !e.shiftKey && handleSend(e)
                }
                style={{
                  borderRadius: "18px",
                  padding: "10px 14px",
                }}
              />

              {/* Autocomplete */}
              {filteredAutocomplete.length > 0 && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "48px",
                    left: 0,
                    right: 0,
                    background: "#fff",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,.15)",
                    zIndex: 10,
                    padding: "6px 0",
                  }}
                >
                  {filteredAutocomplete.map((s, index) => (
                    <div
                      key={index}
                      onClick={() => setInput(s)}
                      style={{
                        padding: "8px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg,#4facfe,#00f2fe)",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "18px",
              }}
            >
              Gửi
            </button>
          </form>
        </div>
      )}

      <style>
        {`
          @keyframes chatOpen {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;
