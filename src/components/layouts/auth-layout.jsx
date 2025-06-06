import PropTypes from "prop-types";

import logo from "../../assets/react.svg";
import { useSilentLogin } from "../../hooks";

export default function AuthLayout({ title, children }) {
  useSilentLogin();

  return (
    <div>
      <div>
        <div className='flex justify-center'>
          <img className='h-24 w-auto' src={logo} alt='Workflow' />
        </div>

        <h1>{title}</h1>
      </div>

      <div>
        <div>{children}</div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
