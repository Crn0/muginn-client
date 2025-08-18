import { FaCircle } from "react-icons/fa6";

import type { TAsset } from "@/types";

import { formatDate } from "@/utils";

import { GroupChatAvatar } from "@/components/ui/image";

export interface ChatProfilePreviewProps {
  name: string;
  avatar: TAsset;
  memberCount: number;
  createdAt: string;
  className?: string;
}

export function ChatProfilePreview({
  name,
  avatar,
  memberCount,
  createdAt,
  className,
}: ChatProfilePreviewProps) {
  return (
    <div className={className}>
      <div
        className='grid flex-1 gap-5 border border-slate-900 p-2'
        data-testid='user-profile-preview'
      >
        <GroupChatAvatar
          asset={avatar}
          alt={`${name}'s avatar`}
          variant='avatar'
          className='w-20 rounded-full bg-black p-1'
        />

        <div>
          <div>
            <h3 className='font-bold'>{name}</h3>
            <div className='flex items-center-safe gap-2'>
              <FaCircle className='text-gray-500' />
              <p className='font-light'> {memberCount} members</p>
            </div>
          </div>

          <div className='font-light'>{formatDate(createdAt)}</div>
        </div>
      </div>
    </div>
  );
}
