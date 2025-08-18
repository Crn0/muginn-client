import { cn } from "@/utils";

export interface ErrorMessage {
  message?: string;
  className?: string;
}

export function ErrorMessage({ message, className = "" }: ErrorMessage) {
  if (!message) return null;

  return (
    <div
      role='alert'
      aria-label={message}
      className={cn("text-center text-sm font-semibold text-red-500", className)}
    >
      {message}
    </div>
  );
}
