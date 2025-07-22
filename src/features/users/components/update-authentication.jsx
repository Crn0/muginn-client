import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

import { paths } from "../../../configs";
import { passwordSchema } from "../schema";
import { useUpdateAccountProfile } from "../api/update-account-profile";
import { FormDialog, Input } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";

export default function UpdateAuthentication({ user, isUserFetching }) {
  const navigate = useNavigate();

  const accountMutation = useUpdateAccountProfile({
    onSuccess: () => navigate(paths.login.getHref({ redirectTo: null })),
  });

  const isFullMember = typeof user.accountLevel === "number" && user.accountLevel > 0;
  const isFormDone = !isUserFetching && accountMutation.isSuccess;
  const isFormBusy = isUserFetching || accountMutation.isPending;

  const onSubmit = (data) => accountMutation.mutate(data);

  return (
    <div
      id='user-authentication'
      data-testid='password-auth'
      className='grid place-content-center-safe place-items-center-safe gap-1 sm:w-4xl'
    >
      <h2>Password and Authentication</h2>

      <FormDialog
        id='update-password'
        parentId='user-detail'
        title='Update your password'
        descriptions={["Enter your current password and a new password."]}
        mode='onBlur'
        className='fixed bottom-3/12 w-fit sm:bottom-10'
        schema={passwordSchema}
        onSubmit={onSubmit}
        done={isFormDone}
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
            serverError={accountMutation?.error}
            required
          />

          <Input
            type='password'
            name='currentPassword'
            label='New Password'
            serverError={accountMutation?.error}
            required
          />

          <Input
            type='password'
            name='confirmPassword'
            label='Confirm Password'
            serverError={accountMutation?.error}
            required
          />
        </>
      </FormDialog>
    </div>
  );
}

UpdateAuthentication.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    accountLevel: PropTypes.number.isRequired,
  }).isRequired,
  isUserFetching: PropTypes.bool.isRequired,
};
