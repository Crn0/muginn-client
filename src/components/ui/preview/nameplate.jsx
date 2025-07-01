import PropTypes from "prop-types";

import { Avatar } from "../image";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = {
  image: avatar,
  lazyImage: avatarLazy,
};

export default function NameplatePreview({ username, displayName, asset }) {
  return (
    <div>
      <div>
        <Avatar
          asset={asset}
          fallback={fallback}
          alt={`${displayName || username}'s nameplate avatar`}
          type='user'
        />
      </div>
      <div>
        <span>{displayName || username}</span>
      </div>
    </div>
  );
}

NameplatePreview.propTypes = {
  username: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
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
