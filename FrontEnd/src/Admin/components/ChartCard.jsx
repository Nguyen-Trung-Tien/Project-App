import React, { useState, useEffect } from "react";
import { Card, ButtonGroup, Button, Spinner } from "react-bootstrap";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "../Layout.scss";
import { getDashboard } from "../../api/adminApi";

const ChartCard = () => {
  const [type, setType] = useState("week");
  const [loading, setLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    revenueByWeek: [],
    revenueByMonth: [],
    revenueByYear: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getDashboard();
        if (res?.errCode === 0 && res.data) {
          const convertData = (arr, labelKey, valueKey) =>
            (arr || []).map((x) => ({
              name: x[labelKey],
              value: x[valueKey],
            }));

          setDashboardData({
            totalRevenue: res.data.totalRevenue || 0,
            revenueByWeek: convertData(
              res.data.revenueByWeek,
              "date",
              "revenue"
            ),
            revenueByMonth: convertData(
              res.data.revenueByMonth,
              "date",
              "revenue"
            ),
            revenueByYear: convertData(
              res.data.revenueByYear,
              "date",
              "revenue"
            ),
          });
        } else {
          console.warn("API không có dữ liệu hợp lệ:", res);
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const dataMap = {
    week: dashboardData.revenueByWeek,
    month: dashboardData.revenueByMonth,
    year: dashboardData.revenueByYear,
  };

  const selectedData =
    dataMap[type]?.length > 0
      ? dataMap[type]
      : [
          { name: "T2", value: 300000 },
          { name: "T3", value: 420000 },
          { name: "T4", value: 650000 },
          { name: "T5", value: 500000 },
          { name: "T6", value: 720000 },
          { name: "T7", value: 680000 },
          { name: "CN", value: 803000 },
        ];

  return (
    <Card className="chart-card shadow-sm border-0">
      <Card.Body>
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "60vh",
            }}
          >
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <>
            <p className="text-muted mb-3">
              Tổng doanh thu:{" "}
              <strong className="text-success">
                {dashboardData.totalRevenue.toLocaleString("vi-VN")} ₫
              </strong>
            </p>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0 text-primary">
                📊 Doanh thu{" "}
                {type === "week"
                  ? "tuần này"
                  : type === "month"
                  ? "tháng này"
                  : "năm nay"}
              </h5>

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
                <LineChart
                  data={selectedData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(v) =>
                      new Intl.NumberFormat("vi-VN").format(v)
                    }
                  />
                  <Tooltip
                    formatter={(value) => [
                      `${value.toLocaleString("vi-VN")} ₫`,
                      "Doanh thu",
                    ]}
                    labelStyle={{ fontWeight: 600 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0d6efd"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 7 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ChartCard;
