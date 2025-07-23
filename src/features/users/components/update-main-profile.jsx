/* eslint-disable jsx-a11y/tabindex-no-positive */
import PropTypes from "prop-types";
import { useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";

import { CustomError } from "../../../errors";
import { useFilePreview } from "../../../hooks";
import { Portal, useGetUser } from "../../../lib";
import { useUpdateMainProfile } from "../api";
import { userMainProfileSchema, ACCEPTED_IMAGE_TYPES, MAX_ABOUT_ME_LEN } from "../schema";
import { Form, Input, File, TextArea, FormConfirmation } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";
import { NameplatePreview, UserProfilePreview } from "../../../components/ui/preview";

function FormChildren({ user, serverError, isPending, isSuccess }) {
  const { reset, watch } = useFormContext();

  const avatarRef = useRef();
  const backgroundAvatarRef = useRef();

  const displayName = watch("displayName") || user.profile.displayName;
  const aboutMe = watch("aboutMe") || user.profile.aboutMe;

  const avatarPreview = useFilePreview();
  const backgroundAvatarPreview = useFilePreview();

  const avatarAsset = avatarPreview?.asset.url ? avatarPreview?.asset : user.profile.avatar;
  const backgroundAvatarAsset = backgroundAvatarPreview?.asset.url
    ? backgroundAvatarPreview?.asset
    : user.profile.backgroundAvatar;

  useEffect(() => {
    if (isSuccess) {
      reset();
      avatarPreview.reset();
      backgroundAvatarPreview.reset();
    }
  }, [avatarPreview, backgroundAvatarPreview, isSuccess, reset]);

  return (
    <>
      <Input type='text' name='displayName' label='Display Name' serverError={serverError} />

      <File
        name='avatar'
        label='Avatar'
        testId='user-avatar'
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onKeyDown={(e) => e.code === "Enter" && avatarRef.current.click()}
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

      <File
        name='backgroundAvatar'
        label='Banner'
        testId='user-background-avatar'
        accept={ACCEPTED_IMAGE_TYPES.join(",")}
        onKeyDown={(e) => e.code === "Enter" && backgroundAvatarRef.current.click()}
        onChange={(e) => {
          const { files } = e.target;

          backgroundAvatarPreview.setFile(files[0]);
        }}
        serverError={serverError}
        renderFieldButton={() => (
          <Button
            className='w-50'
            type='button'
            onClick={() => backgroundAvatarRef.current.click()}
            tabIndex={1}
          >
            Change Banner
          </Button>
        )}
        ref={backgroundAvatarRef}
      />

      <TextArea
        name='aboutMe'
        label='About Me'
        variant='aboutMe'
        className='sm:w-lg'
        maxLength={MAX_ABOUT_ME_LEN}
        serverError={serverError}
      />

      <FormConfirmation
        message='Careful — you have unsaved changes!'
        isSubmitting={isPending}
        onReset={() => {
          avatarPreview.reset();
          backgroundAvatarPreview.reset();
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

export default function UpdateUserMainProfile() {
  const userQuery = useGetUser();

  const accountMutation = useUpdateMainProfile();

  const user = userQuery.data;

  const onSubmit = (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (["avatar", "backgroundAvatar"].includes(key)) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    accountMutation.mutate(formData);
  };

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
        />
      </Form>
    </div>
  );
}

FormChildren.propTypes = {
  serverError: PropTypes.instanceOf(CustomError),
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      displayName: PropTypes.string,
      aboutMe: PropTypes.string,
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
      backgroundAvatar: PropTypes.shape({
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
  }).isRequired,
  isSuccess: PropTypes.bool.isRequired,
  isPending: PropTypes.bool.isRequired,
};
