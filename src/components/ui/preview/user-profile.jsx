import PropTypes from "prop-types";

import { Avatar, BackgroundAvatar } from "../image";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

const fallback = {
  image: avatar,
  lazyImage: avatarLazy,
};

export default function UserProfilePreview({ user, renderProfileButton, children }) {
  const profileButton = renderProfileButton();

  return (
    <div data-testid='user-profile-preview'>
      <div>
        <header>
          <div>
            <BackgroundAvatar
              asset={user.profile.backgroundAvatar}
              fallback={fallback}
              alt='Profile background'
              type='user'
            />
          </div>
          <div>
            <Avatar
              asset={user.profile.avatar}
              fallback={{ image: avatar, lazyImage: avatarLazy }}
              alt={`${user.profile.displayName || user.username}'s avatar`}
              type='user'
            />
          </div>
        </header>

        <main>
          <div>
            <h3>{user.profile.displayName}</h3>

            <div>
              <span>{user.username}</span>
            </div>
          </div>

          <div>
            <p>{user.profile.aboutMe}</p>
          </div>
        </main>

        <footer>
          <div>{profileButton}</div>
        </footer>
      </div>

      {children && <div>{children}</div>}
    </div>
  );
}

UserProfilePreview.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
      aboutMe: PropTypes.string,
      avatar: PropTypes.shape({
        url: PropTypes.string,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string,
            size: PropTypes.number,
            format: PropTypes.string,
          })
        ),
      }),
      backgroundAvatar: PropTypes.shape({
        url: PropTypes.string,
        images: PropTypes.arrayOf(
          PropTypes.shape({
            url: PropTypes.string,
            size: PropTypes.number,
            format: PropTypes.string,
          })
        ),
      }),
    }).isRequired,
  }).isRequired,
  renderProfileButton: PropTypes.func.isRequired,
  children: PropTypes.element,
};
