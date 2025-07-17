import PropTypes from "prop-types";

import { cn } from "../../../utils";
import getAvatar from "./get-avatar";
import LazyImage from "./lazy-image";

import avatarMain from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = {
  main: avatarMain,
  lazy: avatarLazy,
};

export default function UserAvatar({ asset, alt, className }) {
  const { mainImage, lazyImage } = getAvatar(asset, fallback);

  return (
    <div className={cn("w-10", className)}>
      <LazyImage
        mainImage={mainImage}
        lazyImage={lazyImage}
        className='rounded-full p-5'
        alt={alt}
      />
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
};
