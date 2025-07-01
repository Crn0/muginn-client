import PropTypes from "prop-types";

export default function DashboardLayout({ title, children }) {
  return (
    <div>
      <header>
        <h1>{title}</h1>
      </header>

      <main>{children}</main>
    </div>
  );
}

DashboardLayout.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.element.isRequired,
};
