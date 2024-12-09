import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from 'components/ui/dialog';
import OptionBadge from 'components/OptionBadge';
import axios from 'axios';
import useAppContext from 'contexts/app';
import { Button } from 'components/ui/button';

const DEPARTMENTS = [
  {
    title: 'Customer Support',
    key: 'Customer.Support',
  },
  {
    title: 'HR/People',
    key: 'HR.People',
  },
  {
    title: 'Marketing',
    key: 'Marketing',
  },
  {
    title: 'Product/Engineering',
    key: 'Product.Engineering',
  },
  {
    title: 'IT',
    key: 'IT',
  },
  {
    title: 'Operations',
    key: 'Operations',
  },
  {
    title: 'Research',
    key: 'Research',
  },
  {
    title: 'Sales',
    key: 'Sales',
  },
  {
    title: 'Other',
    key: 'Other',
  },
];
const ROLES = [
  {
    title: 'Individual Contributor',
    key: 'Individual.Contributor',
  },
  {
    title: 'Junior',
    key: 'Junior',
  },
  {
    title: 'Associate',
    key: 'Associate',
  },
  {
    title: 'Mid-level',
    key: 'Mid.level',
  },
  {
    title: 'Senior',
    key: 'Senior',
  },
  {
    title: 'Lead',
    key: 'Lead',
  },
  {
    title: 'Manager',
    key: 'Manager',
  },
  {
    title: 'Director',
    key: 'Director',
  },
  {
    title: 'Executive',
    key: 'Executive',
  },
  {
    title: 'Other',
    key: 'Other',
  },
];

export default function UserForm() {
  const { user } = useAppContext();
  const [selectedDepartment, setSelectedDepartment] = useState<{ [key: string]: boolean }>({ Other: true });
  const [selectedRole, setSelectedRole] = useState('Other');
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
              {DEPARTMENTS.map((e) => (
                <OptionBadge key={e.key} isActive={selectedDepartment[e.key]} onClick={handleClick} title={e.title} updateKey={e.key} />
              ))}
            </div>
          </div>
          <div className="mb-10">
            <p className="text-lg mb-3">What is your role?</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROLES.map((role) => (
                <OptionBadge key={role.key} isActive={selectedRole === role.key} onClick={setSelectedRole} title={role.title} updateKey={role.key} />
              ))}
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
