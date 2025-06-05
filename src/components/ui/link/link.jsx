import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";

export default function Link({ to, children, className }) {
  return (
    <RouterLink hrefLang='' to={to} className={`${className}`}>
      {children}
    </RouterLink>
  );
}

Link.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};
