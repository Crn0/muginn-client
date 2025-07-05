import { useActionData, useNavigation, useSubmit } from "react-router-dom";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { getChatsQueryOptions } from "../api/get-chats";
import { ACCEPTED_IMAGE_TYPES, groupChatSchema } from "../schema";
import { FormDialog, Input, File } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";

export default function CreateGroupChat() {
  const { isFetching } = useQuery({ ...getChatsQueryOptions() });

  const createdChat = useActionData();
  const navigate = useNavigation();
  const submit = useSubmit();

  const avatarRef = useRef();

  const isFormSubmitting = navigate.state === "submitting";
  const isDialogDone = !isFetching && !isFormSubmitting;
  const isFormBusy = isFetching || isFormSubmitting;

  const onSubmit = (data) => {
    let encType = "application/x-www-form-urlencoded";
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (["avatar"].includes(key) && value.length) {
        encType = "multipart/form-data";
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    submit(formData, {
      encType,
      method: "POST",
    });
  };

  return (
    <FormDialog
      id='GroupChat-Form'
      title='Customize Your Server'
      descriptions={[
        "Give your new group-chat a personality with a name and an icon. You can always change it later.",
      ]}
      mode='onBlur'
      schema={groupChatSchema}
      onSubmit={onSubmit}
      done={isDialogDone}
      renderButtonTrigger={(options) => (
        <div>
          <Button
            type='button'
            testId='create-chat-form-trigger'
            onClick={options.onClick}
            ref={options.triggerRef}
          >
            Create Chat
          </Button>
        </div>
      )}
      renderButtonCancel={(options) => (
        <div>
          <Button type='button' testId='create-chat-form-cancel' onClick={options.onClick}>
            Cancel
          </Button>
        </div>
      )}
      renderButtonSubmit={() => (
        <div>
          <Button
            type='submit'
            testId='create-chat-form-submit'
            isLoading={isFormBusy}
            disabled={isFormBusy}
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
          serverError={createdChat?.error}
          ref={avatarRef}
        />
        <Input type='text' name='name' label='Chat Name' serverError={createdChat?.error} />
      </>
    </FormDialog>
  );
}
