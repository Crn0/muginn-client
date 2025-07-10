import { useCallback, useEffect, useRef, useState } from "react";

export default function useInfiniteScroll(
  loadMore,
  isLoading,
  canLoadMore,
  options = { root: null, rootMargin: "0px", threshold: 0, delay: 0 }
) {
  const observer = useRef(null);
  const [nodeRef, setNode] = useState(null);

  const setNodeRef = useCallback((node) => {
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
}
