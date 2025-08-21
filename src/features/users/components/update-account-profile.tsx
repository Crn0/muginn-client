/* eslint-disable jsx-a11y/tabindex-no-positive */
import { useGetUser } from "@/lib";
import { useUserSettingsTabStore } from "@/stores";
import { UserAvatar, BackgroundAvatar } from "@/components/ui/image";
import { Button } from "@/components/ui/button";
import { UpdateUsername } from "./update-username";
import { UpdateAuthentication } from "./update-authentication";
import { DeleteAccount } from "./delete-account";

export function UpdateAccountProfile() {
  const userQuery = useGetUser();

  const user = userQuery.data;

  const setTabs = useUserSettingsTabStore((state) => state.setTabs);

  if (!user) return null;

  return (
    <div className='flex flex-1 flex-col justify-center-safe gap-5 sm:items-center-safe'>
      <div
        id='user-detail'
        className='flex flex-col rounded-md border border-slate-900 p-1 sm:w-4xl'
      >
        <BackgroundAvatar asset={user.profile.backgroundAvatar} alt='Profile background' />

        <div className='flex items-center-safe justify-between'>
          <div className='flex items-center-safe gap-2'>
            <UserAvatar
              asset={user.profile.avatar}
              alt={`${user.profile.displayName || user.username}'s avatar`}
              className='-mt-5 w-20 rounded-full bg-black'
            />

            <p
              data-testid='username-info'
              className='w-30 overflow-hidden font-bold overflow-ellipsis whitespace-nowrap'
            >
              {user.profile.displayName || user.username}
            </p>
          </div>

          <Button
            type='button'
            onClick={() => {
              setTabs({ leftTab: "profiles", rightTab: "mainProfile" });
            }}
          >
            Edit User Profile
          </Button>
        </div>

        <div className='mt-5 grid gap-5'>
          <div data-testid='display-name' className='flex items-center-safe justify-between'>
            <div>
              <h2>Display Name</h2>

              <p>{user.profile.displayName || "You haven't added a display name yet."}</p>
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

          <div data-testid='email' className='flex items-center-safe justify-between'>
            <div>
              <h2>Email</h2>

              <p>{user.email || "You haven't added a email yet."}</p>
            </div>

            <Button type='button' testId='edit-email'>
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div className='grid place-content-center-safe place-items-center-safe gap-5 p-5'>
        <UpdateAuthentication user={user} isUserFetching={userQuery.isFetching} />
        <DeleteAccount />
      </div>
    </div>
  );
}
