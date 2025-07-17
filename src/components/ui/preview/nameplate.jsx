import PropTypes from "prop-types";

import { cn } from "../../../utils";
import { UserAvatar } from "../image";

export default function NameplatePreview({ username, displayName, className, asset }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <UserAvatar
        asset={asset}
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
