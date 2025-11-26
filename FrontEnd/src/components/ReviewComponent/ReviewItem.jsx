import React, { memo } from "react";
import { Button, Form } from "react-bootstrap";
import { StarFill, Calendar3, PersonFill } from "react-bootstrap-icons";
import ReplyItem from "./ReplyItem";

const ReviewItem = ({ review, user }) => {
  return (
    <div className="review-item border rounded p-3 mb-3 shadow-sm">
      {/* Header */}
      <div className="d-flex align-items-center mb-2">
        <PersonFill className="me-2 text-primary" />
        <strong>{review.user?.username || "Người dùng"}</strong>
      </div>

      {/* Rating */}
      <div className="d-flex align-items-center mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <StarFill key={s} color={s <= review.rating ? "gold" : "#ccc"} />
        ))}
      </div>

      {/* Comment */}
      <p className="mb-2">{review.comment}</p>

      {/* Date */}
      <div className="text-muted small mb-3 d-flex align-items-center">
        <Calendar3 className="me-1" />
        {new Date(review.createdAt).toLocaleString("vi-VN")}
      </div>

      {/* Reply list */}
      <div className="mt-3 ps-3 border-start">
        {review.ReviewReplies?.map((rep) => (
          <ReplyItem key={rep.id} reply={rep} user={user} />
        ))}
      </div>
    </div>
  );
};

export default memo(ReviewItem);
