import PropTypes from "prop-types";

import Error from "./error";

export default function FileWrapper({ label, className, error, onKeyDown, children }) {
  return (
    <div>
      <label className={`${className}`}>
        <span
          role='button'
          className='rounded-sm bg-blue-500 p-2 text-white'
          onKeyDown={onKeyDown}
          tabIndex={0}
        >
          {label}
        </span>
        <div className='mt-1'>{children}</div>{" "}
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
};
