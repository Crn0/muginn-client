import PropTypes from "prop-types";
import { cva } from "class-variance-authority";
import { cn } from "../../../utils/index";

const spinner = cva("animate-spin", {
  variants: {
    light: "text-white",
    primary: "text-slate-600",
  },
  size: {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  },
});

export default function Spinner({ size = "md", variant = "primary", className = "" }) {
  return (
    <>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={cn(spinner({ size, variant }), className)}
        data-testid='spinner'
      >
        <path d='M21 12a9 9 0 1 1-6.219-8.56' />
      </svg>
      <span className='sr-only'>Loading</span>
    </>
  );
}

Spinner.propTypes = {
  size: PropTypes.string,
  variant: PropTypes.string,
  className: PropTypes.string,
};
