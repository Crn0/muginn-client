import PropTypes from "prop-types";

export default function ContentLayout({ header, children }) {
  return (
    <>
      <header className='flex'>{header}</header>

      <section>{children}</section>
    </>
  );
}

ContentLayout.propTypes = {
  header: PropTypes.element.isRequired,
  children: PropTypes.element,
};
