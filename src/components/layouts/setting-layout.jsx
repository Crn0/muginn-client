import PropTypes from "prop-types";

export default function SettingLayout({
  title,
  leftTab,
  rightTab,
  setLeftTab,
  setRightTab,
  leftNavButtons,
  rightNavButtons,
  children,
}) {
  const visibleRightNavButtons = rightNavButtons.filter((btn) => btn.section === leftTab);

  return (
    <div>
      <header>
        <aside>
          <h1>{title}</h1>

          <nav aria-label='left-navigation'>
            {leftNavButtons.map(({ name, defaultContent, buttonText, button: Component }) => (
              <Component
                key={name}
                name={name}
                tab={leftTab}
                buttonText={buttonText}
                setTab={() => setLeftTab(name, defaultContent)}
              />
            ))}
          </nav>
        </aside>
      </header>

      <main>
        <aside>
          <nav aria-label='right-navigation'>
            {visibleRightNavButtons.map(({ name, buttonText, button: Component }) => (
              <Component
                key={name}
                name={name}
                tab={rightTab}
                buttonText={buttonText}
                setTab={setRightTab}
              />
            ))}
          </nav>
        </aside>

        <section>{typeof children === "function" ? children() : children}</section>
      </main>
    </div>
  );
}

SettingLayout.propTypes = {
  title: PropTypes.string.isRequired,
  leftTab: PropTypes.string.isRequired,
  rightTab: PropTypes.string.isRequired,
  setRightTab: PropTypes.func.isRequired,
  setLeftTab: PropTypes.func,
  leftNavButtons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      defaultContent: PropTypes.string.isRequired,
      buttonText: PropTypes.string.isRequired,
      button: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  rightNavButtons: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      buttonText: PropTypes.string.isRequired,
      button: PropTypes.elementType.isRequired,
      section: PropTypes.elementType.isRequired,
    })
  ).isRequired,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]).isRequired,
};
