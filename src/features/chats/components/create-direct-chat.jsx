import PropType from "prop-types";
import { useSubmit } from "react-router-dom";

import { directChatSchema } from "../schema";
import { Form } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";

export default function CreateDirectChat({ memberIds }) {
  const submit = useSubmit();

  const onSubmit = (data) => submit(data, { method: "POST" });

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
