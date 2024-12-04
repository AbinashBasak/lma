import { XIcon } from 'lucide-react';

interface IShowCurrentRecipients {
  currentRecipients: string[];
  originalCount: number;
  setCurrentRecipients: React.Dispatch<React.SetStateAction<string[]>>;
  setChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setShareResult: React.Dispatch<React.SetStateAction<any>>;
}
interface IShowNewRecipients {
  newRecipients: string[];
  setNewRecipients: React.Dispatch<React.SetStateAction<string[]>>;
}
interface ITokenBadge {
  title: string;
  onClose: () => void;
}

const TokenBadge = ({ title, onClose }: ITokenBadge) => {
  return (
    <div className="flex items-center gap-2 border border-indigo-600 rounded-md p-1 pl-2">
      <p className="text-xs flex-1">{title}</p>
      <div className="text-xs cursor-pointer h-5 w-5 flex justify-center items-center" onClick={onClose}>
        <XIcon size={16} fontSize={10} className="text-xs" />
      </div>
    </div>
  );
};

export const ShowCurrentRecipients = ({
  currentRecipients,
  originalCount,
  setCurrentRecipients,
  setChanged,
  setShareResult,
}: IShowCurrentRecipients) => {
  if (currentRecipients.length === 0) {
    const placeholder = originalCount === 0 ? 'None' : 'You have removed all current users';
    return (
      <div>
        <div>{placeholder}</div>
      </div>
    );
  }

  const handleUnSelect = (itemIndex: number) => {
    const updatedRecipients = currentRecipients.filter((_, index) => index !== itemIndex);
    setCurrentRecipients(updatedRecipients);
    setChanged(currentRecipients.length !== 0);
    setShareResult(null);
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {currentRecipients.map((currentRecipient, index) => (
          <TokenBadge title={currentRecipient} key={currentRecipient} onClose={() => handleUnSelect(index)} />
        ))}
      </div>
    </div>
  );
};

export const ShowNewRecipients = ({ newRecipients, setNewRecipients }: IShowNewRecipients) => {
  const handleUnSelect = (itemIndex: number) => {
    const updatedRecipients = newRecipients.filter((_, index) => index !== itemIndex);
    setNewRecipients(updatedRecipients);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {newRecipients.map((newRecipient, index) => (
        <TokenBadge title={newRecipient} key={newRecipient} onClose={() => handleUnSelect(index)} />
      ))}
    </div>
  );
};
