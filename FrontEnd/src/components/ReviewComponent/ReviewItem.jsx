import React, { memo, useRef } from "react";
import { Button, Form } from "react-bootstrap";
import { StarFill, Calendar3, PersonFill } from "react-bootstrap-icons";
import ReplyItem from "./ReplyItem";

const ReviewItem = ({
  review,
  user,
  onReplySubmit,
  onDeleteReview,
  onDeleteReply,
  onUpdateReview,
}) => {
  const replyRef = useRef();
  const editRef = useRef();

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

      {/* EDIT: chỉ cho phép chủ review sửa */}
      {user?.id === review.userId && (
        <>
          <Form.Control
            ref={editRef}
            defaultValue={review.comment}
            className="mb-2"
          />

          <div className="d-flex gap-2">
            <Button
              variant="warning"
              size="sm"
              onClick={() =>
                onUpdateReview(review.id, {
                  comment: editRef.current.value,
                })
              }
            >
              Cập nhật
            </Button>

            <Button
              variant="danger"
              size="sm"
              onClick={() => onDeleteReview(review.id)}
            >
              Xóa
            </Button>
          </div>
        </>
      )}

      {/* ADMIN: chỉ được xoá */}
      {user?.role === "admin" && user?.id !== review.userId && (
        <Button
          variant="danger"
          size="sm"
          onClick={() => onDeleteReview(review.id)}
        >
          Xóa
        </Button>
      )}

      {/* REPLY input */}
      <div className="mt-3">
        <Form.Control ref={replyRef} placeholder="Trả lời..." />

        <Button
          className="mt-2"
          size="sm"
          onClick={() => onReplySubmit(review.id, replyRef.current.value)}
        >
          Gửi trả lời
        </Button>
      </div>

      {/* Reply list */}
      <div className="mt-3 ps-3 border-start">
        {review.ReviewReplies?.map((rep) => (
          <ReplyItem
            key={rep.id}
            reply={rep}
            user={user}
            onDeleteReply={onDeleteReply}
          />
        ))}
      </div>
    </div>
  );
};

export default memo(ReviewItem);
