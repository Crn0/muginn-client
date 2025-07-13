import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";

import { env, paths } from "../../../configs";
import { useRegister } from "../../../lib/auth";
import { registerSchema } from "../schema";
import { FieldSet, Form, Input } from "../../../components/ui/form/index";
import { Button } from "../../../components/ui/button";
import { Anchor, Link } from "../../../components/ui/link";
import { FcGoogle } from "react-icons/fc";

const version = `v${env.getValue("apiVersion")}`;

const GOOGLE_URL = `${env.getValue("serverUrl")}/api/${version}/auth/google`;

export default function RegisterForm({ onSuccess }) {
  const [searchParams] = useSearchParams();
  const registering = useRegister({ onSuccess });

  const redirectTo = searchParams.get("redirectTo");

  const onSubmit = (data) => {
    registering.mutate(data);
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        id='Register-Form'
        className='w-full bg-gray-900 sm:w-lg'
        schema={registerSchema}
        mode='onBlur'
      >
        <FieldSet className='flex flex-col gap-10 p-5 sm:grid sm:place-content-center sm:place-items-center sm:gap-5'>
          <h2 className='self-center font-bold'>Create an account</h2>

          <div className='grid gap-5'>
            <Input
              type='text'
              name='displayName'
              label='DISPLAY NAME'
              serverError={registering?.error}
            />

            <Input
              type='text'
              name='username'
              label='USERNAME'
              serverError={registering?.error}
              required
            />

            <Input
              type='password'
              name='password'
              label='PASSWORD'
              serverError={registering?.error}
              required
            />

            <Input
              type='password'
              name='confirmPassword'
              label='CONFIRM PASSWORD'
              serverError={registering?.error}
              required
            />
          </div>

          <div className='grid gap-5'>
            <Button
              type='submit'
              size='lg'
              variant='default'
              isLoading={registering.isPending}
              disabled={registering.isPending}
              testId='register_btn'
            >
              Register
            </Button>

            <Anchor
              to={GOOGLE_URL}
              variant='button'
              size='lg'
              className='bg-white text-gray-600 hover:opacity-75'
              style={{ pointerEvents: registering.isPending ? "none" : "auto" }}
            >
              <span className='flex items-center gap-1'>
                <FcGoogle /> Register with Google
              </span>
            </Anchor>
          </div>
        </FieldSet>
      </Form>

      <div className='flex justify-center'>
        Already have an account?
        <Link to={paths.register.getHref({ redirectTo })} className='ml-1 rounded-md'>
          Register
        </Link>
      </div>
    </>
  );
}

RegisterForm.propTypes = {
  onSuccess: PropTypes.func.isRequired,
};
