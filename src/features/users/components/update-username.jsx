import PropTypes from "prop-types";

import { usernameSchema } from "../schema";
import { useUpdateAccountProfile } from "../api/update-account-profile";
import { FormDialog, Input } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";

export default function UpdateUsername({ user, isUserFetching }) {
  const accountMutation = useUpdateAccountProfile();

  const isFullMember = typeof user.accountLevel === "number" && user.accountLevel > 0;
  const isFormDone = !isUserFetching && accountMutation.isSuccess;
  const isFormBusy = isUserFetching || accountMutation.isPending;

  const onSubmit = (data) => accountMutation.mutate(data);

  return (
    <div data-testid='username'>
      <h2>Username</h2>
      <div>
        <span>{user.username}</span>
      </div>

      <FormDialog
        id='update-username'
        parentId='user-detail'
        title='Change your username'
        descriptions={["Enter a new username"]}
        mode='onBlur'
        schema={usernameSchema}
        onSubmit={onSubmit}
        done={isFormDone}
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
          serverError={accountMutation?.error}
          required
        />
      </FormDialog>
    </div>
  );
}

UpdateUsername.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    accountLevel: PropTypes.number.isRequired,
  }).isRequired,
  isUserFetching: PropTypes.bool.isRequired,
};
