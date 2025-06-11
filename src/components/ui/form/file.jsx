import PropTypes from "prop-types";
import { forwardRef } from "react";

import FileWrapper from "./file-wrapper";

const File = forwardRef(
  (
    { label, renderFieldButton, onKeyDown, error, className, name, registration, accept, ...props },
    ref
  ) => {
    const fieldButton = renderFieldButton();

    return (
      <div>
        {fieldButton}
        <FileWrapper label={label} className={className} error={error} onKeyDown={onKeyDown}>
          <input
            type='file'
            name={name}
            className='hidden'
            aria-invalid={error?.[name] ? "true" : "false"}
            accept={accept}
            ref={ref}
            {...registration}
            {...props}
          />
        </FileWrapper>
      </div>
    );
  }
);

File.displayName = "File";

File.propTypes = {
  label: PropTypes.string.isRequired,
  renderFieldButton: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  error: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.instanceOf(Element),
    ])
  ),
  registration: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.func])),
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  accept: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default File;
