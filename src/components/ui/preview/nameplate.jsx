import PropTypes from "prop-types";

import { cn } from "../../../utils";
import { Avatar } from "../image";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = {
  image: avatar,
  lazyImage: avatarLazy,
};

export default function NameplatePreview({ username, displayName, className, asset }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Avatar
        asset={asset}
        fallback={fallback}
        alt={`${displayName || username}'s nameplate avatar`}
        variant='user'
      />
      <div className='font-sans text-sm'>{displayName || username}</div>
    </div>
  );
}

NameplatePreview.propTypes = {
  username: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  className: PropTypes.string,
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
