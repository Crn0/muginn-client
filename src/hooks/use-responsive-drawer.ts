import { useCallback, useEffect, useMemo, useState } from "react";

export const useResponsiveDrawer = (screenSize: number) => {
  const [isAutoDrawer, setIsAutoDrawer] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clientWidth, setClientWidth] = useState(window.innerWidth);

  const close = useCallback(() => setIsDrawerOpen(false), []);
  const open = useCallback(() => setIsDrawerOpen(true), []);
  const toggle = useCallback(() => setIsDrawerOpen((state) => !state), []);
  const auto = useCallback(() => setIsAutoDrawer(true), []);
  const manual = useCallback(() => setIsAutoDrawer(false), []);

  const state = useMemo(
    () => ({
      isAutoDrawer,
      isDrawerOpen,
      clientWidth,
      close,
      open,
      toggle,
      auto,
      manual,
    }),
    [auto, clientWidth, close, isAutoDrawer, isDrawerOpen, manual, open, toggle]
  );

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    window.addEventListener(
      "resize",
      () => setClientWidth(window.innerWidth),

      { signal }
    );

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (clientWidth < screenSize && isAutoDrawer && !isDrawerOpen) {
      setIsDrawerOpen(true);
    } else if (clientWidth >= screenSize && !isDrawerOpen) {
      setIsDrawerOpen(false);
    }
  }, [clientWidth, isAutoDrawer, isDrawerOpen, screenSize]);

  return state;
};
