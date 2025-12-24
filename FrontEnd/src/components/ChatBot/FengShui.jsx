import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Card from "react-bootstrap/Card";
import { FaRobot, FaPaperPlane, FaSpinner, FaRegComment } from "react-icons/fa";
import { fengShuiChatApi } from "../../api/chatApi";
import "./FengShuiChat.scss";

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
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setMessages(JSON.parse(saved));
  }, []);

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

  const renderAdviceCard = (advice) => {
    if (!advice) return null;
    return (
      <Card
        className="mt-2"
        style={{
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
      <Button className="fengshui-button" onClick={handleShow}>
        <FaRegComment size={32} />
      </Button>
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="start"
        className="fengshui-chat"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <FaRobot className="me-1" />
            TienTech Feng Shui Chat
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`message ${msg.sender === "bot" ? "bot" : "user"}`}
              >
                <div className="bubble">
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
          {step === STEP.GENDER && (
            <div className="quick-replies">
              {["Nam", "Nữ"].map((g, i) => (
                <Button key={i} onClick={() => processStep(g)}>
                  {g}
                </Button>
              ))}
            </div>
          )}
          {step === STEP.GOAL && (
            <div className="quick-replies">
              {GOAL_SUGGESTIONS.map((item, i) => (
                <Button key={i} onClick={() => processStep(item)}>
                  {item}
                </Button>
              ))}
            </div>
          )}
          <InputGroup className="mt-2">
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
    </>
  );
};

export default FengShuiChat;
