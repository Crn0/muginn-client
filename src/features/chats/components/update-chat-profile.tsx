import { useParams } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import type { Image, TAsset } from "@/types";
import type { TUpdateChat, TChat } from "../api";

import { ValidationError } from "@/errors";
import { useFilePreview } from "@/hooks";
import { Portal } from "@/lib";
import {
  useChat,
  useUpdateChatProfile,
  useInfiniteChatMembers,
  chatProfileSchema,
  ACCEPTED_IMAGE_TYPES,
  MAX_NAME_LEN,
} from "../api";
import { Form, Input, File, FormConfirmation } from "@/components/ui/form/index";
import { Button } from "@/components/ui/button";
import { ChatProfilePreview } from "@/components/ui/preview";
import { Spinner } from "@/components/ui/spinner";

const isAsset = (asset: any): asset is TAsset => {
  return (asset as TAsset)?.url !== null;
};

const getAsset = (
  shouldRender: boolean,
  previewAsset: { url: string | null; images: Image[]; type: "Image" | "Pdf" | "Epub" },
  avatarAsset: TAsset
) => {
  if (!shouldRender) return null;

  return isAsset(previewAsset) ? (previewAsset satisfies TAsset) : avatarAsset;
};

function FormChildren({
  parentId,
  chat,
  memberCount,
  serverError,
  isPending,
  isSuccess,
  onReset,
}: {
  parentId: string;
  chat: TChat;
  memberCount: number;
  serverError: InstanceType<typeof ValidationError> | null;
  isPending: boolean;
  isSuccess: boolean;
  onReset: () => void;
}) {
  const { reset, watch } = useFormContext();

  const avatarRef = useRef<HTMLInputElement>(null);

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
          pressKey={(e) => e.key === "Enter" && avatarRef.current?.click()}
          onChange={(e) => {
            const { files } = e.target;

            const file = files?.[0] ?? null;

            avatarPreview.setFile(file);
          }}
          serverError={serverError}
          renderFieldButton={() => (
            <Button
              className='w-50'
              type='button'
              size='sm'
              onClick={() => avatarRef.current?.click()}
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

export function UpdateChatProfile() {
  const params = useParams();

  const chatId = params.chatId ?? "";

  const chatQuery = useChat(chatId);
  const membersQuery = useInfiniteChatMembers(chatId);

  const profileMutation = useUpdateChatProfile(chatId);

  const onSubmit = (data: TUpdateChat) => {
    profileMutation.mutate(data);
  };

  if ((!chatQuery.isSuccess && !chatQuery.data) || (membersQuery.isSuccess && !membersQuery.data)) {
    return (
      <div className='flex flex-1 items-center-safe justify-center-safe bg-black text-white'>
        <Spinner />
      </div>
    );
  }

  const chat = chatQuery.data;

  const memberCount = membersQuery.data?.pages?.[0]?.memberCount as number;

  return (
    <div id={`chat-profile-${chat.id}`} className='grid flex-1 gap-5 p-2 sm:flex'>
      <Form
        id='Chat-Profile-Form'
        className='grid gap-5 sm:flex-2'
        onSubmit={onSubmit}
        schema={chatProfileSchema}
        mode='onBlur'
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
