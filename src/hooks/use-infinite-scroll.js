import { useCallback, useEffect, useRef } from "react";

export default function useInfiniteScroll(
  loadMore,
  isLoading,
  canLoadMore,
  options = { root: null, rootMargin: "0px", delay: 0, threshold: 0 }
) {
  const observer = useRef();
  const prevNode = useRef();

  const { root, rootMargin, threshold, delay } = options;

  const setElementRef = useCallback(
    (node) => {
      if (isLoading || !canLoadMore) return;

      if (prevNode.current) {
        prevNode.current();
        prevNode.current = undefined;
      }

      if (node && observer.current) {
        observer.current.observe(node);

        prevNode.current = () => observer.current.unobserve(node);
      }
    },
    [isLoading, canLoadMore]
  );

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay) {
            setTimeout(() => loadMore(), delay);
          } else {
            loadMore();
          }
        }
      },
      { root, rootMargin, threshold }
    );

    return () => observer.current?.disconnect();
  }, [loadMore, root, rootMargin, threshold, delay]);

  return setElementRef;
}

// export default function useInfiniteScroll(
//   loadMore,
//   isLoading,
//   canLoadMore,
//   options = { root: null, rootMargin: "0px", delay: 0, threshold: 0 }
// ) {
//   const observer = useRef();

//   const setElementRef = useCallback(
//     (node) => {
//       if (isLoading || !canLoadMore) return;

//       if (observer.current) observer.current.disconnect();

//       if (!observer.current) {
//         const { root, rootMargin, delay, threshold } = options;

//         observer.current = new IntersectionObserver(
//           ([entry]) => {
//             if (entry.isIntersecting) {
//               if (delay) {
//                 setTimeout(loadMore, delay);
//               } else {
//                 loadMore();
//               }
//             }
//           },
//           { root, rootMargin, delay, threshold }
//         );
//       }

//       if (node) observer.current.observe(node);
//     },
//     [isLoading, canLoadMore, options, loadMore]
//   );

//   return setElementRef;
// }
