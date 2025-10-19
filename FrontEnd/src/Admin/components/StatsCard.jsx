import React from "react";
import { Card } from "react-bootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "../Layout.scss";

const StatsCard = ({ title, value, icon, change, isIncrease }) => {
  return (
    <Card className="text-center shadow-sm border-0 rounded-4 stats-card">
      <Card.Body>
        <div className="d-flex justify-content-center align-items-center mb-2">
          <div className="me-2 text-primary">{icon}</div>
          <h6 className="text-muted fw-semibold mb-0">{title}</h6>
        </div>

        <h3 className="fw-bold mb-1">{value}</h3>

        {change && (
          <small
            className={`d-flex justify-content-center align-items-center ${
              isIncrease ? "text-success" : "text-danger"
            }`}
          >
            {isIncrease ? (
              <FaArrowUp className="me-1" />
            ) : (
              <FaArrowDown className="me-1" />
            )}
            {change}
          </small>
        )}
      </Card.Body>
    </Card>
  );
};

export default StatsCard;
