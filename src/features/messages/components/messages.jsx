import PropTypes from "prop-types";

import MessageList from "./message-list";
import CreateMessage from "./create-message";

export default function Messages({ chatId }) {
  return (
    <>
      <MessageList chatId={chatId} />

      <CreateMessage chatId={chatId} />
    </>
  );
}

Messages.propTypes = {
  chatId: PropTypes.string.isRequired,
};
