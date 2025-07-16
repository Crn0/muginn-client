import PropTypes from "prop-types";

import Error from "./error";
import { cn } from "../../../utils";

export default function FileWrapper({ label, className, error, onKeyDown, isRequired, children }) {
  return (
    <div>
      <label className={cn(isRequired ? "after:text-red-600 after:content-['*']" : "", className)}>
        <span
          role='button'
          className='rounded-sm bg-indigo-400 p-2 text-white'
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          {label}
        </span>
        <div className='h-0 w-0'>{children}</div>
      </label>
      <Error errorMessage={error?.message} />
    </div>
  );
}

FileWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  className: PropTypes.string,
  error: PropTypes.shape({ message: PropTypes.string }),
  onKeyDown: PropTypes.func.isRequired,
  children: PropTypes.element,
  isRequired: PropTypes.bool,
};
