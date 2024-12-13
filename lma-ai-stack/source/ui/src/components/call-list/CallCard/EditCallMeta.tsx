import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { Button } from 'components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'components/ui/dialog';
import { Input } from 'components/ui/input';
import { toast } from 'components/ui/use-toast';
import { API_ENDPOINT } from 'constant';
import useAppContext from 'contexts/app';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

interface IEditCallMeta {
  callId: string;
  userName?: string | null;
  meetingTopic?: string | null;
  show: boolean;
  onClose: () => void;
  setIsCallsListLoading: (isLoading: boolean) => void;
}

const schema = yup.object().shape({
  userName: yup.string().required('Username is required').min(1),
  meetingTopic: yup.string().required('Meeting topic is required').min(1),
});
type IForm = yup.InferType<typeof schema>;

export function EditCallMeta({ callId, meetingTopic, userName, show, onClose, setIsCallsListLoading }: IEditCallMeta) {
  const { user } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { userName: '', meetingTopic: '' },
  });

  useEffect(() => {
    if (show) {
      setValue('meetingTopic', meetingTopic || '');
      setValue('userName', userName || '');
      return;
    }

    setValue('meetingTopic', '');
    setValue('userName', '');
  }, [show, meetingTopic, userName]);

  const onSubmit = async (data: IForm) => {
    setIsLoading(true);
    try {
      const res = await axios.put(
        `${API_ENDPOINT}/call/${callId}`,
        {
          callId,
          ...data,
        },
        {
          headers: {
            Authorization: `Bearer ${user.signInUserSession.accessToken.jwtToken}`,
          },
        },
      );
      if (res.status === 200) {
        toast({
          title: 'Status',
          description: 'Update successfully',
          variant: 'default',
        });
        setIsCallsListLoading(true);
        onClose();
      } else {
        toast({
          title: 'Error',
          description: 'Something went wrong',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={show} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Meeting</DialogTitle>
          </DialogHeader>
          <div className="mt-5">
            <div className="mb-2">
              <label htmlFor="userName" className="text-sm font-normal">
                User Name
              </label>
              <Input placeholder="UserName" id="userName" {...register('userName')} />
              {errors.userName && <p className="text-red-600 text-xs text-[10px]">{errors.userName.message}</p>}
            </div>
            <div className="mb-4">
              <label htmlFor="meetingTopic" className="text-sm font-normal">
                Meeting Topic
              </label>
              <Input placeholder="Meeting Topic" id="meetingTopic" {...register('meetingTopic')} />
              {errors.meetingTopic && <p className="text-red-600 text-xs text-[10px]">{errors.meetingTopic.message}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              Save changes{isLoading ? '...' : ''}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
