import { useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { env, paths } from "@/configs";
import { cn } from "@/utils";

import { useRegister, registerSchema, type TRegister } from "@/lib/auth";

import { FieldSet, Form, Input } from "@/components/ui/form/index";
import { Button } from "@/components/ui/button";
import { Anchor, Link } from "@/components/ui/link";

export interface RegistterFormProps {
  onSuccess: (...args: any[]) => void;
}

const version = `v${env.API_VERSION}`;

const GOOGLE_URL = `${env.SERVER_URL}/api/${version}/auth/google`;

export function RegisterForm({ onSuccess }: RegistterFormProps) {
  const [searchParams] = useSearchParams();
  const register = useRegister({ onSuccess });

  const redirectTo = searchParams.get("redirectTo");

  const onSubmit = (data: TRegister) => {
    register.mutate(data);
  };

  return (
    <Form
      onSubmit={onSubmit}
      id='Register-Form'
      className='w-full bg-gray-900 sm:w-2xl'
      schema={registerSchema}
      mode='onBlur'
    >
      <FieldSet className='flex flex-col gap-10 p-5 sm:grid sm:place-content-center sm:place-items-center sm:gap-5'>
        <h2 className='self-center text-2xl font-bold'>Create an account</h2>

        <div className='grid gap-5'>
          <Input
            type='text'
            name='displayName'
            label='DISPLAY NAME'
            className='sm:w-md sm:p-2'
            serverError={register?.error}
          />

          <Input
            type='text'
            name='username'
            label='USERNAME'
            className='sm:w-md sm:p-2'
            serverError={register?.error}
            required
          />

          <Input
            type='password'
            name='password'
            label='PASSWORD'
            className='sm:w-md sm:p-2'
            serverError={register?.error}
            required
          />

          <Input
            type='password'
            name='confirmPassword'
            label='CONFIRM PASSWORD'
            className='sm:w-md sm:p-2'
            serverError={register?.error}
            required
          />
        </div>

        <div className='grid gap-5'>
          <Button
            type='submit'
            size='lg'
            variant='default'
            isLoading={register.isPending}
            disabled={register.isPending}
            testId='register_btn'
          >
            Register
          </Button>

          <Anchor
            testId='google_btn'
            to={GOOGLE_URL}
            variant='button'
            size='lg'
            className={cn(
              "bg-white text-gray-600 hover:opacity-75",
              `${register.isPending ? "pointer-events-none" : "pointer-events-auto"}`
            )}
          >
            <span className='flex items-center gap-1'>
              <FcGoogle /> Register with Google
            </span>
          </Anchor>
        </div>
      </FieldSet>

      <div className='flex justify-center'>
        Already have an account?
        <Link
          to={paths.login.getHref({ redirectTo })}
          className={cn(
            "ml-1 rounded-md p-0",
            `${register.isPending ? "pointer-events-none" : "foo pointer-events-auto"}`
          )}
        >
          Log in
        </Link>
      </div>
    </Form>
  );
}
