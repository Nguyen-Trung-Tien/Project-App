import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import { FaRobot, FaPaperPlane, FaSpinner } from "react-icons/fa";
import { fengShuiChatApi } from "../../api/chatApi";

const STEP = { WELCOME: 0, BIRTH: 1, GENDER: 2, GOAL: 3 };

const FengShuiChat = ({ setBirthYear: setGlobalBirthYear }) => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(STEP.WELCOME);
  const [userData, setUserData] = useState({ birth: "", gender: "", goal: "" });
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleShow = () => {
    setShow(true);
    if (messages.length === 0) welcome();
  };
  const handleClose = () => setShow(false);

  const welcome = () => {
    setMessages([
      { sender: "bot", text: "Chào bạn! 👋 Tôi là trợ lý Feng Shui." },
      { sender: "bot", text: "Nhập ngày tháng năm sinh của bạn (dd/mm/yyyy):" },
    ]);
    setStep(STEP.BIRTH);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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
          { sender: "bot", text: "✅ Ngày sinh đã nhận. Chọn giới tính:" },
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
            text: "✅ Giới tính đã nhận. Bạn muốn tư vấn về gì? (Màu sắc / Vật phẩm / Hướng nhà)",
          },
        ]);
        setStep(STEP.GOAL);
        break;

      case STEP.GOAL:
        const birthYear = userData.birth.split("/")[2];
        if (setGlobalBirthYear) setGlobalBirthYear(birthYear); // truyền xuống component sản phẩm

        const payload = { birthYear, message: text };
        setLoading(true);
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "Đang phân tích phong thủy...",
            type: "loading",
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
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: "Có lỗi xảy ra khi gọi API." },
          ]);
        }
        setLoading(false);
        setStep(STEP.WELCOME);
        break;

      default:
        welcome();
        break;
    }
  };

  const renderAdviceCard = (advice) => {
    if (!advice) return null;
    return (
      <Card style={{ marginTop: 10, background: "#f0f8ff" }}>
        <Card.Body>
          <Card.Title>🎯 Gợi ý phong thủy</Card.Title>
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
      <Button
        variant="primary"
        onClick={handleShow}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          borderRadius: "50%",
          width: 60,
          height: 60,
          zIndex: 999,
        }}
      >
        <FaRobot size={28} />
      </Button>

      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaRobot /> Feng Shui Chat
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
                    backgroundColor:
                      msg.sender === "bot" ? "#e0f7ff" : "#007bff",
                    color: msg.sender === "bot" ? "#000" : "#fff",
                    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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

          {/* Quick replies */}
          {step === STEP.GENDER && (
            <div className="d-flex gap-2 mt-2">
              <Button onClick={() => processStep("Nam")}>Nam</Button>
              <Button onClick={() => processStep("Nữ")}>Nữ</Button>
            </div>
          )}

          <InputGroup>
            <Form.Control
              placeholder="Nhập câu trả lời..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>
              <FaPaperPlane />
            </Button>
          </InputGroup>
        </Offcanvas.Body>
      </Offcanvas>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}</style>
    </>
  );
};

export default FengShuiChat;
