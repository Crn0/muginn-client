import { ErrorBoundary } from "react-error-boundary";

import { useUserSettingsTabStore } from "../stores";
import { ErrorElement } from "../components/errors";
import { SettingLayout } from "../components/layouts";
import { ButtonTab } from "../components/ui/button";
import {
  UpdateAccountProfile,
  UserStanding,
  UpdateMainProfile,
} from "../features/users/components";

const leftNavButtons = [
  {
    name: "myAccount",
    buttonText: "My Account",
    button: ButtonTab,
    defaultContent: "security",
  },
  {
    name: "profiles",
    buttonText: "Profiles",
    button: ButtonTab,
    defaultContent: "mainProfile",
  },
];

const rightNavButtons = [
  {
    name: "security",
    buttonText: "Security",
    section: "myAccount",
    button: ButtonTab,
  },
  {
    name: "userStanding",
    buttonText: "Standing",
    section: "myAccount",
    button: ButtonTab,
  },
  {
    name: "mainProfile",
    buttonText: "Main Profile",
    section: "profiles",
    button: ButtonTab,
  },
];

const contents = [
  {
    section: "security",
    content: UpdateAccountProfile,
  },
  {
    section: "userStanding",
    content: UserStanding,
  },
  {
    section: "mainProfile",
    content: UpdateMainProfile,
  },
];

export default function UserSettingsPage() {
  const leftTab = useUserSettingsTabStore((s) => s.leftTab);
  const setTabs = useUserSettingsTabStore((s) => s.setTabs);
  const rightTab = useUserSettingsTabStore((s) => s.rightTab);
  const setRightTab = useUserSettingsTabStore((s) => s.setRightTab);

  const ActiveContent = contents.find(({ section }) => section === rightTab)?.content;

  const handleLeftTabChange = (name, defaultContent) =>
    setTabs({ leftTab: name, rightTab: defaultContent });

  return (
    <ErrorBoundary FallbackComponent={ErrorElement}>
      <SettingLayout
        title='User Settings'
        leftTab={leftTab}
        setLeftTab={handleLeftTabChange}
        rightTab={rightTab}
        setRightTab={setRightTab}
        leftNavButtons={leftNavButtons}
        rightNavButtons={rightNavButtons}
      >
        {ActiveContent ? (
          <ActiveContent />
        ) : (
          <p className='text-muted'>Select a section to get started.</p>
        )}
      </SettingLayout>
    </ErrorBoundary>
  );
}
