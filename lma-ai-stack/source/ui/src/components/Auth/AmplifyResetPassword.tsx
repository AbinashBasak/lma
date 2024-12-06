import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Auth } from 'aws-amplify';
import { useState } from 'react';
import { useAuthContainerContext } from './AuthContainer';
import { AuthState } from '@aws-amplify/ui-components';
import { toast } from 'components/ui/use-toast';

export default function AmplifyResetPassword() {
  const { onAuthStateChange } = useAuthContainerContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showEmailForm, setShowEmailForm] = useState<boolean>(true);
  const [email, setEmail] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const onEmailSend = async () => {
    if (email.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please provide email',
        variant: 'destructive',
      });
      return;
    }

    if (!Auth || typeof Auth.forgotPassword !== 'function') {
      return;
    }
    setIsLoading(true);

    try {
      const data = await Auth.forgotPassword(email.trim());

      if (data.CodeDeliveryDetails) {
        setShowEmailForm(false);
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

  const onPasswordSubmit = async () => {
    if (code.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please provide code',
        variant: 'destructive',
      });
      return;
    }
    if (password.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please provide password',
        variant: 'destructive',
      });
      return;
    }

    if (!Auth || typeof Auth.forgotPasswordSubmit !== 'function') {
      return;
    }

    setIsLoading(true);
    try {
      await Auth.forgotPasswordSubmit(email.trim(), code, password);

      onAuthStateChange(AuthState.SignIn);
      setShowEmailForm(false);
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
        <h1 className="text-lg text-center font-semibold mb-8">Reset your password</h1>

        {showEmailForm ? (
          <div>
            <div className="mb-2">
              <label htmlFor="email" className="text-sm font-normal">
                Email
              </label>
              <Input placeholder="Enter Email" required id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div className="flex gap-2 justify-between mt-8">
              <Button variant="ghost" onClick={() => onAuthStateChange(AuthState.SignIn)}>
                Back to Sign In
              </Button>
              <Button type="submit" disabled={isLoading || email.trim() === ''} onClick={onEmailSend}>
                Send{isLoading ? '...' : ''}
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-2">
              <label htmlFor="code" className="text-sm font-normal">
                Verification Code
              </label>
              <Input placeholder="Enter code" id="code" required value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="mb-2">
              <label htmlFor="password" className="text-sm font-normal">
                New Password
              </label>
              <Input
                placeholder="Enter new password"
                id="password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex gap-2 justify-between mt-8">
              <Button variant="ghost" onClick={() => onAuthStateChange(AuthState.SignIn)}>
                Back to Sign In
              </Button>
              <Button type="submit" disabled={isLoading || email.trim() === ''} onClick={onPasswordSubmit}>
                Submit{isLoading ? '...' : ''}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
