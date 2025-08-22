import { useNavigate } from "react-router-dom";

import type { TAuthUser } from "@/lib";
import type { TUpdatePassword } from "../api/update-account-profile";

import { paths } from "@/configs";
import { useUpdateAccountProfile, passwordSchema } from "../api";
import { FormDialog, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

export function UpdateAuthentication({
  user,
  isUserFetching,
}: {
  user: TAuthUser;
  isUserFetching: boolean;
}) {
  const navigate = useNavigate();

  const accountMutation = useUpdateAccountProfile({
    onSuccess: () => navigate(paths.login.getHref({ redirectTo: null })),
  });

  const isFullMember = typeof user.accountLevel === "number" && user.accountLevel > 0;
  const isFormDone = !isUserFetching && accountMutation.isSuccess;
  const isFormBusy = isUserFetching || accountMutation.isPending;

  const onSubmit = (data: TUpdatePassword) => accountMutation.mutate(data);

  return (
    <div
      id='user-authentication'
      data-testid='password-auth'
      className='grid place-content-center-safe place-items-center-safe gap-2 sm:w-4xl'
    >
      <h2 className='font-bold'>Password and Authentication</h2>

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
