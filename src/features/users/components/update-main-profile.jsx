/* eslint-disable jsx-a11y/tabindex-no-positive */
import PropTypes from "prop-types";
import { useRef } from "react";
import { useActionData, useNavigation, useSubmit } from "react-router-dom";

import { userMainProfileSchema, ACCEPTED_IMAGE_TYPES, MAX_ABOUT_ME_LEN } from "../schema";
import { Form, Input, File, TextArea, FormConfirmation } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";
import { NameplatePreview, UserProfilePreview } from "../../../components/ui/preview";

export default function UpdateUserMainProfile({ user }) {
  const updatedProfile = useActionData();
  const navigate = useNavigation();
  const submit = useSubmit();

  const avatarRef = useRef();
  const backgroundAvatarRef = useRef();

  const isIdle = navigate.state === "idle";
  const isSubmitting = navigate.state === "submitting";

  const onSubmit = (data) => submit(data, { method: "POST", encType: "multipart/form-data" });

  return (
    <Form
      id='Main-Profile-Form'
      onSubmit={onSubmit}
      schema={userMainProfileSchema}
      mode='onBlur'
      defaultValues={{ displayName: "", aboutMe: "" }}
      values={{ displayName: user?.profile?.displayName, aboutMe: user?.profile?.aboutMe }}
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
                ref={(inputRef) => (e) => {
                  inputRef(e);
                  avatarRef.current = e;
                }}
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
                ref={(inputRef) => (e) => {
                  inputRef(e);
                  backgroundAvatarRef.current = e;
                }}
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

          {isIdle && (
            <div>
              <FormConfirmation
                message='Careful — you have unsaved changes!'
                renderSubmitButton={() => (
                  <Button type='submit' isLoading={isSubmitting} disabled={isSubmitting}>
                    <span>Save Changes</span>
                  </Button>
                )}
              />
            </div>
          )}
        </div>

        <div>
          <UserProfilePreview
            user={user}
            renderProfileButton={() => <Button type='button'>Example Button</Button>}
          >
            <NameplatePreview
              username={user.username}
              displayName={user.profile.displayName}
              asset={user.profile.avatar}
            />
          </UserProfilePreview>
        </div>
      </>
    </Form>
  );
}

UpdateUserMainProfile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    profile: PropTypes.shape({
      displayName: PropTypes.string.isRequired,
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
};
