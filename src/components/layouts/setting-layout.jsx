import PropTypes from "prop-types";

export default function SettingLayout({
  id,
  title,
  leftTab,
  rightTab,
  setLeftTab,
  setRightTab,
  leftNavButtons,
  rightNavButtons,
  headerContent,
  children,
}) {
  const visibleRightNavButtons = rightNavButtons.filter((btn) => btn.section === leftTab);

  return (
    <div id={id} className='flex min-h-dvh flex-col gap-5 bg-black p-1 text-white'>
      <header className='flex flex-col gap-2'>
        <h1 className='self-center-safe font-mono'>{title}</h1>

        <nav className='flex justify-between sm:justify-evenly' aria-label='left-navigation'>
          {leftNavButtons.map(({ name, defaultContent, buttonText, button: Component }) => (
            <Component
              key={name}
              name={name}
              tab={leftTab}
              buttonText={buttonText}
              setTab={() => setLeftTab(name, defaultContent)}
            />
          ))}

          <div>{headerContent}</div>
        </nav>
      </header>

      <main className='flex flex-1 flex-col gap-5'>
        <aside>
          <nav className='flex justify-evenly' aria-label='right-navigation'>
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

        <section className='flex flex-1 flex-col justify-center-safe gap-5 sm:items-center-safe'>
          {typeof children === "function" ? children() : children}
        </section>
      </main>
    </div>
  );
}

SettingLayout.propTypes = {
  id: PropTypes.string.isRequired,
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
  headerContent: PropTypes.element,
};
