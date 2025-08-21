/* eslint-disable jsx-a11y/tabindex-no-positive */
import { useFormContext } from "react-hook-form";
import { useEffect, useRef, useState } from "react";

import type { Image } from "@/types";

import { ValidationError } from "@/errors";
import { useFilePreview } from "@/hooks";
import { Portal, useGetUser, type TAuthUser, type TUserAvatar } from "@/lib";
import { useUpdateMainProfile, type TUpdateAccountProfile } from "../api";
import {
  userMainProfileSchema,
  ACCEPTED_IMAGE_TYPES,
  MAX_ABOUT_ME_LEN,
  MAX_DISPLAY_NAME_LEN,
} from "../api";
import { Form, Input, File, TextArea, FormConfirmation } from "@/components/ui/form/index";
import { Button } from "@/components/ui/button";
import { NameplatePreview, UserProfilePreview } from "@/components/ui/preview";
import { RemoveAvatar } from "./remove-avatar";

const isAsset = (asset: any): asset is TUserAvatar => {
  return (asset as TUserAvatar)?.url !== null;
};

const getAsset = (
  shouldRender: boolean,
  previewAsset: { url: string | null; images: Image[] },
  avatarAsset: TUserAvatar | null
) => {
  if (!shouldRender) return null;

  return isAsset(previewAsset) ? previewAsset : avatarAsset;
};

function FormChildren({
  user,
  serverError,
  isPending,
  isSuccess,
  onReset,
}: {
  user: TAuthUser;
  serverError: InstanceType<typeof ValidationError> | null;
  isPending: boolean;
  isSuccess: boolean;
  onReset: () => void;
}) {
  const { reset, watch, register } = useFormContext();

  const avatarRef = useRef<HTMLInputElement>(null);
  const backgroundAvatarRef = useRef<HTMLInputElement>(null);

  const [previewState, setPreviewState] = useState({
    background: true,
    avatar: true,
  });

  const displayName = watch("displayName") || user.profile.displayName;
  const aboutMe = watch("aboutMe") ?? user.profile.aboutMe;

  const avatarPreview = useFilePreview();
  const backgroundAvatarPreview = useFilePreview();

  const avatarAsset = getAsset(previewState.avatar, avatarPreview?.asset, user.profile.avatar);
  const backgroundAvatarAsset = getAsset(
    previewState.background,
    backgroundAvatarPreview?.asset,
    user.profile.backgroundAvatar
  );

  useEffect(() => {
    if (isSuccess) {
      reset();
      onReset();
      avatarPreview.reset();
      backgroundAvatarPreview.reset();
      setPreviewState({ avatar: true, background: true });
    }
  }, [avatarPreview, backgroundAvatarPreview, isSuccess, onReset, reset]);

  return (
    <>
      <input type='hidden' {...register("intent")} />
      <input type='hidden' {...register("avatarId")} />

      <Input
        type='text'
        name='displayName'
        label='Display Name'
        serverError={serverError}
        maxLength={MAX_DISPLAY_NAME_LEN}
      />

      <div className='grid place-content-center-safe gap-2'>
        <File
          name='avatar'
          label='Avatar'
          testId='user-avatar'
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          pressKey={(e) => e.code === "Enter" && avatarRef.current?.click()}
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

        <RemoveAvatar
          intent='delete:avatar'
          buttonText='Remove Avatar'
          hasAvatar={!!user.profile.avatar}
          onClick={() => setPreviewState((prev) => ({ ...prev, avatar: false }))}
          disabled={!previewState.background}
        />
      </div>

      <div className='grid place-content-center-safe gap-2'>
        <File
          name='backgroundAvatar'
          label='Banner'
          testId='user-background-avatar'
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          pressKey={(e) => e.code === "Enter" && backgroundAvatarRef.current?.click()}
          onChange={(e) => {
            const { files } = e.target;
            const file = files?.[0] ?? null;

            backgroundAvatarPreview.setFile(file);
          }}
          serverError={serverError}
          renderFieldButton={() => (
            <Button
              className='w-50'
              type='button'
              onClick={() => backgroundAvatarRef.current?.click()}
              tabIndex={1}
            >
              Change Banner
            </Button>
          )}
          ref={backgroundAvatarRef}
        />

        <RemoveAvatar
          intent='delete:backgroundAvatar'
          buttonText='Remove Banner'
          hasAvatar={!!user.profile.backgroundAvatar}
          onClick={() => setPreviewState((prev) => ({ ...prev, background: false }))}
          disabled={!previewState.avatar}
        />
      </div>

      <TextArea
        name='aboutMe'
        label='About Me'
        variant='aboutMe'
        className='w-full'
        maxLength={MAX_ABOUT_ME_LEN}
        serverError={serverError}
        onChange={(e) => {
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
      />

      <FormConfirmation
        message='Careful — you have unsaved changes!'
        isSubmitting={isPending}
        onReset={() => {
          avatarPreview.reset();
          backgroundAvatarPreview.reset();
          setPreviewState({ avatar: true, background: true });
        }}
        renderSubmitButton={() => (
          <Button type='submit' isLoading={isPending} disabled={isPending}>
            <span>Save Changes</span>
          </Button>
        )}
      />

      <Portal parentId='main-profile'>
        <UserProfilePreview
          className='sm:flex-1'
          username={user.username}
          displayName={displayName}
          aboutMe={aboutMe}
          avatar={avatarAsset}
          backgroundAvatar={backgroundAvatarAsset}
          renderProfileButton={() => <Button type='button'>Example Button</Button>}
        >
          <div>
            <h4 className='font-bold'>NAMEPLATE PREVIEW</h4>

            <NameplatePreview
              username={user.username}
              displayName={displayName}
              asset={avatarAsset}
              className='border-2 border-gray-900 bg-gray-950 p-1'
            />
          </div>
        </UserProfilePreview>
      </Portal>
    </>
  );
}

export function UpdateMainProfile() {
  const userQuery = useGetUser();

  const accountMutation = useUpdateMainProfile();

  const user = userQuery.data;

  const onSubmit = (data: TUpdateAccountProfile) => {
    accountMutation.mutate(data);
  };

  if (!user) return null;

  return (
    <div id='main-profile' className='grid flex-1 gap-5 sm:flex'>
      <Form
        id='Main-Profile-Form'
        className='grid gap-5 sm:flex-2'
        onSubmit={onSubmit}
        schema={userMainProfileSchema}
        mode='onBlur'
        defaultValues={{ displayName: "", aboutMe: "" }}
        values={{ displayName: user?.profile?.displayName, aboutMe: user?.profile?.aboutMe ?? "" }}
      >
        <FormChildren
          user={user}
          serverError={accountMutation.error}
          isPending={accountMutation.isPending}
          isSuccess={accountMutation.isSuccess}
          onReset={() => accountMutation.reset()}
        />
      </Form>
    </div>
  );
}
