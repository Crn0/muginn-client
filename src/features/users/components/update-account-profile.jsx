/* eslint-disable jsx-a11y/tabindex-no-positive */
import PropTypes from "prop-types";
import { useActionData, useNavigation, useSubmit } from "react-router-dom";

import { useUserSettingsTabStore } from "../../../stores";
import { usernameSchema, passwordSchema } from "../schema";
import { FormDialog, Input } from "../../../components/ui/form/index";
import { LazyImage } from "../../../components/ui/image";
import { Button } from "../../../components/ui/button";
import avatar from "../../../assets/avatar.png";
import avatarLazy from "../../../assets/avatar-lazy.png";

export default function UpdateAccountProfile({ user }) {
  const updatedSecurity = useActionData();
  const navigate = useNavigation();
  const submit = useSubmit();

  const isSubmitting = navigate.state === "submitting";
  const isFullMember = typeof user.accountLevel === "number" && user.accountLevel > 0;

  const onSubmit = (data) => submit(data, { method: "POST", encType: "multipart/form-data" });

  const setTabs = useUserSettingsTabStore((state) => state.setTabs);

  return (
    <>
      <div>
        <div>
          <LazyImage
            asset={user.profile.backgroundAvatar}
            fallBackAsset={{
              image: avatar,
              lazyImage: avatarLazy,
            }}
            alt='Profile background'
          />
        </div>

        <div>
          <div>
            <LazyImage
              asset={user.profile.avatar}
              fallBackAsset={{ image: avatar, lazyImage: avatarLazy }}
              alt={`${user.profile.displayName || user.username}'s avatar`}
            />
          </div>

          <div data-testid='username-info'>
            <span>{user.profile.displayName || user.username}</span>
          </div>

          <div>
            <Button type='button'>Edit User Profile</Button>
          </div>
        </div>

        <div>
          <div data-testid='display-name'>
            <h2>Display Name</h2>
            <div>
              <span>{user.profile.displayName || "You haven't added a display name yet."}</span>
            </div>

            <Button
              type='button'
              testId='edit-display-name'
              onClick={() => {
                setTabs({ leftTab: "profiles", rightTab: "mainProfile" });
              }}
            >
              Edit
            </Button>
          </div>

          <div data-testid='username'>
            <h2>Username</h2>
            <div>
              <span>{user.username}</span>
            </div>

            <FormDialog
              id='update-username'
              title='Change your username'
              descriptions={["Enter a new username"]}
              schema={usernameSchema}
              onSubmit={onSubmit}
              renderButtonTrigger={(options) => (
                <div>
                  <Button
                    type='button'
                    testId='edit-username'
                    onClick={isFullMember ? options.onClick : () => {}}
                  >
                    Edit
                  </Button>
                </div>
              )}
              renderButtonCancel={(options) => (
                <div>
                  <Button type='button' testId='edit-username-cancel' onClick={options.onClick}>
                    Cancel
                  </Button>
                </div>
              )}
              renderButtonSubmit={() => (
                <div>
                  <Button
                    type='submit'
                    testId='edit-username-submit'
                    isLoading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </div>
              )}
            >
              <>
                <input type='hidden' name='intent' value='username' />

                <Input
                  type='text'
                  name='username'
                  label='Username'
                  serverError={updatedSecurity?.error}
                  required
                />
              </>
            </FormDialog>
          </div>

          <div data-testid='email'>
            <h2>Email</h2>
            <div>
              <span>{user.email || "You haven't added a email yet."}</span>
            </div>

            <Button type='button' testId='edit-email'>
              Edit
            </Button>
          </div>
        </div>
      </div>

      <div data-testid='password-auth'>
        <h2>Password and Authentication</h2>

        <FormDialog
          id='update-password'
          title='Update your password'
          descriptions={["Enter your current password and a new password."]}
          schema={passwordSchema}
          onSubmit={onSubmit}
          renderButtonTrigger={(options) => (
            <div>
              <Button
                type='button'
                testId='edit-password'
                onClick={isFullMember ? options.onClick : () => {}}
              >
                Edit
              </Button>
            </div>
          )}
          renderButtonCancel={(options) => (
            <div>
              <Button type='button' testId='edit-password-cancel' onClick={options.onClick}>
                Cancel
              </Button>
            </div>
          )}
          renderButtonSubmit={() => (
            <div>
              <Button
                type='submit'
                testId='edit-password-submit'
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                Submit
              </Button>
            </div>
          )}
        >
          <>
            <input type='hidden' name='intent' value='password' />

            <Input
              type='password'
              name='oldPassword'
              label='Old Password'
              serverError={updatedSecurity?.error}
              required
            />

            <Input
              type='password'
              name='currentPassword'
              label='Current Password'
              serverError={updatedSecurity?.error}
              required
            />

            <Input
              type='password'
              name='confirmPassword'
              label='Confirm Password'
              serverError={updatedSecurity?.error}
              required
            />
          </>
        </FormDialog>
      </div>
    </>
  );
}

UpdateAccountProfile.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    email: PropTypes.string,
    accountLevel: PropTypes.number.isRequired,
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
