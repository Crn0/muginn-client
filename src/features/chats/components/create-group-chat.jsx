import { useRef } from "react";

import { useCreateChat } from "../api/create-chat";
import { ACCEPTED_IMAGE_TYPES, groupChatSchema } from "../schema";
import { FormDialog, Input, File } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";

export default function CreateGroupChat() {
  const createChatMutation = useCreateChat();

  const avatarRef = useRef();

  const onSubmit = (data) => {
    const formData = new FormData();

    formData.append("isMultiForm", "false");

    Object.entries(data).forEach(([key, value]) => {
      if (["avatar"].includes(key) && value.length) {
        if (formData.get("isMultiForm") === "false") {
          formData.set("isMultiForm", "true");
        }
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    createChatMutation.mutate(formData);
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
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onKeyDown={(e) => e.code === "Enter" && avatarRef.current.click()}
          serverError={createChatMutation?.error}
          ref={avatarRef}
        />
        <Input type='text' name='name' label='Chat Name' serverError={createChatMutation?.error} />
      </>
    </FormDialog>
  );
}
