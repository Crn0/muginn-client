import { useRef, useMemo, type PropsWithChildren } from "react";
import { useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import { cn } from "@/utils";

import { DashboardDrawerContext } from "./context";
import { useResponsiveDrawer } from "@/hooks";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { DashboardSidebarContent } from "@/features/dashboard/components";

export interface DashboardLayoutProps extends PropsWithChildren {
  title: string;
}

export function DashboardLayout({ title, children }: DashboardLayoutProps) {
  const location = useLocation();
  const drawer = useResponsiveDrawer(640);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const contextValue = useMemo(
    () => ({
      ...drawer,
    }),
    [drawer]
  );

  return (
    <DashboardDrawerContext.Provider value={contextValue}>
      <div className='flex min-h-dvh flex-col gap-2 bg-black text-white' ref={containerRef}>
        <header className='fixed top-auto z-50 flex w-full items-center justify-center gap-2 bg-black p-2 sm:static sm:grid sm:place-content-center sm:gap-0'>
          <Button
            type='button'
            className='sm:hidden'
            onClick={() => {
              if (drawer.isDrawerOpen && location.pathname.endsWith("/me")) return;

              drawer.manual();
              drawer.toggle();
            }}
            ref={triggerRef}
            variant='outline'
          >
            <GiHamburgerMenu />
          </Button>

          <h1 className='font-mono'>{title}</h1>
        </header>

        <main id='dashboard-main' className='flex flex-1'>
          <Drawer
            className='flex p-0'
            open={drawer.isDrawerOpen}
            onClose={() => drawer.close()}
            triggerRef={triggerRef}
            refs={[containerRef]}
          >
            <DashboardSidebarContent />
          </Drawer>

          <div className={cn("hidden flex-1 sm:flex", `${!drawer.isDrawerOpen && "flex"}`)}>
            {children}
          </div>
        </main>
      </div>
    </DashboardDrawerContext.Provider>
  );
}
