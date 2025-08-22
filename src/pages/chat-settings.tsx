import { useParams } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";

import { useChat } from "@/features/chats/api";
import { useChatSettingsTabStore } from "@/stores";
import { ErrorElement, NotFound } from "@/components/errors";
import { SettingLayout, type SettingLayoutProps } from "@/components/layouts";
import { ButtonTab } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { DeleteChat, UpdateChatProfile } from "@/features/chats/components";

const leftNavButtons = [
  {
    name: "chatProfile",
    buttonText: "Chat Profile",
    button: ButtonTab,
    defaultContent: "profile",
    intent: "primary",
  },
] satisfies Pick<SettingLayoutProps, "leftNavButtons">["leftNavButtons"];

const rightNavButtons = [
  {
    name: "profile",
    buttonText: "Profile",
    section: "chatProfile",
    button: ButtonTab,
    intent: "secondary",
  },
] satisfies Pick<SettingLayoutProps, "rightNavButtons">["rightNavButtons"];

const contents = [
  {
    section: "profile",
    content: UpdateChatProfile,
  },
];

export function ChatSettingsPage() {
  const params = useParams();

  const chatQuery = useChat(params.chatId ?? "");

  const leftTab = useChatSettingsTabStore((s) => s.leftTab);
  const rightTab = useChatSettingsTabStore((s) => s.rightTab);
  const setleftTab = useChatSettingsTabStore((s) => s.setLeftTab);
  const setRightTab = useChatSettingsTabStore((s) => s.setRightTab);

  const ActiveContent = contents.find(({ section }) => section === rightTab)?.content;

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
        setLeftTab={setleftTab}
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
