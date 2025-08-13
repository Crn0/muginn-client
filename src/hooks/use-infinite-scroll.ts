import { useCallback, useEffect, useRef, useState } from "react";

export interface UseInfiniteScrollOptions extends IntersectionObserverInit {
  delay: number;
}

export const useInfiniteScroll = (
  loadMore: () => void,
  isLoading: boolean,
  canLoadMore: boolean,
  options: UseInfiniteScrollOptions = { root: null, rootMargin: "0px", threshold: 0, delay: 0 }
) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const [nodeRef, setNode] = useState<HTMLElement | null>(null);

  const setNodeRef = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (isLoading || !canLoadMore || !nodeRef) return () => {};

    const { root, rootMargin, threshold, delay } = options;

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) {
            setTimeout(loadMore, delay);
          } else {
            loadMore();
          }
        }
      },
      { root, rootMargin, threshold }
    );

    observer.current.observe(nodeRef);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [isLoading, canLoadMore, loadMore, options, nodeRef]);

  return setNodeRef;
};
