import PropTypes from "prop-types";

export default function Error({ errorMessage }) {
  if (!errorMessage) return null;

  return (
    <div
      role='alert'
      aria-label={errorMessage}
      className='text-center text-sm font-semibold text-red-500'
    >
      {errorMessage}
    </div>
  );
}

Error.propTypes = {
  errorMessage: PropTypes.string,
};
