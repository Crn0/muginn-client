import PropTypes from "prop-types";

import MessageList from "./message-list";
import CreateMessage from "./create-message";

export default function Messages({ chatId }) {
  return (
    <>
      <div className='flex-1'>
        <MessageList chatId={chatId} />
      </div>

      <CreateMessage chatId={chatId} />
    </>
  );
}

Messages.propTypes = {
  chatId: PropTypes.string.isRequired,
};
