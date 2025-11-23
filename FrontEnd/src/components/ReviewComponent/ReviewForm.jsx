import React from "react";
import { Form, Button, Card } from "react-bootstrap";
import { StarRating } from "../../utils/StarRating";

const ReviewForm = ({ newReview, setNewReview, onSubmit }) => {
  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <h6 className="mb-3 fw-semibold">Viết đánh giá của bạn:</h6>

        {/* Star rating */}
        <div className="mb-3">
          <StarRating
            rating={newReview.rating}
            onChange={(star) => setNewReview((p) => ({ ...p, rating: star }))}
            interactive
          />
        </div>

        {/* Comment input */}
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Nhập bình luận của bạn..."
          value={newReview.comment}
          onChange={(e) =>
            setNewReview((p) => ({ ...p, comment: e.target.value }))
          }
          className="mb-3"
        />

        {/* Submit button */}
        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={onSubmit}
            disabled={!newReview.comment.trim() && !newReview.rating}
          >
            Gửi đánh giá
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default React.memo(ReviewForm);
