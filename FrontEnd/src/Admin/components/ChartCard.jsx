import React, { useState } from "react";
import { Card, ButtonGroup, Button } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./Layout.scss";
const ChartCard = () => {
  // Dữ liệu mẫu
  const dataWeek = [
    { name: "T2", value: 12 },
    { name: "T3", value: 19 },
    { name: "T4", value: 8 },
    { name: "T5", value: 15 },
    { name: "T6", value: 20 },
    { name: "T7", value: 18 },
    { name: "CN", value: 10 },
  ];

  const dataMonth = [
    { name: "Tuần 1", value: 80 },
    { name: "Tuần 2", value: 95 },
    { name: "Tuần 3", value: 70 },
    { name: "Tuần 4", value: 110 },
  ];

  const dataYear = [
    { name: "T1", value: 120 },
    { name: "T2", value: 140 },
    { name: "T3", value: 90 },
    { name: "T4", value: 170 },
    { name: "T5", value: 200 },
    { name: "T6", value: 180 },
    { name: "T7", value: 150 },
    { name: "T8", value: 210 },
    { name: "T9", value: 240 },
    { name: "T10", value: 190 },
    { name: "T11", value: 220 },
    { name: "T12", value: 260 },
  ];

  const [type, setType] = useState("week");

  const dataMap = {
    week: dataWeek,
    month: dataMonth,
    year: dataYear,
  };

  return (
    <Card className="shadow-sm border-0 rounded-4">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">📈 Biểu đồ doanh thu</h5>

          <ButtonGroup>
            <Button
              variant={type === "week" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setType("week")}
            >
              Tuần
            </Button>
            <Button
              variant={type === "month" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setType("month")}
            >
              Tháng
            </Button>
            <Button
              variant={type === "year" ? "primary" : "outline-primary"}
              size="sm"
              onClick={() => setType("year")}
            >
              Năm
            </Button>
          </ButtonGroup>
        </div>

        <div style={{ width: "100%", height: 300 }}>
          <ResponsiveContainer>
            <LineChart data={dataMap[type]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#0d6efd"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ChartCard;
