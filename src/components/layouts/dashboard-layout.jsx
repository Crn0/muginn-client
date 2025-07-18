import PropTypes from "prop-types";
import { useRef, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";

import { cn } from "../../utils";
import { DashboardDrawerContext } from "./context";
import { useResponsiveDrawer } from "../../hooks";
import { Drawer } from "../ui/drawer";
import { Button } from "../ui/button";
import DashboardSidebarContent from "../../features/dashboard/components/dashboard-sidebar-content";

export default function DashboardLayout({ title, children }) {
  const location = useLocation();
  const drawer = useResponsiveDrawer(640);
  const containerRef = useRef();
  const triggerRef = useRef();

  const contextValue = useMemo(
    () => ({
      ...drawer,
    }),
    [drawer]
  );

  return (
    <DashboardDrawerContext.Provider value={contextValue}>
      <div className='flex min-h-dvh flex-col gap-2 bg-black text-white' ref={containerRef}>
        <header className='flex items-center justify-center gap-2 p-2 sm:grid sm:place-content-center sm:gap-0'>
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

DashboardLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
