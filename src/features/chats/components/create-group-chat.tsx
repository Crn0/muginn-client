import { useRef } from "react";

import {
  useCreateChat,
  ACCEPTED_IMAGE_TYPES,
  groupChatSchema,
  type ICreateGroupChat,
} from "../api";

import { FormDialog, Input, File } from "@/components/ui/form/index";
import { Button } from "@/components/ui/button";

export function CreateGroupChat() {
  const createChatMutation = useCreateChat();

  const avatarRef = useRef<HTMLInputElement>(null);

  const onSubmit = (data: ICreateGroupChat) => {
    if (data.avatar) {
      data.isMultiForm = true;
    }

    createChatMutation.mutate(data);
  };

  return (
    <FormDialog
      parentId='dashboard-main'
      id='GroupChat-Form'
      title='Customize Your Group Chat'
      descriptions={[
        "Give your new group-chat a personality with a name and an icon. You can always change it later.",
      ]}
      mode='onBlur'
      schema={groupChatSchema}
      onSubmit={onSubmit}
      done={createChatMutation.isSuccess}
      renderButtonTrigger={(options) => (
        <Button
          type='button'
          testId='create-chat-form-trigger'
          onClick={options.onClick}
          ref={options.triggerRef}
        >
          Create Chat
        </Button>
      )}
      renderButtonCancel={(options) => (
        <Button type='button' testId='create-chat-form-cancel' onClick={options.onClick}>
          Cancel
        </Button>
      )}
      renderButtonSubmit={() => (
        <div>
          <Button
            type='submit'
            testId='create-chat-form-submit'
            isLoading={createChatMutation.isPending}
            disabled={createChatMutation.isPending}
          >
            Submit
          </Button>
        </div>
      )}
    >
      <>
        <File
          name='avatar'
          label='Upload Avatar'
          testId='chat-avatar'
          className='bg-indigo-400 text-white hover:opacity-75'
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          pressKey={(e) => e.code === "Enter" && avatarRef.current?.click()}
          serverError={createChatMutation?.error}
          ref={avatarRef}
        />
        <Input type='text' name='name' label='Chat Name' serverError={createChatMutation?.error} />
      </>
    </FormDialog>
  );
}
