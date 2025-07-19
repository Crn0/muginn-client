import PropTypes from "prop-types";

import { cn } from "../../../utils";

export default function Error({ errorMessage, className }) {
  if (!errorMessage) return null;

  return (
    <div
      role='alert'
      aria-label={errorMessage}
      className={cn("text-center text-sm font-semibold text-red-500", className)}
    >
      {errorMessage}
    </div>
  );
}

Error.propTypes = {
  errorMessage: PropTypes.string,
  className: PropTypes.string,
};
