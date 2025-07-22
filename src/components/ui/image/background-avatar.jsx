import PropTypes from "prop-types";

import getAvatar from "./get-avatar";
import { cn } from "../../../utils";
import LazyImage from "./lazy-image";
import avatarMain from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = {
  main: avatarMain,
  lazy: avatarLazy,
};

export default function BackgroundAvatar({ asset, alt, size, className }) {
  const { mainImage, lazyImage } = getAvatar(asset, fallback);

  return (
    <div className={cn("flex-1", className)}>
      <LazyImage
        mainImage={mainImage}
        lazyImage={lazyImage}
        alt={alt}
        size={size}
        variant='backgroundAvatar'
      />
    </div>
  );
}

BackgroundAvatar.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  size: PropTypes.string,
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
};
