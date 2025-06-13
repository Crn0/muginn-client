import PropTypes from "prop-types";

import { LazyImage } from "../image";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

export default function NameplatePreview({ username, displayName, asset }) {
  return (
    <>
      <div>
        <h4>NAMEPLATE PREVIEW</h4>
      </div>
      <div>
        <div>
          <LazyImage
            asset={asset}
            fallBackAsset={{ image: avatar, lazyImage: avatarLazy }}
            alt={`${displayName || username}'s nameplate avatar`}
          />
        </div>
        <div>
          <span>{displayName || username}</span>
        </div>
      </div>
    </>
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
