import React, { memo } from "react";
import ReviewItem from "./ReviewItem";
import { Pagination } from "react-bootstrap";

const ReviewList = ({ reviews, page, pagination, onPageChange, ...rest }) => {
  return (
    <div className="mt-4">
      {reviews.map((review) => (
        <ReviewItem key={review.id} review={review} {...rest} />
      ))}

      {/* Pagination */}
      <div className="mt-3 d-flex justify-content-center">
        <Pagination>
          {Array.from({ length: pagination.totalPages }).map((_, i) => (
            <Pagination.Item
              key={i + 1}
              active={page === i + 1}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </div>
  );
};

export default memo(ReviewList);
