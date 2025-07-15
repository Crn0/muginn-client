import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

import { cn } from "../../../utils";

export default function Link({ to, children, className, onClick = () => {} }) {
  return (
    <RouterLink
      hrefLang=''
      to={to}
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center text-sm font-medium whitespace-nowrap text-blue-500 transition-colors hover:opacity-75 focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none",
        className
      )}
    >
      {children}
    </RouterLink>
  );
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
};
