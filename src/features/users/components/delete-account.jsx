import { Authorization, policies, useGetUser } from "../../../lib";
import { useChats } from "../../chats/api";
import { useDeleteAccount } from "../api";
import { useDropDownMenu } from "../../../components/ui/dropdown/context/dropdown-menu-context";
import { ConfirmationDialog } from "../../../components/ui/dialog";
import { Button } from "../../../components/ui/button";

export default function DeleteAccount() {
  const { data: user } = useGetUser();
  const chatsQuery = useChats();
  const deleteAccount = useDeleteAccount();

  const { hide, reset } = useDropDownMenu();

  if (!chatsQuery.data) return null;

  return (
    <div
      id={`account-deletion-${user.id}`}
      data-testid='account-delete'
      className='grid place-content-center-safe place-items-center-safe gap-2 sm:w-4xl'
    >
      <h2 className='font-bold'>Account Removal</h2>

      <Authorization
        user={user}
        resource='user'
        action='delete'
        data={chatsQuery.data}
        policies={policies}
        forbiddenFallback={
          <ConfirmationDialog
            parentId={`account-deletion-${user.id}`}
            isDone={deleteAccount.isSuccess}
            className='fixed top-50'
            title='You Own Chats'
            icon='info'
            body='In order to delete your account you must first delete all of chats that you own.'
            onCancel={reset}
            renderButtonTrigger={({ onClick }) => (
              <Button
                type='button'
                variant='outline-destructive'
                onClick={() => {
                  onClick();
                  hide();
                }}
              >
                Delete Account
              </Button>
            )}
            confirmButton={
              <Button className='hidden' type='button'>
                Confirm
              </Button>
            }
          />
        }
      >
        <ConfirmationDialog
          parentId={`account-deletion-${user.id}`}
          isDone={deleteAccount.isSuccess}
          className='fixed top-50'
          title='Delete Account'
          icon='danger'
          body='Are you sure you want to delete your accout?'
          onCancel={reset}
          renderButtonTrigger={({ onClick }) => (
            <Button
              type='button'
              variant='outline-destructive'
              onClick={() => {
                onClick();
                hide();
              }}
            >
              Delete Account
            </Button>
          )}
          confirmButton={
            <Button type='button' variant='destructive' onClick={() => deleteAccount.mutate()}>
              Delete
            </Button>
          }
        />
      </Authorization>
    </div>
  );
}
