import React from "react";
import { Button, Spinner } from "react-bootstrap";

const LoadMoreButton = ({
  currentPage = 1,
  totalPages = 1,
  loading = false,
  onLoadMore,
  text = "Xem thêm sản phẩm",
}) => {
  if (currentPage >= totalPages) return null;

  return (
    <div className="text-center mt-3">
      <Button
        variant="outline-primary"
        size="sm"
        className="rounded-pill px-4 py-2 shadow-sm"
        onClick={onLoadMore}
        disabled={loading}
      >
        {loading ? (
          <>
            <Spinner size="sm" className="me-2" />
            Đang tải...
          </>
        ) : (
          text
        )}
      </Button>
    </div>
  );
};

export default React.memo(LoadMoreButton);
