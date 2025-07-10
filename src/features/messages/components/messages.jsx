import PropTypes from "prop-types";

import MessageList from "./message-list";
import CreateMessage from "./create-message";

export default function Messages({ chatId }) {
  return (
    <>
      <div>
        <MessageList chatId={chatId} />
      </div>
      <div>
        <CreateMessage chatId={chatId} />
      </div>
    </>
  );
}

Messages.propTypes = {
  chatId: PropTypes.string.isRequired,
};
