/* eslint-disable jsx-a11y/tabindex-no-positive */
import { useGetUser } from "../../../lib";
import { useUserSettingsTabStore } from "../../../stores";
import { UserAvatar, BackgroundAvatar } from "../../../components/ui/image";
import { Button } from "../../../components/ui/button";
import UpdateUsername from "./update-username";
import UpdateAuthentication from "./update-authentication";

export default function UpdateAccountProfile() {
  const userQuery = useGetUser();

  const user = userQuery.data;

  const setTabs = useUserSettingsTabStore((state) => state.setTabs);

  return (
    <>
      <div id='user-detail'>
        <div>
          <BackgroundAvatar asset={user.profile.backgroundAvatar} alt='Profile background' />
        </div>

        <div>
          <div>
            <UserAvatar
              asset={user.profile.avatar}
              alt={`${user.profile.displayName || user.username}'s avatar`}
            />
          </div>

          <div data-testid='username-info'>
            <span>{user.profile.displayName || user.username}</span>
          </div>

          <div>
            <Button type='button'>Edit User Profile</Button>
          </div>
        </div>

        <div>
          <div data-testid='display-name'>
            <h2>Display Name</h2>
            <div>
              <span>{user.profile.displayName || "You haven't added a display name yet."}</span>
            </div>

            <Button
              type='button'
              testId='edit-display-name'
              onClick={() => {
                setTabs({ leftTab: "profiles", rightTab: "mainProfile" });
              }}
            >
              Edit
            </Button>
          </div>

          <UpdateUsername user={user} isUserFetching={userQuery.isFetching} />

          <div data-testid='email'>
            <h2>Email</h2>
            <div>
              <span>{user.email || "You haven't added a email yet."}</span>
            </div>

            <Button type='button' testId='edit-email'>
              Edit
            </Button>
          </div>
        </div>
      </div>

      <UpdateAuthentication user={user} isUserFetching={userQuery.isFetching} />
    </>
  );
}
