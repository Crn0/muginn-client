import { useGetUser } from "@/lib";
import { Spinner } from "@/components/ui/spinner";

const reasons = [
  "Changing your username is not allowed ❌",
  "Changing your email is not allowed ❌",
  "Changing your password is not allowed ❌",
  "Account deletion is not allowed ❌",
] as const;

export function UserStanding() {
  const userQuery = useGetUser();

  if (!userQuery.isSuccess && !userQuery.data) {
    return <Spinner />;
  }

  const user = userQuery.data;

  const isFullMember = typeof user.accountLevel === "number" && user.accountLevel > 0;

  return (
    <div className='flex flex-1 flex-col gap-5 rounded-md border border-slate-900 p-1 sm:w-4xl'>
      <h2>Membership and Access</h2>
      <div className='grid gap-1' aria-labelledby='user-limitations'>
        <div role='alert' data-testid='user-standing-message'>
          <strong id='user-limitations'>
            {isFullMember
              ? "You are a Full Member with unrestricted access to all features ✅"
              : "Features Not Available in Demo:"}
          </strong>
        </div>

        {isFullMember ? null : (
          <ul data-testid='limitation-reasons'>
            {reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
