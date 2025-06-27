import PropTypes from "prop-types";

export default function ChatLayout({ header, children }) {
  return (
    <>
      <header>{header}</header>

      <section>{children}</section>
    </>
  );
}

ChatLayout.propTypes = {
  header: PropTypes.element.isRequired,
  children: PropTypes.element.isRequired,
};
