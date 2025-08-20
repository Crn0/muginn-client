import { cn } from "@/utils";

import { useInfiniteScroll, type UseInfiniteScrollOptions } from "@/hooks";
import { Spinner } from "@/components/ui/spinner";

export interface InfiniteScrollProps {
  testId?: string;
  className?: string;
  loadMore: () => void;
  isLoading: boolean;
  canLoadMore: boolean;
  options: UseInfiniteScrollOptions;
}

export function InfiniteScroll({
  testId,
  loadMore,
  isLoading,
  canLoadMore,
  options,
  className = "",
}: InfiniteScrollProps) {
  const setRef = useInfiniteScroll(loadMore, isLoading, canLoadMore, options);

  return (
    <div
      data-testid={testId}
      ref={setRef}
      className={cn("flex h-px justify-center-safe", className)}
    >
      {isLoading && <Spinner />}
    </div>
  );
}
