import React, { useState, useRef, useEffect } from "react";
import { FaRobot, FaComments, FaTimes } from "react-icons/fa";
import { useSelector } from "react-redux";
import { sendMessage } from "../../api/chatApi";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [typingText, setTypingText] = useState("");

  const messagesEndRef = useRef(null);

  // Lấy user từ Redux store
  const user = useSelector((state) => state.user.user);
  const userId = user?.id || null;

  const quickSuggestions = [
    "Tìm sản phẩm",
    "Giá giảm hôm nay",
    "Kiểm tra đơn hàng",
    "Chính sách đổi trả",
    "Gợi ý theo nhu cầu",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingText]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const greetMsg = [
        {
          role: "assistant",
          content: `Xin chào${
            user ? `, ${user.username}` : "bạn"
          }! 👋 Tôi là trợ lý TienTech.
Tôi có thể giúp bạn với:
• 🔍 Tìm sản phẩm
• 💰 Xem giá, khuyến mãi
• 📦 Kiểm tra đơn hàng
• 📋 Chính sách đổi trả – bảo hành
• 🚚 Vận chuyển – thanh toán

Bạn muốn hỏi gì hôm nay? 😊`,
          time: new Date(),
        },
      ];
      setMessages(greetMsg);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, user]);

  const toggleChat = () => setIsOpen(!isOpen);

  const typeEffect = async (text) => {
    setTypingText("");
    for (let i = 0; i < text.length; i++) {
      await new Promise((r) => setTimeout(r, 15));
      setTypingText((prev) => prev + text[i]);
    }
    setTypingText("");
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: text, time: new Date() },
    ]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const reply = await sendMessage(input, userId);

      const enhancedReply =
        reply.includes("Xin lỗi") || reply.includes("không hiểu")
          ? `${reply}\n\nMình chưa hiểu rõ câu hỏi lắm 😅\nBạn có thể hỏi:
• Thông tin sản phẩm
• Tra cứu đơn hàng
• Kiểm tra giá – giảm giá
• Tư vấn chọn sản phẩm
• Chính sách giao hàng / bảo hành`
          : reply;

      await typeEffect(enhancedReply);
    } catch (err) {
      console.log(err);
      await typeEffect("Xin lỗi, tôi không thể trả lời lúc này.");
    }

    setLoading(false);
  };

  const formatTime = (date) =>
    `${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;

  return (
    <>
      <div
        onClick={toggleChat}
        style={{
          position: "fixed",
          bottom: "20px",
          right: "18px",
          zIndex: 9999,
          cursor: "pointer",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #4facfe, #00f2fe)",
            color: "#fff",
            padding: "15px",
            borderRadius: "50%",
            boxShadow: "0 4px 14px rgba(0,0,0,0.28)",
            transition: "0.25s",
          }}
        >
          {isOpen ? <FaTimes size={22} /> : <FaComments size={26} />}
        </div>
      </div>

      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "85px",
            right: "20px",
            width: "360px",
            height: "480px",
            zIndex: 9998,
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#fff",
            borderRadius: "18px",
            boxShadow: "0 12px 34px rgba(0,0,0,0.25)",
            animation: "chatOpen 0.25s ease",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              background: "linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)",
              color: "#fff",
              fontWeight: "600",
              fontSize: "1.05rem",
              display: "flex",
              alignItems: "center",
            }}
          >
            <FaRobot className="me-2" /> TienTech Trợ lý
          </div>

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
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    background:
                      msg.role === "user"
                        ? "linear-gradient(135deg,#4facfe,#00d0fe)"
                        : "#e9ecef",
                    color: msg.role === "user" ? "#fff" : "#333",
                    borderRadius: "16px",
                    padding: "10px 14px",
                    maxWidth: "78%",
                    wordBreak: "break-word",
                    boxShadow:
                      msg.role === "user"
                        ? "0 2px 10px rgba(0,0,0,0.2)"
                        : "0 2px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.75rem",
                      marginBottom: "4px",
                      opacity: 0.8,
                    }}
                  >
                    {msg.role === "user" ? "Bạn" : "AI"} •{" "}
                    {formatTime(msg.time)}
                  </div>
                  {msg.content}
                </div>
              </div>
            ))}

            {typingText && (
              <div
                style={{
                  background: "#e9ecef",
                  padding: "10px 14px",
                  borderRadius: "12px",
                  width: "fit-content",
                  marginBottom: "10px",
                  color: "#333",
                }}
              >
                {typingText}
              </div>
            )}

            {loading && !typingText && (
              <div style={{ color: "#999", fontSize: "0.85rem" }}>
                AI đang trả lời...
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              padding: "6px 12px",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {quickSuggestions.map((q) => (
              <div
                key={q}
                onClick={() => setInput(q)}
                style={{
                  background: "#eef3f7",
                  padding: "6px 12px",
                  borderRadius: "14px",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  border: "1px solid #dde3e8",
                }}
              >
                {q}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            style={{
              padding: "12px",
              borderTop: "1px solid #ddd",
              background: "#fff",
              display: "flex",
              gap: "8px",
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tin nhắn..."
              value={input}
              disabled={loading}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) handleSend(e);
              }}
              style={{
                borderRadius: "20px",
                padding: "10px 16px",
                border: "1px solid #ccc",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg,#4facfe,#00f2fe)",
                color: "#fff",
                border: "none",
                padding: "10px 16px",
                borderRadius: "20px",
                fontWeight: "600",
                transition: "0.2s",
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
        `}
      </style>
    </>
  );
};

export default ChatBot;
