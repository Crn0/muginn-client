import type { PropsWithChildren } from "react";

export interface ChatLayoutProps extends PropsWithChildren {
  title: string;
}

export function ChatLayout({ title, children }: ChatLayoutProps) {
  return (
    <div className='flex flex-1 flex-col gap-2'>
      <header className='flex justify-between border border-slate-900 p-5'>
        <h2>{title}</h2>
      </header>

      <section className='flex flex-1'>{children}</section>
    </div>
  );
}
