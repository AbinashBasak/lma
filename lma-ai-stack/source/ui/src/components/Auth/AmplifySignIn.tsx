import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { handleSignIn } from './auth-helpers';
import { useAuthContainerContext } from './AuthContainer';
import { useState } from 'react';
import { AuthState } from '@aws-amplify/ui-components';
import { toast } from 'components/ui/use-toast';

// Define Yup schema
const schema = yup.object().shape({
  email: yup.string().email('Enter a valid email address').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});
type IFormInputs = yup.InferType<typeof schema>;

export default function AmplifySignIn() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { onAuthStateChange } = useAuthContainerContext();
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

  const onSubmit: SubmitHandler<IFormInputs> = async (data) => {
    setIsLoading(true);
    try {
      await handleSignIn(data.email, data.password, (nextAuthState, data) => {
        onAuthStateChange(nextAuthState, data as any);
      });
    } catch (error: any) {
      if (typeof error?.message === 'string') {
        toast({
          title: 'Error',
          description: error.message,
          variant: 'destructive',
        });
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen h-full flex justify-center items-center">
      <div className="py-10 px-6 shadow-card-4 border border-gray-3 rounded-2xl min-w-96">
        <h1 className="text-lg text-center font-semibold">Sign In</h1>
        <h2 className="text-sm text-center mb-4">Welcome to Live Meeting Assistant!</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-2">
            <label htmlFor="email" className="text-sm font-normal">
              Email
            </label>
            <Input placeholder="Email" id="email" autoComplete="email" type="email" {...register('email')} />
            {errors.email && <p className="text-red-600 text-xs text-[10px]">{errors.email.message}</p>}
          </div>
          <div className="mb-2">
            <label htmlFor="password" className="text-sm font-normal">
              Password
            </label>
            <Input placeholder="Password" id="password" autoComplete="password" type="password" {...register('password')} />
            {errors.password && <p className="text-red-600 text-xs text-[10px]">{errors.password.message}</p>}
          </div>

          <div className="mb-4">
            <div className="text-xs font-normal text-gray-7 select-none">
              Forgot password?&nbsp;
              <p className="inline-flex text-black font-semibold cursor-pointer" onClick={() => onAuthStateChange(AuthState.ForgotPassword)}>
                Reset Now
              </p>
            </div>
          </div>

          <div>
            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              Submit{isLoading ? '....' : ''}
            </Button>
          </div>
          <div className="mt-5 text-center">
            <div className="text-xs font-normal text-gray-7">
              Don't have an account?&nbsp;
              <p className="inline-flex text-black font-semibold cursor-pointer" onClick={() => onAuthStateChange(AuthState.SignUp)}>
                Create Now
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
