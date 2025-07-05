/* eslint-disable jsx-a11y/tabindex-no-positive */
import PropTypes from "prop-types";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useActionData, useNavigation, useSubmit } from "react-router-dom";

import { userMainProfileSchema, ACCEPTED_IMAGE_TYPES, MAX_ABOUT_ME_LEN } from "../schema";
import { getAuthUserQueryOptions } from "../../../lib";
import { Form, Input, File, TextArea, FormConfirmation } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";
import { Spinner } from "../../../components/ui/spinner";
import { NameplatePreview, UserProfilePreview } from "../../../components/ui/preview";

export default function UpdateUserMainProfile() {
  const { isLoading, data: user } = useQuery({ ...getAuthUserQueryOptions() });

  const updatedProfile = useActionData();
  const navigate = useNavigation();
  const submit = useSubmit();

  const avatarRef = useRef();
  const backgroundAvatarRef = useRef();

  if (isLoading && !user) {
    return <Spinner />;
  }

  const isSubmitting = navigate.state === "submitting";

  const onSubmit = (methods) => (data) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (["avatar", "backgroundAvatar"].includes(key)) {
        formData.append(key, value[0]);
      } else {
        formData.append(key, value);
      }
    });

    submit(formData, { method: "PATCH", encType: "multipart/form-data" });

    methods.reset();
  };

  return (
    <Form
      id='Main-Profile-Form'
      onSubmit={onSubmit}
      schema={userMainProfileSchema}
      mode='onBlur'
      defaultValues={{ displayName: "", aboutMe: "" }}
      values={{ displayName: user?.profile?.displayName, aboutMe: user?.profile?.aboutMe }}
      isCurried
    >
      <>
        <div>
          <div>
            <Input
              type='text'
              name='displayName'
              label='Display Name'
              serverError={updatedProfile?.error}
            />
          </div>

          <div>
            <div>
              <File
                name='avatar'
                label='Change Avatar'
                testId='user-avatar'
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onKeyDown={(e) => e.code === "Enter" && avatarRef.current.click()}
                serverError={updatedProfile?.error}
                renderFieldButton={() => (
                  <Button type='button' onClick={() => avatarRef.current.click()} tabIndex={1}>
                    <p>Avatar</p>
                  </Button>
                )}
                ref={avatarRef}
              />
            </div>

            <div>
              <File
                name='backgroundAvatar'
                label='Change Avatar'
                testId='user-background-avatar'
                accept={ACCEPTED_IMAGE_TYPES.join(",")}
                onKeyDown={(e) => e.code === "Enter" && backgroundAvatarRef.current.click()}
                serverError={updatedProfile?.error}
                renderFieldButton={() => (
                  <Button
                    type='button'
                    onClick={() => backgroundAvatarRef.current.click()}
                    tabIndex={1}
                  >
                    <p>Background Avatar</p>
                  </Button>
                )}
                ref={backgroundAvatarRef}
              />
            </div>
          </div>

          <div>
            <TextArea
              name='aboutMe'
              label='About Me'
              maxLength={MAX_ABOUT_ME_LEN}
              serverError={updatedProfile?.error}
            />
          </div>

          <div>
            <FormConfirmation
              message='Careful — you have unsaved changes!'
              isSubmitting={isSubmitting}
              renderSubmitButton={() => (
                <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting}>
                  <span>Save Changes</span>
                </Button>
              )}
            />
          </div>
        </div>

        <div>
          <UserProfilePreview
            user={user}
            renderProfileButton={() => <Button type='button'>Example Button</Button>}
          >
            <>
              <div>
                <h4>NAMEPLATE PREVIEW</h4>
              </div>

              <NameplatePreview
                username={user.username}
                displayName={user.profile.displayName}
                asset={user.profile.avatar}
              />
            </>
          </UserProfilePreview>
        </div>
      </>
    </Form>
  );
}
