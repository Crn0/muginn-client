import PropTypes from "prop-types";
import { useRef, useMemo } from "react";
import { GiHamburgerMenu } from "react-icons/gi";

import { cn } from "../../utils";
import { DashboardDrawerContext } from "./context";
import { useResponsiveDrawer } from "../../hooks";
import { Drawer } from "../ui/drawer";
import { Button } from "../ui/button";
import DashboardSidebarContent from "../../features/dashboard/components/dashboard-sidebar-content";

export default function DashboardLayout({ title, children }) {
  const drawer = useResponsiveDrawer(640);
  const triggerRef = useRef();

  const contextValue = useMemo(
    () => ({
      ...drawer,
    }),
    [drawer]
  );

  return (
    <DashboardDrawerContext.Provider value={contextValue}>
      <div className='flex min-h-dvh flex-col gap-5 bg-black text-white'>
        <header className='flex items-center justify-center gap-2 p-2 sm:grid sm:place-content-center sm:gap-0'>
          <Button
            type='button'
            className='sm:hidden'
            onClick={() => drawer.open()}
            ref={triggerRef}
            variant='outline'
          >
            <GiHamburgerMenu />
          </Button>

          <h1 className='font-mono'>{title}</h1>
        </header>

        <main id='dashboard-main' className='flex flex-1'>
          <Drawer
            className='flex pr-5 sm:p-0'
            open={drawer.isDrawerOpen}
            onClose={() => drawer.close()}
            triggerRef={triggerRef}
          >
            <DashboardSidebarContent />
          </Drawer>

          <div className={cn("hidden sm:flex sm:flex-1", `${!drawer.isDrawerOpen && "flex"}`)}>
            {children}
          </div>
        </main>
      </div>
    </DashboardDrawerContext.Provider>
  );
}

DashboardLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
