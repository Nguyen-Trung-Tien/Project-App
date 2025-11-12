import React from "react";
import { Button } from "react-bootstrap";
import { StarRating } from "../../utils/StarRating";
import { getImage } from "../../utils/decodeImage";

const ReviewList = ({ reviews, page, pagination, onPageChange }) => {
  if (!reviews?.length) {
    return <p>Chưa có đánh giá nào cho sản phẩm này.</p>;
  }

  return (
    <>
      {reviews.map((r) => (
        <div key={r.id} className="review-item border-bottom pb-3 mb-3">
          <div className="d-flex align-items-center mb-2">
            {r.user?.avatar ? (
              <img
                src={getImage(r.user.avatar)}
                alt={r.user.username}
                className="rounded-circle me-2"
                width={40}
                height={40}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                style={{ width: 40, height: 40 }}
              >
                {r.user?.username?.[0]?.toUpperCase()}
              </div>
            )}
            <strong>{r.user?.username}</strong>
          </div>
          <StarRating rating={r.rating} />
          <p className="mb-0">
            {r.comment.length > 200
              ? r.comment.slice(0, 200) + "..."
              : r.comment}
          </p>
          <small className="text-muted">
            {new Date(r.createdAt).toLocaleDateString("vi-VN")}
          </small>
        </div>
      ))}

      <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
        <Button
          variant="outline-secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          Trang trước
        </Button>

        <span className="text-muted">
          Trang {page}/{pagination.totalPages}
        </span>

        <Button
          variant="outline-primary"
          size="sm"
          disabled={page >= pagination.totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Trang sau
        </Button>
      </div>
    </>
  );
};

export default React.memo(ReviewList);
