import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "../../lib/utils";
import { Button } from "./button";

export interface PaginationProps {
  /** 当前页码（从 1 开始） */
  page: number;
  /** 总页数 */
  totalPages: number;
  /** 页码变化回调 */
  onPageChange: (page: number) => void;
  /** 总条数（可选，用于显示「显示 x - y 条」） */
  total?: number;
  /** 每页条数（可选，与 total 一起用于范围文案） */
  pageSize?: number;
  /** 最多展示的页码按钮数（不含首尾省略），默认 5 */
  siblingCount?: number;
  className?: string;
  /** 是否显示左侧范围摘要（显示 x - y 条） */
  showSummary?: boolean;
}

/**
 * 计算需要展示的页码数组，含省略占位。
 * 例如 totalPages=10, page=5 → [1, '...', 4, 5, 6, '...', 10]
 */
function getPageNumbers(
  page: number,
  totalPages: number,
  siblingCount: number
): (number | "ellipsis")[] {
  if (totalPages <= 0) return [];
  if (totalPages <= siblingCount + 4) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const left = Math.max(1, page - siblingCount);
  const right = Math.min(totalPages, page + siblingCount);
  const showLeftEllipsis = left > 2;
  const showRightEllipsis = right < totalPages - 1;
  const numbers: (number | "ellipsis")[] = [];
  numbers.push(1);
  if (showLeftEllipsis) numbers.push("ellipsis");
  for (let i = left; i <= right; i++) {
    if (i !== 1 && i !== totalPages) numbers.push(i);
  }
  if (showRightEllipsis) numbers.push("ellipsis");
  if (totalPages > 1 && numbers[numbers.length - 1] !== totalPages)
    numbers.push(totalPages);
  return numbers;
}

function Pagination(props: PaginationProps) {
  const total = props.total ?? 0;
  const pageSize = props.pageSize ?? 0;
  const siblingCount = props.siblingCount ?? 2;
  const showSummary = props.showSummary ?? true;
  const pageNumbers = getPageNumbers(props.page, props.totalPages, siblingCount);
  const startItem =
    total > 0 && pageSize > 0 ? (props.page - 1) * pageSize + 1 : 0;
  const endItem =
    total > 0 && pageSize > 0
      ? Math.min(props.page * pageSize, total)
      : 0;
  const hasSummary = showSummary && total > 0 && pageSize > 0;

  if (props.totalPages <= 1) return null;

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 dark:border-slate-700",
        props.className
      )}
    >
      {hasSummary && (
        <div className="text-sm text-slate-500 dark:text-slate-400">
          显示 {startItem} - {endItem} 条，共 {total} 条
        </div>
      )}
      {!hasSummary && <div />}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            props.onPageChange(Math.max(1, props.page - 1))
          }
          disabled={props.page <= 1}
          aria-label="上一页"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <nav className="flex items-center gap-1" aria-label="分页">
          {pageNumbers.map((n, i) =>
            n === "ellipsis" ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-8 w-8 items-center justify-center text-slate-400 dark:text-slate-500"
                aria-hidden
              >
                …
              </span>
            ) : (
              <Button
                key={n}
                variant={n === props.page ? "default" : "outline"}
                size="sm"
                className="h-8 min-w-8 px-2"
                onClick={() => props.onPageChange(n)}
                disabled={n === props.page}
                aria-label={
                  n === props.page ? `当前第 ${n} 页` : `第 ${n} 页`
                }
                aria-current={n === props.page ? "page" : undefined}
              >
                {n}
              </Button>
            )
          )}
        </nav>
        <Button
          variant="outline"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            props.onPageChange(Math.min(props.totalPages, props.page + 1))
          }
          disabled={props.page >= props.totalPages}
          aria-label="下一页"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export { Pagination };
