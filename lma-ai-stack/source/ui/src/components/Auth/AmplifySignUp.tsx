import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { authSignUp, handleSignIn } from './auth-helpers';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useAuthContainerContext } from './AuthContainer';
import { AuthState } from '@aws-amplify/ui-components';
import { toast } from 'components/ui/use-toast';

// Define Yup schema
const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
type IFormInputs = yup.InferType<typeof schema>;

export default function AmplifySignUp() {
  const { onAuthStateChange } = useAuthContainerContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<IFormInputs> = async (payload) => {
    if (!Auth || typeof Auth.signIn !== 'function') {
      return;
    }

    setIsLoading(true);
    try {
      const data = await authSignUp({
        username: payload.email,
        password: payload.password,
      });

      if (data.userConfirmed) {
        await handleSignIn(payload.email, payload.password, (nextAuthState, data) => {
          onAuthStateChange(nextAuthState, data as any);
        });
      } else {
        onAuthStateChange(AuthState.ConfirmSignUp, {
          ...data.user,
          signUpAttrs: {
            username: payload.email,
            password: payload.password,
            attributes: {
              email: payload.email,
            },
          },
        });
      }
    } catch (error: any) {
      if (typeof error?.message === 'string') {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen h-full flex justify-center items-center">
      <div className="py-10 px-6 shadow-card-4 border border-gray-3 rounded-2xl min-w-96">
        <h1 className="text-lg text-center font-semibold">Sign Up</h1>
        <h2 className="text-sm text-center mb-4">Welcome to Live Meeting Assistant!</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label htmlFor="email" className="text-sm font-normal">
              Email
            </label>
            <Input placeholder="Email" id="email" autoComplete="email" type="email" {...register('email')} />
            {errors.email && <p className="text-red-600 text-xs text-[10px]">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="text-sm font-normal">
              Password
            </label>
            <Input placeholder="Password" id="password" autoComplete="password" type="password" {...register('password')} />
            {errors.password && <p className="text-red-600 text-xs text-[10px]">{errors.password.message}</p>}
          </div>

          <div>
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              Submit{isLoading ? '...' : ''}
            </Button>
          </div>
          <div className="mt-5 text-center">
            <div className="text-xs font-normal text-gray-7 select-none">
              Already have an account?&nbsp;
              <p className="inline-flex text-black font-semibold cursor-pointer" onClick={() => onAuthStateChange(AuthState.SignIn)}>
                Login Now
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
