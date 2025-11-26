import React, { memo } from "react";

const ReplyItem = ({ reply }) => {
  return (
    <div className="mb-2">
      <strong>{reply.user?.username || "User"}:</strong> {reply.comment}
    </div>
  );
};

export default memo(ReplyItem);
