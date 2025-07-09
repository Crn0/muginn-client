import { ErrorBoundary } from "react-error-boundary";

import { ErrorElement } from "../../../components/errors";
import { ContentLayout } from "../../../components/layouts";
import DirectChatList from "../../chats/components/direct-chat-list";

export default function DashBoardMe() {
  return (
    <ContentLayout
      header={
        <>
          <h2>Direct Messages</h2>
          <ErrorBoundary fallbackRender={ErrorElement}>
            <DirectChatList />
          </ErrorBoundary>
        </>
      }
    />
  );
}
