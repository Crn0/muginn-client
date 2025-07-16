import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

import { cva } from "class-variance-authority";
import { cn } from "../../../utils/index";

const link = cva(
  "inline-flex items-center justify-center text-sm font-medium whitespace-nowrap text-blue-500 transition-colors hover:opacity-75 focus-visible:ring-4 focus-visible:ring-blue-500 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default: "text-blue-500 hover:opacity-75",
        button:
          "inline-flex items-center justify-center rounded-md bg-indigo-400 p-5 text-center text-sm font-medium whitespace-nowrap text-white no-underline transition-colors hover:opacity-75",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export default function Link({ to, children, className, variant, size, onClick = () => {} }) {
  return (
    <RouterLink
      hrefLang=''
      to={to}
      onClick={onClick}
      className={cn(link({ variant, size }), className)}
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
  variant: PropTypes.string,
  size: PropTypes.string,
};
