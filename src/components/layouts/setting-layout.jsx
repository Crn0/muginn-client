import PropTypes from "prop-types";
import { useLocation } from "react-router-dom";
import { SlClose } from "react-icons/sl";

import { paths } from "../../configs";
import { Link } from "../ui/link";

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
  const location = useLocation();

  const visibleRightNavButtons = rightNavButtons.filter((btn) => btn.section === leftTab);

  const prevPathName = location.state?.prevPathName || paths.protected.dashboard.me.getHref();

  return (
    <div id={id} className='flex min-h-dvh flex-col gap-5 bg-black p-1 text-white'>
      <header className='flex flex-col gap-2'>
        <div className='flex justify-between sm:justify-evenly'>
          <h1 className='self-center-safe font-mono'>{title}</h1>
          <Link to={prevPathName} variant='outline'>
            <SlClose className='text-2xl' />
          </Link>
        </div>

        <nav className='flex justify-between sm:justify-evenly' aria-label='left-navigation'>
          {leftNavButtons.map(({ name, defaultContent, intent, buttonText, button: Component }) => (
            <Component
              key={name}
              name={name}
              tab={leftTab}
              intent={intent}
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
            {visibleRightNavButtons.map(({ name, intent, buttonText, button: Component }) => (
              <Component
                key={name}
                name={name}
                tab={rightTab}
                intent={intent}
                buttonText={buttonText}
                setTab={setRightTab}
              />
            ))}
          </nav>
        </aside>

        <section className='flex flex-1'>
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
