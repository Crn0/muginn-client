/* eslint-disable jsx-a11y/tabindex-no-positive */
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import { Portal } from "../../../lib";
import { useFilePreview } from "../../../hooks";
import { useUpdateChatProfile } from "../api/update-chat-profile";
import { CustomError } from "../../../errors";
import { useChat, useInfiniteChatMembers } from "../api";
import { chatProfileSchema, ACCEPTED_IMAGE_TYPES, MAX_NAME_LEN } from "../schema";
import { Form, Input, File, FormConfirmation } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";
import { ChatProfilePreview } from "../../../components/ui/preview";
import { Spinner } from "../../../components/ui/spinner";

const getAsset = (shouldRender, previewAsset, avatarAsset) => {
  if (!shouldRender) return null;

  return previewAsset?.url ? previewAsset : avatarAsset;
};

function FormChildren({ parentId, chat, memberCount, serverError, isPending, isSuccess, onReset }) {
  const { reset, watch } = useFormContext();

  const avatarRef = useRef();

  const [previewState, setPreviewState] = useState({
    avatar: true,
  });

  const name = watch("name") ?? chat.name;

  const avatarPreview = useFilePreview();

  const avatarAsset = getAsset(previewState.avatar, avatarPreview?.asset, chat.avatar);

  useEffect(() => {
    if (isSuccess) {
      reset();
      onReset();
      avatarPreview.reset();
      setPreviewState({ avatar: true });
    }
  }, [avatarPreview, isSuccess, onReset, reset]);

  return (
    <>
      <Input
        type='text'
        name='name'
        label='Name'
        serverError={serverError}
        maxLength={MAX_NAME_LEN}
      />

      <div className='grid place-content-center-safe gap-2'>
        <File
          name='avatar'
          label='Avatar'
          testId='chat-avatar'
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          onKeyDown={(e) => e.key === "Enter" && avatarRef.current.click()}
          onChange={(e) => {
            const { files } = e.target;

            avatarPreview.setFile(files[0]);
          }}
          serverError={serverError}
          renderFieldButton={() => (
            <Button
              className='w-50'
              type='button'
              size='sm'
              onClick={() => avatarRef.current.click()}
              tabIndex={1}
            >
              Change Avatar
            </Button>
          )}
          ref={avatarRef}
        />
      </div>

      <FormConfirmation
        message='Careful — you have unsaved changes!'
        isSubmitting={isPending}
        onReset={() => {
          avatarPreview.reset();

          setPreviewState({ avatar: true });
        }}
        renderSubmitButton={() => (
          <Button type='submit' isLoading={isPending} disabled={isPending}>
            <span>Save Changes</span>
          </Button>
        )}
      />

      <Portal parentId={parentId}>
        <ChatProfilePreview
          className='sm:flex-1'
          name={name}
          avatar={avatarAsset}
          memberCount={memberCount}
          createdAt={chat.createdAt}
        />
      </Portal>
    </>
  );
}

export default function UpdateChatProfile() {
  const { chatId } = useParams();

  const chatQuery = useChat(chatId);
  const membersQuery = useInfiniteChatMembers(chatId);

  const profileMutation = useUpdateChatProfile(chatId);

  const chat = chatQuery.data;
  const memberCount = membersQuery.data?.pages?.[0]?.memberCount;

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (["avatar"].includes(key) && value?.[0]) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    profileMutation.mutate(formData);
  };

  if ((chatQuery.isLoading && !chat) || (membersQuery.isLoading && !memberCount)) {
    return (
      <div className='flex flex-1 items-center-safe justify-center-safe bg-black text-white'>
        <Spinner />
      </div>
    );
  }

  return (
    <div id={`chat-profile-${chat.id}`} className='grid flex-1 gap-5 p-2 sm:flex'>
      <Form
        id='Chat-Profile-Form'
        className='grid gap-5 sm:flex-2'
        onSubmit={onSubmit}
        schema={chatProfileSchema}
        mode='onBlur'
        defaultValues={{ name: "" }}
        values={{ name: chat?.name }}
      >
        <FormChildren
          parentId={`chat-profile-${chat.id}`}
          chat={chat}
          memberCount={memberCount}
          serverError={profileMutation.error}
          isPending={profileMutation.isPending}
          isSuccess={profileMutation.isSuccess}
          onReset={() => profileMutation.reset()}
        />
      </Form>
    </div>
  );
}

FormChildren.propTypes = {
  parentId: PropTypes.string.isRequired,
  serverError: PropTypes.instanceOf(CustomError),
  chat: PropTypes.shape({
    id: PropTypes.string.isRequired,
    ownerId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    type: PropTypes.string,
    createdAt: PropTypes.string,
    avatar: PropTypes.shape({
      url: PropTypes.string,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          url: PropTypes.string,
          size: PropTypes.number,
          format: PropTypes.string,
        })
      ),
    }),
  }).isRequired,
  memberCount: PropTypes.number.isRequired,
  isSuccess: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
  onReset: PropTypes.func.isRequired,
};
