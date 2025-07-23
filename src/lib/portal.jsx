import PropTypes from "prop-types";

import { createPortal } from "react-dom";

export default function Portal({ parentId, children }) {
  const el = document.getElementById(parentId);

  if (!el) return null;

  return createPortal(children, el);
}

Portal.propTypes = {
  parentId: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
