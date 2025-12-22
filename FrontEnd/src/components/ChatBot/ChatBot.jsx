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
import "./ChatBot.scss";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fullMode, setFullMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState("");

  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [hasGreeted, setHasGreeted] = useState(false);

  const user = useSelector((state) => state.user.user);
  const userId = user?.id || null;

  const quickActions = [
    "Tìm sản phẩm theo nhu cầu",
    "Xem sản phẩm đang giảm giá",
    "Tra cứu đơn hàng",
    "Chính sách bảo hành",
    "Gợi ý sản phẩm phù hợp",
  ];

  const autoComplete = [
    "Kiểm tra đơn hàng của tôi",
    "Giảm giá hôm nay có gì?",
    "Laptop văn phòng",
    "PC gaming 15 triệu",
    "Điện thoại tầm giá 7 triệu",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  const formatTime = (date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const addMessage = (role, content) => {
    setMessages((prev) => [...prev, { role, content, time: new Date() }]);
  };

  useEffect(() => {
    if (isOpen && messages.length === 0 && !hasGreeted) {
      setHasGreeted(true);

      setTimeout(() => {
        addMessage(
          "assistant",
          "👋 Xin chào! Tôi có thể giúp gì cho bạn hôm nay?"
        );
      }, 300);
    }
  }, [isOpen, messages.length, hasGreeted]);

  const streamText = useCallback(async (text) => {
    setTyping("");
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 8));
      setTyping((prev) => prev + text[i]);
    }
    addMessage("assistant", text);
    setTyping("");
  }, []);

  const sendText = async (text) => {
    if (!text.trim() || loading) return;

    setLoading(true);
    addMessage("user", text);

    try {
      const reply = await sendMessage(text, userId);
      await streamText(reply);
    } catch (err) {
      console.error(err);
      await streamText("Xin lỗi, hệ thống đang bận 😥");
    }

    setLoading(false);
  };

  const handleSend = (e) => {
    e.preventDefault();
    sendText(input);
    setInput("");
  };

  const filteredAutocomplete =
    input.length > 1
      ? autoComplete.filter((s) =>
          s.toLowerCase().includes(input.toLowerCase())
        )
      : [];

  return (
    <>
      {/* ===== BUTTON ===== */}
      <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <div className="button-inner">
          {isOpen ? <FaTimes size={22} /> : <FaComments size={26} />}
        </div>
      </div>

      {/* ===== CHAT WINDOW ===== */}
      {isOpen && (
        <div className={`chatbot-window ${fullMode ? "full-mode" : ""}`}>
          {/* ===== HEADER ===== */}
          <div className="header">
            <span>
              <FaRobot className="me-2" /> TienTech AI
            </span>
            <button onClick={() => setFullMode(!fullMode)}>
              {fullMode ? <FaCompress /> : <FaExpand />}
            </button>
          </div>

          {/* ===== MESSAGES ===== */}
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="avatar">
                    <FaRobot />
                  </div>
                )}

                <div className="bubble">
                  <div className="time">
                    {msg.role === "user" ? "Bạn" : "AI"} •{" "}
                    {formatTime(msg.time)}
                  </div>
                  {msg.content}
                </div>

                {msg.role === "user" && (
                  <div className="avatar">
                    <FaUser />
                  </div>
                )}
              </div>
            ))}

            {/* ===== LOADING ===== */}
            {loading && !typing && (
              <div className="message assistant">
                <div className="bubble">
                  AI đang phản hồi<span className="dots"></span>
                </div>
              </div>
            )}

            {typing && (
              <div className="message assistant">
                <div className="bubble">{typing}</div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ===== QUICK ACTIONS ===== */}
          <div className="quick-actions">
            {quickActions.map((q) => (
              <div key={q} className="action" onClick={() => sendText(q)}>
                {q}
              </div>
            ))}
          </div>

          {/* ===== INPUT ===== */}
          <form onSubmit={handleSend} className="input-box">
            <div className="input-wrapper">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập tin nhắn..."
                disabled={loading}
              />

              {filteredAutocomplete.length > 0 && (
                <div className="autocomplete">
                  {filteredAutocomplete.map((s, i) => (
                    <div key={i} onClick={() => setInput(s)}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button disabled={loading || !input.trim()}>Gửi</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
