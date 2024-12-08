import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';
import OptionBadge from 'components/OptionBadge';
import axios from 'axios';
import useAppContext from 'contexts/app';
import { Button } from 'components/ui/button';

export default function UserForm() {
  const { user } = useAppContext();
  const [selectedDepartment, setSelectedDepartment] = useState<{ [key: string]: boolean }>({});
  const [selectedRole, setSelectedRole] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const submitDisable = Object.keys(selectedDepartment).length === 0 || selectedRole === '' || isLoading;

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const res = await axios.get('http://localhost:3001/user/user-details', {
          headers: {
            Authorization: `Bearer ${user.signInUserSession.accessToken.jwtToken}`,
          },
        });
        if (!res?.data?.department) {
          setShowDialog(true);
        }
      } catch (error) {
        //
      }
    };

    getUserDetails();
  }, []);

  const onSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axios
        .post(
          'http://localhost:3001/user/user-details',
          {
            department: Object.keys(selectedDepartment),
            role: selectedRole,
          },
          {
            headers: {
              Authorization: `Bearer ${user.signInUserSession.accessToken.jwtToken}`,
            },
          },
        )
        .catch((res) => res.response);

      if (res.status === 201) {
        setShowDialog(false);
      } else if (res.status === 401) {
        window.location.reload();
      }
    } catch (error) {
      //
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (valueKey: string) => {
    setSelectedDepartment({ [valueKey]: true });
  };

  return (
    <Dialog open={showDialog}>
      <DialogContent className="sm:max-w-[500px]" showCloseBtn={false}>
        <DialogHeader>
          <DialogTitle className="text-3xl">Lets get's to know you</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="mb-6">
            <p className="text-lg mb-3">In which department do you work?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <OptionBadge
                isActive={selectedDepartment['Customer Support']}
                onClick={handleClick}
                title="Customer Support"
                updateKey="Customer Support"
              />
              <OptionBadge isActive={selectedDepartment['HR/People']} onClick={handleClick} title="HR/People" updateKey="HR/People" />
              <OptionBadge isActive={selectedDepartment['Marketing']} onClick={handleClick} title="Marketing" updateKey="Marketing" />
              <OptionBadge
                isActive={selectedDepartment['Product/Engineering']}
                onClick={handleClick}
                title="Product/Engineering"
                updateKey="Product/Engineering"
              />
              <OptionBadge isActive={selectedDepartment['IT']} onClick={handleClick} title="IT" updateKey="IT" />
              <OptionBadge isActive={selectedDepartment['Operations']} onClick={handleClick} title="Operations" updateKey="Operations" />
              <OptionBadge isActive={selectedDepartment['Research']} onClick={handleClick} title="Research" updateKey="Research" />
              <OptionBadge isActive={selectedDepartment['Sales']} onClick={handleClick} title="Sales" updateKey="Sales" />
              <OptionBadge isActive={selectedDepartment['Other']} onClick={handleClick} title="Other" updateKey="Other" />
            </div>
          </div>
          <div className="mb-10">
            <p className="text-lg mb-3">What is your role?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <OptionBadge isActive={selectedRole === 'Senior Leader'} onClick={setSelectedRole} title="Senior Leader" updateKey="Senior Leader" />
              <OptionBadge isActive={selectedRole === 'Manager'} onClick={setSelectedRole} title="Manager" updateKey="Manager" />
              <OptionBadge
                isActive={selectedRole === 'Individual Contributor'}
                onClick={setSelectedRole}
                title="Individual Contributor"
                updateKey="Individual Contributor"
              />
            </div>
          </div>
          <div className="flex justify-center">
            <Button variant="default" className="h-11 w-36" disabled={submitDisable} onClick={onSubmit}>
              Submit{isLoading ? '...' : ''}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
