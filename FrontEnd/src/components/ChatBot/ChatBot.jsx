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
  const addMessage = (role, content, type = "text", link = null) => {
    setMessages((prev) => [
      ...prev,
      { role, content, type, link, time: new Date() },
    ]);
  };

  /** Streaming effect */
  const streamText = useCallback(async (text) => {
    setTyping("");
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 8));
      setTyping((prev) => prev + text[i]);
    }
    addMessage("assistant", text);
    setTyping("");
  }, []);

  /** Kiểm tra link theo ID sản phẩm/đơn hàng */
  const checkForLinksById = (text) => {
    const productMatch = text.match(/sản phẩm\s+(\d+)/i);
    if (productMatch) {
      const productId = productMatch[1];
      return {
        type: "link",
        content: `Xem chi tiết sản phẩm #${productId}`,
        link: `http://localhost:5173/product-detail/${productId}`,
      };
    }

    const orderMatch = text.match(/đơn hàng\s+(\d+)/i);
    if (orderMatch) {
      const orderId = orderMatch[1];
      return {
        type: "link",
        content: `Xem chi tiết đơn hàng #${orderId}`,
        link: `http://localhost:5173/orders-detail/${orderId}`,
      };
    }

    return { type: "text", content: text };
  };

  /** Handle send */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput("");
    addMessage("user", userText);
    setLoading(true);

    try {
      // Kiểm tra link dựa trên ID ngay lập tức
      const linkResponse = checkForLinksById(userText);

      if (linkResponse.type === "link") {
        addMessage(
          "assistant",
          linkResponse.content,
          "link",
          linkResponse.link
        );
      } else {
        // Gọi API chỉ khi không có link
        const reply = await sendMessage(userText, userId);
        await streamText(reply);
      }
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
      <div className="chatbot-button" onClick={() => setIsOpen(!isOpen)}>
        <div className="button-inner">
          {isOpen ? <FaTimes size={22} /> : <FaComments size={26} />}
        </div>
      </div>

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className={`chatbot-window ${fullMode ? "full-mode" : ""}`}>
          {/* Header */}
          <div className="header">
            <span>
              <FaRobot className="me-2" /> TienTech AI
            </span>
            <button onClick={() => setFullMode(!fullMode)}>
              {fullMode ? <FaCompress /> : <FaExpand />}
            </button>
          </div>

          {/* Messages */}
          <div className="messages">
            {messages.map((msg, i) => (
              <div key={i} className={`message ${msg.role}`}>
                {msg.role === "assistant" && (
                  <div className="avatar">
                    <FaRobot color="#4facfe" />
                  </div>
                )}

                <div className="bubble">
                  <div className="time">
                    {msg.role === "user" ? "Bạn" : "AI"} •{" "}
                    {formatTime(msg.time)}
                  </div>

                  {msg.type === "link" ? (
                    <a
                      href={msg.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {msg.content}
                    </a>
                  ) : (
                    msg.content
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="avatar">
                    <FaUser />
                  </div>
                )}
              </div>
            ))}

            {/* Loading / Typing */}
            {loading && !typing && (
              <div className="message assistant">
                <div className="bubble">
                  <FaRobot color="#4facfe" /> AI đang phản hồi{" "}
                  <span className="dots"></span>
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

          {/* Quick actions */}
          <div className="quick-actions">
            {quickActions.map((q) => (
              <div
                key={q}
                className="action"
                onClick={() => {
                  setInput(q.replace(/^[^ ]+ /, ""));
                  setTimeout(() => handleSend({ preventDefault() {} }), 50);
                }}
              >
                {q}
              </div>
            ))}
          </div>

          {/* Input box */}
          <form onSubmit={handleSend} className="input-box">
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
              />

              {/* Autocomplete */}
              {filteredAutocomplete.length > 0 && (
                <div className="autocomplete">
                  {filteredAutocomplete.map((s, index) => (
                    <div key={index} onClick={() => setInput(s)}>
                      {s}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading}>
              Gửi
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
