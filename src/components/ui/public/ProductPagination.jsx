"use client";

export default function ProductPagination({
  page,
  pages,
  loading,
  onPageChange,
}) {
  if (!pages || pages <= 1) {
    return null;
  }

  const getPages = () => {
    if (pages <= 7) {
      return Array.from(
        { length: pages },
        (_, index) => index + 1
      );
    }

    const result = [1];

    if (page > 4) {
      result.push("...");
    }

    const start = Math.max(
      2,
      page - 1
    );

    const end = Math.min(
      pages - 1,
      page + 1
    );

    for (
      let number = start;
      number <= end;
      number++
    ) {
      result.push(number);
    }

    if (page < pages - 3) {
      result.push("...");
    }

    result.push(pages);

    return result;
  };

  const pageNumbers = getPages();

  return (
    <nav
      aria-label="Product pagination"
      className="mt-10 flex flex-wrap items-center justify-center gap-2"
    >

      {/* PREVIOUS */}

      <button
        type="button"
        disabled={
          loading || page <= 1
        }
        onClick={() =>
          onPageChange(page - 1)
        }
        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Previous
      </button>

      {/* NUMBERS */}

      {pageNumbers.map(
        (number, index) => {
          if (number === "...") {
            return (
              <span
                key={`dots-${index}`}
                className="px-2 text-gray-400"
              >
                ...
              </span>
            );
          }

          return (
            <button
              key={number}
              type="button"
              disabled={loading}
              onClick={() =>
                onPageChange(number)
              }
              aria-current={
                number === page
                  ? "page"
                  : undefined
              }
              className={`h-10 min-w-10 rounded-lg px-3 text-sm font-medium ${
                number === page
                  ? "bg-[#003459] text-white"
                  : "border bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          );
        }
      )}

      {/* NEXT */}

      <button
        type="button"
        disabled={
          loading || page >= pages
        }
        onClick={() =>
          onPageChange(page + 1)
        }
        className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next
      </button>

    </nav>
  );
}