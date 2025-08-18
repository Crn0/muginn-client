import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/utils";

type SpinnerVariantsProps = VariantProps<typeof spinnerVariants>;

interface SpinnerProps extends SpinnerVariantsProps {
  className?: string;
}

const spinnerVariants = cva("animate-spin", {
  variants: {
    variant: {
      light: "text-white",
      primary: "text-slate-600",
    },
    size: {
      sm: "h-4 w-4",
      md: "h-8 w-8",
      lg: "h-16 w-16",
      xl: "h-24 w-24",
    },
  },
});

export function Spinner({ size = "md", variant = "primary", className = "" }: SpinnerProps) {
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
        className={cn(spinnerVariants({ size, variant }), className)}
        data-testid='spinner'
      >
        <path d='M21 12a9 9 0 1 1-6.219-8.56' />
      </svg>
      <span className='sr-only'>Loading</span>
    </>
  );
}
