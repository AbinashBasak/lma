import React from 'react';
import { Button } from './ui/button';

type Props = {
  isActive: boolean;
  title: string;
  onClick: (key: string) => void;
  updateKey: string;
};

export default function OptionBadge({ isActive, onClick, title, updateKey }: Props) {
  return (
    <Button variant={isActive ? 'default' : 'outline'} onClick={() => onClick(updateKey)}>
      {title}
    </Button>
  );
}
