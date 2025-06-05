import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import { env, paths } from "../../../configs";
import { errorHandler } from "../utils/index";
import { useRegister } from "../../../lib/auth";
import { registerSchema } from "../schema";
import { Form, Input } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";
import { Link } from "../../../components/ui/link";

const version = `v${env.getValue("apiVersion")}`;

const GOOGLE_URL = `${env.getValue("serverUrl")}/api/${version}/auth/google`;

export default function RegisterForm({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const registering = useRegister({ onSuccess });

  const redirectTo = searchParams.get("redirectTo");

  const onBlur = (field, trigger) => () => trigger(field);
  const onSubmit = (data) => {
    registering.mutate(data);
  };

  return (
    <>
      <div>
        <Form onSubmit={onSubmit} id='Register-Form' schema={registerSchema}>
          {({ register, trigger, formState: { errors } }) => (
            <>
              <div>
                <Input
                  type='text'
                  name='displayName'
                  label='DISPLAY NAME'
                  onBlur={onBlur("displayName", trigger)}
                  error={errorHandler("displayName", {
                    formError: errors,
                    fieldErrors: registering.error?.fields,
                  })}
                  registration={{ ...register("displayName") }}
                />

                <Input
                  type='text'
                  name='username'
                  label='USERNAME'
                  onBlur={onBlur("username", trigger)}
                  error={errorHandler("username", {
                    formError: errors,
                    fieldErrors: registering.error?.fields,
                  })}
                  registration={{ ...register("username") }}
                  required
                />

                <Input
                  type='password'
                  name='password'
                  label='PASSWORD'
                  onBlur={onBlur("password", trigger)}
                  error={errorHandler("password", {
                    formError: errors,
                    fieldErrors: registering.error?.fields,
                  })}
                  registration={{ ...register("password") }}
                  required
                />

                <Input
                  type='password'
                  name='confirmPassword'
                  label='CONFIRM PASSWORD'
                  onBlur={onBlur("confirmPassword", trigger)}
                  error={errorHandler("confirmPassword", {
                    formError: errors,
                    fieldErrors: registering.error?.fields,
                  })}
                  registration={{ ...register("confirmPassword") }}
                  required
                />
              </div>

              <div className='grid'>
                <Button
                  type='submit'
                  size='m'
                  variant='default'
                  isLoading={registering.isPending}
                  disabled={registering.isPending}
                  testId='register_btn'
                >
                  Register
                </Button>

                <Button
                  type='submit'
                  size='m'
                  variant='default'
                  isLoading={registering.isPending}
                  disabled={registering.isPending}
                  testId='google_btn'
                >
                  <a href={GOOGLE_URL}>Register with Google</a>
                </Button>
              </div>
            </>
          )}
        </Form>
      </div>
      <div>
        <p>
          Already have an account? <Link to={paths.login.getHref(redirectTo)}>Log in</Link>
        </p>
      </div>
    </>
  );
}

RegisterForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
