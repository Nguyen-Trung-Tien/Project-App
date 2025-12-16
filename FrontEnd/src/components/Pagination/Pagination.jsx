import Pagination from "react-bootstrap/Pagination";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDoubleLeft,
  ChevronDoubleRight,
} from "react-bootstrap-icons";

const AppPagination = ({
  page = 1,
  totalPages = 1,
  onPageChange,
  pageNeighbours = 2,
  loading = false,
  className = "justify-content-center mt-4",
}) => {
  if (totalPages <= 1) return null;

  const items = [];
  const startPage = Math.max(1, page - pageNeighbours);
  const endPage = Math.min(totalPages, page + pageNeighbours);

  // ⏮ First
  if (startPage > 1) {
    items.push(
      <Pagination.First
        key="first"
        disabled={loading}
        onClick={() => onPageChange(1)}
      >
        <ChevronDoubleLeft />
      </Pagination.First>
    );
  }

  // ◀ Prev
  if (page > 1) {
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={loading}
        onClick={() => onPageChange(page - 1)}
      >
        <ChevronLeft />
      </Pagination.Prev>
    );
  }

  // …
  if (startPage > 2) {
    items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
  }

  // 🔢 Pages
  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <Pagination.Item
        key={i}
        active={i === page}
        disabled={loading}
        onClick={() => onPageChange(i)}
      >
        {i}
      </Pagination.Item>
    );
  }

  // …
  if (endPage < totalPages - 1) {
    items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
  }

  // ▶ Next
  if (page < totalPages) {
    items.push(
      <Pagination.Next
        key="next"
        disabled={loading}
        onClick={() => onPageChange(page + 1)}
      >
        <ChevronRight />
      </Pagination.Next>
    );
  }

  // ⏭ Last
  if (endPage < totalPages) {
    items.push(
      <Pagination.Last
        key="last"
        disabled={loading}
        onClick={() => onPageChange(totalPages)}
      >
        <ChevronDoubleRight />
      </Pagination.Last>
    );
  }

  return <Pagination className={className}>{items}</Pagination>;
};

export default AppPagination;
