import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { useChat } from "../features/chats/api";
import { useChatSettingsTabStore } from "../stores";
import { ErrorElement, NotFound } from "../components/errors";
import { SettingLayout } from "../components/layouts";
import { ButtonTab } from "../components/ui/button";
import { Spinner } from "../components/ui/spinner";
import { DeleteChat, UpdateChatProfile } from "../features/chats/components";

const leftNavButtons = [
  {
    name: "chatProfile",
    buttonText: "Chat Profile",
    button: ButtonTab,
    defaultContent: "profile",
    intent: "primary",
  },
];

const rightNavButtons = [
  {
    name: "profile",
    buttonText: "Profile",
    section: "chatProfile",
    button: ButtonTab,
    intent: "secondary",
  },
];

const contents = [
  {
    section: "profile",
    content: UpdateChatProfile,
  },
];

export default function ChatSettingsPage() {
  const { chatId } = useParams();

  const chatQuery = useChat(chatId);

  const leftTab = useChatSettingsTabStore((s) => s.leftTab);
  const setTabs = useChatSettingsTabStore((s) => s.setTabs);
  const rightTab = useChatSettingsTabStore((s) => s.rightTab);
  const setRightTab = useChatSettingsTabStore((s) => s.setRightTab);

  const ActiveContent = contents.find(({ section }) => section === rightTab)?.content;

  const handleLeftTabChange = (name, defaultContent) =>
    setTabs({ leftTab: name, rightTab: defaultContent });

  if (chatQuery.isError) {
    return <NotFound />;
  }

  if (chatQuery.isLoading && !chatQuery.data) {
    return (
      <div className='flex min-h-dvh items-center-safe justify-center-safe bg-black text-white'>
        <Spinner />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorElement}>
      <SettingLayout
        id='chat-settings'
        title='Chat Settings'
        leftTab={leftTab}
        setLeftTab={handleLeftTabChange}
        rightTab={rightTab}
        setRightTab={setRightTab}
        leftNavButtons={leftNavButtons}
        rightNavButtons={rightNavButtons}
        headerContent={<DeleteChat />}
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
