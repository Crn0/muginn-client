import PropTypes from "prop-types";

const reasons = [
  "Changing your username is not allowed",
  "Changing your email is not allowed",
  "Changing your password is not allowed",
  "Account deletion is not allowed",
];

export default function UserStanding({ accountLevel }) {
  const isFullMember = typeof accountLevel === "number" && accountLevel > 0;

  return (
    <div>
      <h2>Membership and Access</h2>

      <section aria-labelledby='user-limitations'>
        <div role='alert' data-testid='user-standing-message'>
          <strong id='user-limitations'>
            {isFullMember
              ? "You are a Full Member with unrestricted access to all features."
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
      </section>
    </div>
  );
}

UserStanding.propTypes = {
  accountLevel: PropTypes.number.isRequired,
};
