import PropTypes from "prop-types";

import Label from "./label";
import Error from "./error";

export default function FieldWrapper({ label, isRequired, error, children }) {
  return (
    <div>
      <Label label={label} isRequired={isRequired}>
        <div className='mt-1'>{children}</div>
      </Label>
      <Error errorMessage={error?.message} />
    </div>
  );
}

FieldWrapper.propTypes = {
  label: PropTypes.string.isRequired,
  error: PropTypes.shape({ message: PropTypes.string }),
  children: PropTypes.element,
  isRequired: PropTypes.bool,
};
