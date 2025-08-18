import type { PropsWithChildren, ReactNode } from "react";
import type { TAsset } from "@/types";

import { UserAvatar, BackgroundAvatar } from "@/components/ui/image";

export interface UserProfilePreview extends PropsWithChildren {
  username: string;
  displayName: string;
  avatar: TAsset;
  backgroundAvatar: TAsset;
  renderProfileButton: () => ReactNode;
  aboutMe?: string;
  className?: string;
}

export default function UserProfilePreview({
  username,
  displayName,
  avatar,
  backgroundAvatar,
  renderProfileButton,
  children,
  aboutMe = "",
  className = "",
}: UserProfilePreview) {
  const profileButton = renderProfileButton();

  return (
    <div className={className}>
      <div
        className='grid gap-5 rounded-full border border-slate-900 p-2'
        data-testid='user-profile-preview'
      >
        <BackgroundAvatar asset={backgroundAvatar} alt='Profile background' type='user' />

        <UserAvatar
          asset={avatar}
          alt={`${displayName || username}'s avatar`}
          type='user'
          className='-mt-5 w-20 rounded-full bg-black'
        />

        <div>
          <div>
            <h3 className='font-bold'>{displayName}</h3>

            <p className='font-extralight'>{username}</p>
          </div>

          <div>
            <p>{aboutMe}</p>
          </div>
        </div>

        {profileButton}
      </div>

      {children}
    </div>
  );
}
