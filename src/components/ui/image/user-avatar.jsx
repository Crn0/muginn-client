import PropTypes from "prop-types";

import { cn } from "../../../utils";
import LazyImage from "./lazy-image";

export default function UserAvatar({ asset, fallback, alt, className }) {
  return (
    <div className={cn("w-10", className)}>
      <LazyImage asset={asset} fallBackAsset={fallback} className='rounded-full p-5' alt={alt} />
    </div>
  );
}

UserAvatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  asset: PropTypes.shape({
    url: PropTypes.string,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string,
        size: PropTypes.number,
        format: PropTypes.string,
      })
    ),
  }),
  fallback: PropTypes.shape({
    image: PropTypes.string.isRequired,
    lazyImage: PropTypes.string.isRequired,
  }),
};
