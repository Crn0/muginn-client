import { useCreateChat, directChatSchema, type ICreateDirectChat } from "../api";

import { Form } from "@/components/ui/form/index";
import { Button } from "@/components/ui/button";

export interface CreateDirectChatProps {
  memberIds: string[];
}

export function CreateDirectChat({ memberIds }: CreateDirectChatProps) {
  const createChatMutation = useCreateChat();

  const onSubmit = (data: ICreateDirectChat) => createChatMutation.mutate(data);

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
