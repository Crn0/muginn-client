import PropTypes from "prop-types";

export default function ContentLayout({ header, children }) {
  return (
    <>
      <header>{header}</header>

      {children ? <section>{children}</section> : null}
    </>
  );
}

ContentLayout.propTypes = {
  header: PropTypes.element.isRequired,
  children: PropTypes.element,
};
