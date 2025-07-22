import { ErrorBoundary } from "react-error-boundary";
import { useNavigate } from "react-router-dom";
import { RxExit } from "react-icons/rx";

import { paths } from "../configs";
import { useLogout } from "../lib";
import { useUserSettingsTabStore } from "../stores";
import { ErrorElement } from "../components/errors";
import { SettingLayout } from "../components/layouts";
import { ConfirmationDialog } from "../components/ui/dialog";
import { Button, ButtonTab } from "../components/ui/button";
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
  const navigate = useNavigate();

  const logout = useLogout({
    onSuccess: () => navigate(paths.login.getHref({ redirectTo: null }), { replace: true }),
  });

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
        id='user-settings'
        title='User Settings'
        leftTab={leftTab}
        setLeftTab={handleLeftTabChange}
        rightTab={rightTab}
        setRightTab={setRightTab}
        leftNavButtons={leftNavButtons}
        rightNavButtons={rightNavButtons}
        headerContent={
          <ConfirmationDialog
            parentId='user-settings'
            icon='danger'
            title='Log Out'
            body='Are you sure you want to logut?'
            isDone={logout.isSuccess}
            renderButtonTrigger={({ onClick }) => (
              <Button
                className='flex gap-5'
                type='button'
                variant='outline-destructive'
                onClick={onClick}
              >
                <p> Log Out </p>
                <RxExit color='red' />
              </Button>
            )}
            confirmButton={
              <Button
                className='flex gap-5'
                type='button'
                variant='destructive'
                onClick={logout.mutate}
                disabled={logout.isPending}
              >
                <p> Log Out </p>
              </Button>
            }
          />
        }
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
