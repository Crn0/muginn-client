/* eslint-disable jsx-a11y/tabindex-no-positive */
import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useActionData, useNavigation, useSubmit } from "react-router-dom";

import { getAuthUserQueryOptions } from "../../../lib";
import { useUserSettingsTabStore } from "../../../stores";
import { usernameSchema, passwordSchema } from "../schema";
import { FormDialog, Input } from "../../../components/ui/form/index";
import { UserAvatar, BackgroundAvatar } from "../../../components/ui/image";
import { Button } from "../../../components/ui/button";
import { Spinner } from "../../../components/ui/spinner";

export default function UpdateAccountProfile() {
  const { isLoading, isFetching, data: user } = useQuery({ ...getAuthUserQueryOptions() });

  const updatedSecurity = useActionData();
  const navigate = useNavigation();
  const submit = useSubmit();

  const setTabs = useUserSettingsTabStore((state) => state.setTabs);

  if (isLoading && !user) {
    return <Spinner />;
  }

  const isFormSubmitting = navigate.state === "submitting";
  const isDialogDone = !isFetching && !isFormSubmitting;
  const isFormBusy = isFetching || isFormSubmitting;

  const isFullMember = typeof user.accountLevel === "number" && user.accountLevel > 0;

  const onSubmit = (data) => submit(data, { method: "POST" });

  return (
    <>
      <div>
        <div>
          <BackgroundAvatar asset={user.profile.backgroundAvatar} alt='Profile background' />
        </div>

        <div>
          <div>
            <UserAvatar
              asset={user.profile.avatar}
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
              mode='onBlur'
              schema={usernameSchema}
              onSubmit={onSubmit}
              done={isDialogDone}
              renderButtonTrigger={(options) => (
                <div>
                  <Button
                    type='button'
                    testId='edit-username'
                    onClick={isFullMember ? options.onClick : () => {}}
                    ref={options.triggerRef}
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
                    isLoading={isFormBusy}
                    disabled={isFormBusy}
                  >
                    Submit
                  </Button>
                </div>
              )}
            >
              <Input
                type='text'
                name='username'
                label='Username'
                serverError={updatedSecurity?.error}
                required
              />
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
          mode='onBlur'
          schema={passwordSchema}
          onSubmit={onSubmit}
          done={isDialogDone}
          renderButtonTrigger={(options) => (
            <div>
              <Button
                type='button'
                testId='edit-password'
                onClick={isFullMember ? options.onClick : () => {}}
                ref={options.triggerRef}
              >
                Change Password
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
                isLoading={isFormBusy}
                disabled={isFormBusy}
              >
                Submit
              </Button>
            </div>
          )}
        >
          <>
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
              label='New Password'
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
