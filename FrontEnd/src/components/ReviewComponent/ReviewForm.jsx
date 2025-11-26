import React, { memo } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { StarRating } from "../../utils/StarRating";

const ReviewForm = ({ newReview, setNewReview, onSubmit, loading }) => {
  const disabled = !newReview.comment.trim() || !newReview.rating || loading;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h6 className="mb-3 fw-semibold">Viết đánh giá của bạn:</h6>

        {/* Rating */}
        <div className="mb-3">
          <StarRating
            rating={newReview.rating}
            onChange={(star) =>
              setNewReview((prev) => ({ ...prev, rating: star }))
            }
            interactive
          />
        </div>

        {/* Comment */}
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Nhập bình luận..."
          value={newReview.comment}
          onChange={(e) =>
            setNewReview((prev) => ({ ...prev, comment: e.target.value }))
          }
          className="mb-3"
        />

        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={onSubmit} disabled={disabled}>
            {loading ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default memo(ReviewForm);
