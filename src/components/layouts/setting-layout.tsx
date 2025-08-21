import type { JSXElementConstructor, PropsWithChildren, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { SlClose } from "react-icons/sl";

import type { ButtonTabProps } from "@/components/ui/button";
import type { ISettingsTabStore } from "@/stores/settings-tab";

import { paths } from "@/configs";
import { Link } from "@/components/ui/link";

export interface SettingLayoutProps extends PropsWithChildren, Partial<ISettingsTabStore> {
  id: string;
  title: string;
  leftTab: string;
  rightTab: string;
  setLeftTab: (tab: string) => void;
  setRightTab: (tab: string) => void;
  headerContent: ReactNode;
  leftNavButtons: {
    name: string;
    buttonText: string;
    defaultContent: string;
    button: JSXElementConstructor<ButtonTabProps>;
    intent: Pick<ButtonTabProps, "intent">["intent"];
  }[];
  rightNavButtons: {
    name: string;
    buttonText: string;
    section: string;
    button: JSXElementConstructor<ButtonTabProps>;
    intent: Pick<ButtonTabProps, "intent">["intent"];
  }[];
}

export function SettingLayout({
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
}: SettingLayoutProps) {
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
              testId={`tab-${name}`}
              name={name}
              tab={leftTab}
              intent={intent}
              setTab={() => {
                setLeftTab(name);
                setRightTab(defaultContent);
              }}
            >
              <span>{buttonText}</span>
            </Component>
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
                testId={`tab-${name}`}
                name={name}
                tab={rightTab}
                intent={intent}
                setTab={setRightTab}
              >
                <span>{buttonText}</span>
              </Component>
            ))}
          </nav>
        </aside>

        <section className='flex flex-1'>{children}</section>
      </main>
    </div>
  );
}
