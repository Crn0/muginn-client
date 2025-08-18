import { useSearchParams } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import { env, paths } from "@/configs";
import { cn } from "@/utils";

import { useLogin, loginSchema, type TLogin } from "@/lib/auth";
import { FieldSet, Form, Input } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Link, Anchor } from "@/components/ui/link";

export interface LoginFormProps {
  onSuccess: (...args: any[]) => void;
}

const version = `v${env.API_VERSION}`;

const GOOGLE_URL = `${env.SERVER_URL}/api/${version}/auth/google`;

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [searchParams] = useSearchParams();

  const login = useLogin({ onSuccess });

  const redirectTo = searchParams.get("redirectTo");

  const onSubmit = (data: TLogin) => {
    login.mutate(data);
  };
  const onFocus = () => {
    login.reset();
  };

  return (
    <Form
      id='Login-Form'
      className='w-full bg-gray-900 sm:w-2xl'
      schema={loginSchema}
      onSubmit={onSubmit}
      defaultValues={{ username: "", password: "" }}
      mode='onBlur'
    >
      <FieldSet className='flex flex-col gap-10 p-5 sm:grid sm:place-content-center sm:place-items-center sm:gap-5'>
        <div className='grid place-content-center place-items-center'>
          <h2 className='self-center text-2xl font-bold'>Welcome Back!</h2>

          <i className='text-sm font-thin'>We&apos;re so excited to see you again!</i>
        </div>

        <div className='grid gap-5'>
          <Input
            type='text'
            name='username'
            label='USERNAME'
            className='sm:w-md sm:p-2'
            onFocus={onFocus}
            serverError={login?.error}
            required
          />

          <Input
            type='password'
            name='password'
            label='PASSWORD'
            className='sm:w-md sm:p-2'
            onFocus={onFocus}
            serverError={login?.error}
            required
          />
        </div>

        <div className='grid gap-5'>
          <Button
            type='submit'
            size='lg'
            variant='default'
            isLoading={login.isPending}
            disabled={login.isPending}
            testId='login_btn'
          >
            Log in
          </Button>

          <Anchor
            testId='google_btn'
            to={GOOGLE_URL}
            variant='button'
            size='lg'
            className={cn(
              "bg-white text-gray-600 hover:opacity-75",
              `${login.isPending ? "pointer-events-none" : "pointer-events-auto"}`
            )}
          >
            <span className='flex items-center gap-1'>
              <FcGoogle /> Log in with Google
            </span>
          </Anchor>
        </div>
      </FieldSet>

      <div className='flex justify-center'>
        Don&apos;t have an account yet?
        <Link
          to={paths.register.getHref({ redirectTo })}
          className={cn(
            "ml-1 rounded-md p-0",
            `${login.isPending ? "pointer-events-none" : "foo pointer-events-auto"}`
          )}
        >
          Register
        </Link>
      </div>
    </Form>
  );
}
