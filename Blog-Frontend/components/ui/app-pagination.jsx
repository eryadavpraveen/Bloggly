import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export function AppPagination({ totalPages, currentPage, onPageChange }) {
  const previousButtonClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const nextButtonClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // middle window: currentPage-2 ... currentPage+2 (exclude 1 and last)
  const windowStart = Math.max(2, currentPage - 2);
  const windowEnd = Math.min(totalPages - 1, currentPage + 2);

  const pages = [];
  for (let page = windowStart; page <= windowEnd; page++) {
    pages.push(page);
  }

  const showLeftEllipsis = windowStart > 2;
  const showRightEllipsis = windowEnd < totalPages - 1;

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous */}
        <PaginationItem
          onClick={previousButtonClick}
          className={
            currentPage === 1
              ? "pointer-events-none opacity-50 cursor-not-allowed"
              : ""
          }
        >
          <PaginationPrevious href="#" />
        </PaginationItem>

        {/* First page */}
        <PaginationItem onClick={() => handlePageChange(1)}>
          <PaginationLink isActive={currentPage === 1}>1</PaginationLink>
        </PaginationItem>

        {/* Left ... */}
        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* (p-2) (p-1) [p] (p+1) (p+2) */}
        {pages.map((page) => (
          <PaginationItem key={page} onClick={() => handlePageChange(page)}>
            <PaginationLink isActive={currentPage === page}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Right ... */}
        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {/* Last page */}
        {totalPages > 1 && (
          <PaginationItem onClick={() => handlePageChange(totalPages)}>
            <PaginationLink isActive={currentPage === totalPages}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}

        {/* Next */}
        <PaginationItem
          onClick={nextButtonClick}
          className={
            currentPage === totalPages
              ? "pointer-events-none opacity-50 cursor-not-allowed"
              : ""
          }
        >
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}