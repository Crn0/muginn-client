import PropTypes from "prop-types";

import Label from "./label";
import Error from "./error";

export default function FieldWrapper({ label, className, isRequired, error, children }) {
  return (
    <div className='flex flex-1 flex-col place-content-center items-center-safe gap-3'>
      <Label label={label} isRequired={isRequired} className={className}>
        <div className='mt-1 flex h-full w-full flex-1 items-center-safe justify-center-safe sm:items-stretch'>
          {children}
        </div>
      </Label>
      <Error errorMessage={error?.message} />
    </div>
  );
}

FieldWrapper.propTypes = {
  label: PropTypes.node,
  className: PropTypes.string,
  error: PropTypes.shape({ message: PropTypes.string }),
  children: PropTypes.element,
  isRequired: PropTypes.bool,
};
