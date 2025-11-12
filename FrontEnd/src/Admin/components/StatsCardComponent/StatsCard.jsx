import { Card } from "react-bootstrap";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import "./StatsCard.scss";

const StatsCard = ({ title, value, icon, change, isIncrease }) => {
  return (
    <Card className="stats-card text-center border-0 shadow-sm rounded-4 p-2">
      <Card.Body>
        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
          <span className="icon-wrapper text-primary fs-4">{icon}</span>
          <h6 className="text-muted fw-semibold mb-0">{title}</h6>
        </div>

        <h3 className="fw-bold text-dark mb-1">{value}</h3>

        {change && (
          <small
            className={`fw-semibold d-flex justify-content-center align-items-center ${
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
