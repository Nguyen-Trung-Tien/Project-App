import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import { FaRobot, FaPaperPlane, FaSpinner, FaRegComment } from "react-icons/fa";
import { fengShuiChatApi } from "../../api/chatApi";

const STEP = { WELCOME: 0, BIRTH: 1, GENDER: 2, GOAL: 3 };

const GOAL_SUGGESTIONS = [
  "Điện thoại",
  "Laptop",
  "Tablet",
  "Phụ kiện",
  "Máy tính bàn",
  "Đồng hồ",
  "Khác",
];

const FengShuiChat = ({ setBirthYear: setGlobalBirthYear }) => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(STEP.WELCOME);
  const [userData, setUserData] = useState({ birth: "", gender: "", goal: "" });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const STORAGE_KEY = "fengshui_chat_history";

  const handleShow = () => {
    setShow(true);
    if (messages.length === 0) welcome();
  };
  const handleClose = () => setShow(false);

  const welcome = () => {
    setMessages([
      { sender: "bot", text: "Chào bạn! 👋 Tôi là trợ lý TienTech Feng Shui." },
      { sender: "bot", text: "Nhập ngày tháng năm sinh của bạn (dd/mm/yyyy):" },
    ]);
    setStep(STEP.BIRTH);
  };

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    processStep(input.trim());
    setInput("");
  };

  const processStep = async (text) => {
    switch (step) {
      case STEP.BIRTH:
        if (!/\d{2}\/\d{2}\/\d{4}/.test(text)) {
          setMessages((prev) => [
            ...prev,
            {
              sender: "bot",
              text: "Ngày sinh không đúng định dạng dd/mm/yyyy.",
            },
          ]);
          return;
        }
        setUserData((prev) => ({ ...prev, birth: text }));
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "Ngày sinh đã nhận. Chọn giới tính:" },
        ]);
        setStep(STEP.GENDER);
        break;

      case STEP.GENDER:
        if (!/nam|nữ/i.test(text)) {
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Vui lòng nhập Nam hoặc Nữ." },
          ]);
          return;
        }
        setUserData((prev) => ({ ...prev, gender: text }));
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Bạn muốn tư vấn về gì? Hãy chọn một mục dưới đây 👇",
          },
        ]);
        setStep(STEP.GOAL);
        break;

      case STEP.GOAL:
        const birthYear = userData.birth.split("/")[2];
        if (setGlobalBirthYear) setGlobalBirthYear(birthYear);

        const payload = { birthYear, message: text };
        setLoading(true);

        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "loading",
            text: "Đang phân tích phong thủy...",
          },
        ]);

        try {
          const res = await fengShuiChatApi(payload);
          setMessages((prev) => [
            ...prev.filter((m) => m.type !== "loading"),
            { sender: "bot", text: res.reply },
            { sender: "bot", advice: res.advice },
          ]);
        } catch (err) {
          console.log(err);
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Có lỗi xảy ra khi gọi API." },
          ]);
        }

        setLoading(false);
        setStep(STEP.GOAL);
        break;

      default:
        welcome();
        break;
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  const renderAdviceCard = (advice) => {
    if (!advice) return null;
    return (
      <Card
        style={{
          marginTop: 10,
          background: "#f0f8ff",
          borderRadius: 16,
          border: "1px solid #dbeafe",
        }}
      >
        <Card.Body>
          <Card.Title>Gợi ý phong thủy</Card.Title>
          <Card.Text>
            <strong>Màu hợp:</strong> {advice.colors.join(", ")} <br />
            <strong>Vật phẩm:</strong> {advice.items.join(", ")} <br />
            <strong>Hướng nhà:</strong> {advice.direction}
          </Card.Text>
        </Card.Body>
      </Card>
    );
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        variant="primary"
        onClick={handleShow}
        style={{
          position: "fixed",
          bottom: 30,
          left: 20,
          borderRadius: "50%",
          width: 60,
          height: 60,
          zIndex: 999,
          background: "linear-gradient(90deg, #0072ff, #6f42c1)",
          border: "none",
        }}
      >
        <FaRegComment size={32} />
      </Button>

      {/* Chat Window */}
      <Offcanvas show={show} onHide={handleClose} placement="start">
        <Offcanvas.Header
          style={{
            background: "linear-gradient(90deg, #0072ff, #6f42c1)",
            border: "none",
            color: "#fff",
            fontWeight: "600",
          }}
          closeButton
        >
          <Offcanvas.Title>
            <FaRobot /> TienTech Feng Shui Chat
          </Offcanvas.Title>
        </Offcanvas.Header>

        <Offcanvas.Body
          style={{
            display: "flex",
            flexDirection: "column",
            height: "80vh",
            justifyContent: "space-between",
          }}
        >
          {/* Message list */}
          <div style={{ overflowY: "auto", flexGrow: 1, marginBottom: 10 }}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent:
                    msg.sender === "bot" ? "flex-start" : "flex-end",
                  margin: "5px 0",
                }}
              >
                <div
                  style={{
                    maxWidth: "75%",
                    padding: "10px 15px",
                    borderRadius: 20,
                    background:
                      msg.sender === "bot"
                        ? "#f8f9fa"
                        : "linear-gradient(90deg, #0072ff, #6f42c1)",

                    color: msg.sender === "bot" ? "#000" : "#fff",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.12)",
                    border: msg.sender === "bot" ? "1px solid #eee" : "none",
                  }}
                >
                  {msg.type === "loading" ? (
                    <FaSpinner className="spin" />
                  ) : (
                    msg.text
                  )}

                  {msg.advice && renderAdviceCard(msg.advice)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies - Gender */}
          {/* Quick replies - Gender */}
          {step === STEP.GENDER && (
            <div
              className="d-flex gap-3 mt-3 justify-content-center"
              style={{ animation: "fadeIn 0.3s" }}
            >
              <Button
                onClick={() => processStep("Nam")}
                style={{
                  padding: "10px 22px",
                  borderRadius: "25px",
                  background: "linear-gradient(90deg, #0072ff, #6f42c1)",
                  border: "none",
                  marginBottom: "10px",
                  color: "#fff",
                  fontWeight: "600",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                }}
              >
                Nam
              </Button>

              <Button
                onClick={() => processStep("Nữ")}
                style={{
                  padding: "10px 22px",
                  borderRadius: "25px",
                  background: "linear-gradient(135deg,#ff9a9e,#fad0c4)",
                  border: "none",
                  color: "#fff",
                  fontWeight: "600",
                  marginBottom: "10px",
                  boxShadow: "0 3px 10px rgba(0,0,0,0.15)",
                }}
              >
                Nữ
              </Button>
            </div>
          )}

          {/* Quick replies - Goal */}
          {step === STEP.GOAL && (
            <div
              className="d-flex flex-wrap gap-2 mt-3 justify-content-center"
              style={{ animation: "fadeIn 0.3s" }}
            >
              {GOAL_SUGGESTIONS.map((item, idx) => (
                <Button
                  key={idx}
                  onClick={() => processStep(item)}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "22px",
                    background: "linear-gradient(90deg, #0072ff, #6f42c1)",
                    border: "none",
                    color: "#fff",
                    fontWeight: "600",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  {item}
                </Button>
              ))}
            </div>
          )}

          {/* Input (tắt khi ở bước chọn mục đích) */}
          <InputGroup>
            <Form.Control
              placeholder="Nhập câu trả lời..."
              disabled={loading || step === STEP.GOAL}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button
              disabled={loading || step === STEP.GOAL}
              onClick={handleSend}
            >
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Offcanvas.Body>
      </Offcanvas>

      {/* Loading spinner CSS */}
      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default FengShuiChat;
