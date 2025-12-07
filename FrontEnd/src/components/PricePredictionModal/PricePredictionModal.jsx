import React from "react";
import { Modal, Button, ProgressBar, Badge, Card } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { ArrowDownCircle, ArrowUpCircle } from "react-bootstrap-icons";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const PricePredictionModal = ({ show, onHide, result }) => {
  if (!result || !result.currentPrice) return null;

  const {
    productName = "Sản phẩm",
    category = "Không xác định",
    currentPrice = 0,
    predicted30 = 0,
    predicted60 = 0,
    predicted90 = 0,
    reliability = 0,
    discount = 0,
    aiAnalysis = null,
  } = result;

  const calcPercent = (delta) => {
    if (currentPrice === 0) return 0;
    return ((Math.abs(delta) / currentPrice) * 100).toFixed(1);
  };

  const predictions = [
    { label: "30 ngày", delta: predicted30 },
    { label: "60 ngày", delta: predicted60 },
    { label: "90 ngày", delta: predicted90 },
  ];

  const progressVariant =
    reliability > 80 ? "success" : reliability > 50 ? "warning" : "danger";

  // Chart
  const chartData = {
    labels: ["Hiện tại", "30 ngày", "60 ngày", "90 ngày"],
    datasets: [
      {
        label: "Giá dự đoán (VNĐ)",
        data: [
          currentPrice,
          currentPrice + predicted30,
          currentPrice + predicted60,
          currentPrice + predicted90,
        ],
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.2)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Dự đoán giá tương lai</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h5 className="fw-bold text-primary">{productName}</h5>
        <p className="text-muted mb-2">Loại sản phẩm: {category}</p>

        <div className="d-flex justify-content-between mb-3 align-items-center">
          <span>Giá hiện tại:</span>
          <span className="fw-bold text-success">
            {currentPrice.toLocaleString()}đ{" "}
            {discount > 0 && (
              <Badge bg="danger" pill className="ms-2">
                Giảm {parseFloat(discount).toFixed(0)}%
              </Badge>
            )}
          </span>
        </div>

        <div className="prediction-box bg-light p-3 rounded mb-3">
          {predictions.map((item) => (
            <div
              key={item.label}
              className="d-flex justify-content-between align-items-center mb-2"
            >
              <span>{item.label}:</span>
              <span
                className={`fw-bold ${
                  item.delta < 0 ? "text-danger" : "text-success"
                }`}
              >
                {item.delta < 0 ? <ArrowDownCircle /> : <ArrowUpCircle />}{" "}
                {Math.abs(item.delta).toLocaleString()}đ{" "}
                <Badge bg={item.delta < 0 ? "danger" : "success"} pill>
                  {calcPercent(item.delta)}%
                </Badge>
              </span>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <p className="mb-1">Độ tin cậy:</p>
          <ProgressBar
            now={reliability}
            label={`${reliability}%`}
            variant={progressVariant}
          />
        </div>

        {aiAnalysis && aiAnalysis !== "AI phân tích thất bại" && (
          <Card className="mb-3 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold text-primary mb-1">Phân tích AI </h6>

              <p>
                <strong>Xu hướng:</strong> {aiAnalysis.trend}
              </p>
              <p>
                <strong>Rủi ro:</strong> {aiAnalysis.risk}
              </p>
              <p>
                <strong>Đề xuất:</strong> {aiAnalysis.suggestion}
              </p>
              <p>
                <strong>Giá hợp lý:</strong>{" "}
                <span className="text-success fw-bold">
                  {aiAnalysis.fairPrice?.toLocaleString()}đ
                </span>
              </p>

              <p className="mt-2">
                <strong>Độ tin cậy AI:</strong>{" "}
                <Badge bg="info" pill>
                  {aiAnalysis.reliability}%
                </Badge>
              </p>
              <span className="text-muted" style={{ fontSize: "0.85rem" }}>
                Phân tích bởi AI mang tính tham khảo; kết quả có thể không chính
                xác và phụ thuộc biến động thị trường.
              </span>
            </Card.Body>
          </Card>
        )}

        <div>
          <Line data={chartData} />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PricePredictionModal;
