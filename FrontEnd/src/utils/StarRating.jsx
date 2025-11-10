import { Star, StarFill } from "react-bootstrap-icons";

export const StarRating = ({ rating, onChange, interactive = false }) => (
  <div className="d-flex align-items-center">
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        onClick={() => interactive && onChange?.(star)}
        style={{ cursor: interactive ? "pointer" : "default" }}
      >
        {star <= rating ? <StarFill color="gold" /> : <Star color="gray" />}
      </span>
    ))}
  </div>
);
