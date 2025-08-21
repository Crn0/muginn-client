import type { ReactNode } from "react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";

export interface RemoveAvatarProps {
  hasAvatar: boolean;
  disabled: boolean;
  intent: "delete:backgroundAvatar" | "delete:avatar";
  buttonText: ReactNode;
  onClick: () => void;
}

export function RemoveAvatar({
  hasAvatar,
  intent,
  buttonText,
  onClick,
  disabled,
}: RemoveAvatarProps) {
  const { setValue } = useFormContext();

  if (!hasAvatar) return null;

  return (
    <Button
      className='w-50 border border-gray-900'
      type='button'
      variant='outline'
      onClick={() => {
        setValue("intent", intent, {
          shouldDirty: true,
        });

        onClick();
      }}
      disabled={disabled}
    >
      {buttonText}
    </Button>
  );
}
