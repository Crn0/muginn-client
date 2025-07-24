import Proptypes from "prop-types";

import { cn } from "../utils";
import useInfiniteScroll from "../hooks/use-infinite-scroll";
import { Spinner } from "../components/ui/spinner";

export default function InfiniteScroll({
  as: Component = "div",
  testId,
  className,
  loadMore,
  isLoading,
  canLoadMore,
  options,
}) {
  const ref = useInfiniteScroll(loadMore, isLoading, canLoadMore, options);

  return (
    <Component
      data-testid={testId}
      ref={ref}
      className={cn("flex h-px justify-center-safe", className)}
    >
      {isLoading && <Spinner />}
    </Component>
  );
}

InfiniteScroll.propTypes = {
  as: Proptypes.string,
  testId: Proptypes.string.isRequired,
  className: Proptypes.string,
  canLoadMore: Proptypes.bool.isRequired,
  isLoading: Proptypes.bool.isRequired,
  loadMore: Proptypes.func.isRequired,
  options: Proptypes.shape({
    root: Proptypes.element,
    rootMargin: Proptypes.string,
    delay: Proptypes.number,
    threshold: Proptypes.number,
  }),
};
