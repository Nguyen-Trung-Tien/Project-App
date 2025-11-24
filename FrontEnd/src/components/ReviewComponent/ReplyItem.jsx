import React, { memo } from "react";
import { Button } from "react-bootstrap";

const ReplyItem = ({ reply, user, onDeleteReply }) => {
  return (
    <div className="mb-2 d-flex justify-content-between">
      <div>
        <strong>{reply.User?.name || "User"}:</strong> {reply.comment}
      </div>

      {(user?.id === reply.userId || user?.role === "admin") && (
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => onDeleteReply(reply.id)}
        >
          Xóa
        </Button>
      )}
    </div>
  );
};

export default memo(ReplyItem);
