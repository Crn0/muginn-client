import type { PropsWithChildren } from "react";

import { createPortal } from "react-dom";

export interface PortalProps extends PropsWithChildren {
  parentId: string;
}

export function Portal({ parentId, children }: PortalProps) {
  const el = document.getElementById(parentId);

  if (!el) return null;

  return createPortal(children, el);
}
