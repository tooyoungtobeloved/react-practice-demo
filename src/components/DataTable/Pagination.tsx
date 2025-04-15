interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number, pageSize: number) => void;
}

export default function Pagination(props: PaginationProps) {
  const { currentPage, totalItems, pageSize, onPageChange } = props;
  const totalPages = Math.ceil(totalItems / pageSize);
  return (
    <div>
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1, pageSize)}
      >
        上一页
      </button>
      <span>
        currentPage: {currentPage} / {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1, pageSize)}
      >
        下一页
      </button>
    </div>
  );
}
