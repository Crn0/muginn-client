import PropTypes from "prop-types";
import { GiRaven } from "react-icons/gi";

import { useSilentLogin } from "../../hooks";

export default function AuthLayout({ title, children }) {
  useSilentLogin();

  return (
    <div className='flex min-h-dvh flex-col items-stretch gap-5 bg-gray-900 text-white sm:flex sm:min-h-dvh sm:flex-col sm:gap-10 sm:bg-black sm:p-5'>
      <div className='flex items-center gap-5 self-center sm:self-auto'>
        <div className='flex justify-center'>
          <GiRaven className='h-24 w-auto' />
        </div>

        <h1>{title}</h1>
      </div>

      <div className='sm:grid sm:h-auto sm:place-content-center sm:place-items-center sm:gap-5 sm:self-center'>
        {children}
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
