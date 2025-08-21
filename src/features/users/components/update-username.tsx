import type { TAuthUser } from "@/lib";

import { usernameSchema, useUpdateAccountProfile, type TUpdateUsername } from "../api";
import { FormDialog, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function UpdateUsername({
  user,
  isUserFetching,
}: {
  user: TAuthUser;
  isUserFetching: boolean;
}) {
  const accountMutation = useUpdateAccountProfile();

  const isFullMember = typeof user.accountLevel === "number" && user.accountLevel > 0;
  const isFormDone = !isUserFetching && accountMutation.isSuccess;
  const isFormBusy = isUserFetching || accountMutation.isPending;

  const onSubmit = (data: TUpdateUsername) => accountMutation.mutate(data);

  return (
    <div data-testid='username' className='flex items-center-safe justify-between'>
      <div>
        <h2>Username</h2>

        <p>{user.username}</p>
      </div>

      <FormDialog
        id='update-username'
        parentId='user-detail'
        title='Change your username'
        descriptions={["Enter a new username"]}
        mode='onBlur'
        className='fixed bottom-3/12 w-fit sm:bottom-10'
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
