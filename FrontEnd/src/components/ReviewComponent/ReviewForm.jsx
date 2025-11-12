import React from "react";
import { Form, Button } from "react-bootstrap";
import { StarRating } from "../../utils/StarRating";

const ReviewForm = ({ newReview, setNewReview, onSubmit }) => {
  return (
    <div className="review-form mb-4">
      <h6 className="mb-2 fw-semibold">Viết đánh giá của bạn:</h6>
      <StarRating
        rating={newReview.rating}
        onChange={(star) => setNewReview((p) => ({ ...p, rating: star }))}
        interactive
      />
      <Form.Control
        as="textarea"
        rows={3}
        placeholder="Nhập bình luận của bạn..."
        value={newReview.comment}
        onChange={(e) =>
          setNewReview((p) => ({ ...p, comment: e.target.value }))
        }
        className="my-2"
      />
      <Button variant="primary" onClick={onSubmit}>
        Gửi đánh giá
      </Button>
    </div>
  );
};

export default React.memo(ReviewForm);
