import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useAuthContainerContext } from './AuthContainer';
import { AuthState, Translations } from '@aws-amplify/ui-components';
import { toast } from 'components/ui/use-toast';
import { handleSignIn } from './auth-helpers';

export default function AmplifySignUpConfirm() {
  const { onAuthStateChange, authData } = useAuthContainerContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const onResendConfirmCode = async () => {
    if (isLoading) {
      return;
    }
    if (!Auth || typeof Auth.resendSignUp !== 'function') {
      return;
    }

    try {
      const username = authData?.username;
      if (!username) {
        return;
      }

      setIsLoading(true);
      await Auth.resendSignUp(username.trim());
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

  const onConfirmSignUp = async () => {
    if (code.trim() === '') {
      return;
    }
    if (!Auth || typeof Auth.confirmSignUp !== 'function') {
      return;
    }

    setIsLoading(true);

    try {
      let username = authData?.username;
      if (!username) {
        return;
      }
      username = username.trim();

      const confirmSignUpResult = await Auth.confirmSignUp(username, code);

      if (!confirmSignUpResult) {
        throw new Error(Translations.CONFIRM_SIGN_UP_FAILED);
      }
      if (authData?.signUpAttrs?.password && authData.signUpAttrs.password !== '') {
        // Auto sign in user if password is available from previous workflow
        await handleSignIn(username, authData.signUpAttrs.password, (nextAuthState, data) => {
          onAuthStateChange(nextAuthState, data as any);
        });
      } else {
        onAuthStateChange(AuthState.SignIn);
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
        <h1 className="text-lg text-center font-semibold">Confirm Sign up</h1>

        <div className="mb-2">
          <label htmlFor="email" className="text-sm font-normal">
            Email
          </label>
          <Input placeholder="Email" id="email" value={authData?.username || ''} disabled />
        </div>
        <div className="mb-2">
          <label htmlFor="confirmationCode" className="text-sm font-normal">
            Confirmation Code
          </label>
          <Input placeholder="Confirmation Code" id="confirmationCode" value={code} onChange={(e) => setCode(e.target.value)} />
        </div>
        <div className="mb-4">
          <div className="text-xs font-normal text-gray-7 select-none">
            Don't get Code?
            <p className="inline-flex text-black font-semibold cursor-pointer" onClick={onResendConfirmCode}>
              Resend Code
            </p>
          </div>
        </div>

        <div>
          <Button type="submit" size="lg" className="w-full" disabled={isLoading || code.trim() === ''} onClick={onConfirmSignUp}>
            Confirm{isLoading ? '...' : ''}
          </Button>
        </div>
        <div className="mt-5 text-center">
          <div className="text-xs font-normal text-gray-7 select-none">
            Back to&nbsp;
            <p className="inline-flex text-black font-semibold cursor-pointer" onClick={() => onAuthStateChange(AuthState.SignIn)}>
              Sign In
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
