import type { TUserAvatar } from "@/lib";

import { cn } from "@/utils";
import { UserAvatar } from "@/components/ui/image";

export interface NameplatePreviewProps {
  username: string;
  displayName: string | null;
  asset: TUserAvatar | null;
  className?: string;
}

export function NameplatePreview({
  username,
  displayName,
  asset,
  className = "",
}: NameplatePreviewProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <UserAvatar asset={asset} alt={`${displayName || username}'s avatar`} />
      <p className='w-45 overflow-hidden font-sans text-sm overflow-ellipsis whitespace-nowrap'>
        {displayName || username}
      </p>
    </div>
  );
}
