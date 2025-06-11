import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import { env, paths } from "../../../configs";
import { useLogin } from "../../../lib/auth";
import { loginSchema } from "../schema";
import { Form, Input } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";
import { Link } from "../../../components/ui/link";

const version = `v${env.getValue("apiVersion")}`;

const GOOGLE_URL = `${env.getValue("serverUrl")}/api/${version}/auth/google`;

export default function LoginForm({ onSuccess }) {
  const [searchParams] = useSearchParams();

  const login = useLogin({ onSuccess });

  const redirectTo = searchParams.get("redirectTo");

  const onSubmit = (data) => {
    login.mutate(data);
  };
  const onFocus = () => {
    login.reset();
  };
  const onBlur = (trigger) => (field) => () => {
    trigger(field);
  };

  return (
    <>
      <div>
        <Form onSubmit={onSubmit} id='Login-Form' schema={loginSchema}>
          <>
            <div>
              <Input
                type='text'
                name='username'
                label='USERNAME'
                onFocus={onFocus}
                onBlur={onBlur}
                serverError={login?.error}
                required
              />

              <Input
                type='password'
                name='password'
                label='PASSWORD'
                onFocus={onFocus}
                onBlur={onBlur}
                required
              />
            </div>

            <div className='grid'>
              <Button
                type='submit'
                size='m'
                variant='default'
                isLoading={login.isPending}
                disabled={login.isPending}
                testId='login_btn'
              >
                Log in
              </Button>

              <a href={GOOGLE_URL}>
                <Button
                  type='button'
                  size='m'
                  variant='default'
                  isLoading={login.isPending}
                  disabled={login.isPending}
                  testId='google_btn'
                >
                  Log in with Google
                </Button>
              </a>
            </div>
          </>
        </Form>
      </div>
      <div>
        <p>
          Don&apos;t have an account yet?{" "}
          <Link to={paths.register.getHref(redirectTo)}>Register</Link>
        </p>
      </div>
    </>
  );
}

LoginForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
