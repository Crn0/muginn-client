import PropType from "prop-types";

import { useCreateChat } from "../api";
import { directChatSchema } from "../schema";
import { Form } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";

export default function CreateDirectChat({ memberIds }) {
  const createChatMutation = useCreateChat();

  const onSubmit = (data) => createChatMutation.mutate(data);

  return (
    <Form
      onSubmit={onSubmit}
      id='DirectChat-Form'
      schema={directChatSchema}
      mode='onBlur'
      defaultValues={{ memberIds }}
    >
      <Button type='submit' testId='create-chat-form-submit'>
        <span>Message</span>
      </Button>
    </Form>
  );
}

CreateDirectChat.propTypes = {
  memberIds: PropType.arrayOf(PropType.string).isRequired,
};
