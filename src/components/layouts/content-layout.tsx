import type { PropsWithChildren, ReactNode } from "react";

export interface ContentLayoutProps extends PropsWithChildren {
  header: ReactNode;
}

export function ContentLayout({ header, children }: ContentLayoutProps) {
  return (
    <>
      <header className='flex'>{header}</header>

      <section>{children}</section>
    </>
  );
}
