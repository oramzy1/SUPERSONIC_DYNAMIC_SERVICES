interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-2.5 py-1 rounded-md border border-white/6 text-xs font-medium text-slate-400 disabled:opacity-30 hover:bg-white/5 transition"
      >
        Prev
      </button>
      <span className="text-xs text-slate-500 font-medium">
        Page <span className="text-slate-300">{page}</span> of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-2.5 py-1 rounded-md border border-white/6 text-xs font-medium text-slate-400 disabled:opacity-30 hover:bg-white/5 transition"
      >
        Next
      </button>
    </div>
  );
}