import React, { memo } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { StarRating } from "../../utils/StarRating";

const ReviewForm = ({ newReview, setNewReview, onSubmit }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h6 className="mb-3 fw-semibold">Viết đánh giá của bạn:</h6>

        {/* Rating */}
        <div className="mb-3">
          <StarRating
            rating={newReview.rating}
            onChange={(star) => setNewReview((p) => ({ ...p, rating: star }))}
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
            setNewReview((p) => ({ ...p, comment: e.target.value }))
          }
          className="mb-3"
        />

        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={!newReview.comment.trim() || !newReview.rating}
          >
            Gửi đánh giá
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default memo(ReviewForm);
