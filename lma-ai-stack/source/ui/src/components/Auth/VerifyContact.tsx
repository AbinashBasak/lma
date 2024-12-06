import React, { useState } from 'react';
import { useAuthContainerContext } from './AuthContainer';
import { Auth } from 'aws-amplify';
import { AuthState } from '@aws-amplify/ui-components';
import { Button } from 'components/ui/button';
import useAppContext from 'contexts/app';
import { Input } from 'components/ui/input';
import { toast } from 'components/ui/use-toast';

export default function VerifyContact() {
  const { authData, onAuthStateChange } = useAuthContainerContext();
  const { setAuthState, setUser } = useAppContext() as any;
  const [showCodeForm, setShowCodeForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [code, setCode] = useState<string>('');

  const onSubmit = async () => {
    if (!Auth || typeof Auth.verifyCurrentUserAttributeSubmit !== 'function') {
      return;
    }

    if (code.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please provide verification code.',
        variant: 'destructive',
      });
    }

    setIsLoading(true);
    try {
      await Auth.verifyCurrentUserAttributeSubmit('email', code);
      onAuthStateChange(AuthState.SignedIn, authData);
      setShowCodeForm(false);
      setAuthState(AuthState.SignedIn);
      setUser(authData);
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

  const onVerify = async () => {
    if (!Auth || typeof Auth.verifyCurrentUserAttribute !== 'function') {
      return;
    }

    setIsLoading(true);
    try {
      await Auth.verifyCurrentUserAttribute('email');
      setShowCodeForm(true);
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

  const handleSkip = () => {
    setAuthState(AuthState.SignedIn);
    setUser(authData);
  };

  return (
    <div className="min-h-screen h-full flex justify-center items-center">
      <div className="py-10 px-6 shadow-card-4 border border-gray-3 rounded-2xl min-w-96">
        <h2 className="text-base text-center mb-4">Please verify you email.</h2>
        {showCodeForm ? (
          <div>
            <div>
              <label htmlFor="code" className="text-sm font-normal">
                Code
              </label>
              <Input placeholder="Code" id="code" value={code} onChange={(e) => setCode(e.target.value)} />
            </div>
            <div className="flex justify-end mt-2">
              <Button disabled={isLoading} onClick={onSubmit}>
                Submit{isLoading ? '...' : ''}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-2">
            <Button variant="outline" onClick={handleSkip}>
              Skip
            </Button>
            <Button disabled={isLoading} onClick={onVerify}>
              Verify{isLoading ? '...' : ''}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
