import React, { useEffect, useState } from 'react';
import { API } from 'aws-amplify';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Share2Icon, Trash2Icon } from 'lucide-react';
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';

import shareMeetings from '../../graphql/queries/shareMeetings';
import deleteMeetings from '../../graphql/queries/deleteMeetings';
import { useHistory, useParams } from 'react-router-dom';
import { getCurrentRecipientsDescription, parseSharedWith } from './helpers';
import { ShowCurrentRecipients, ShowNewRecipients } from './meeting-controls-components';

const deleteConsentText = 'confirm';

const getListKeys = (callId, createdAt) => {
  const SHARDS_IN_DAY = 6;
  const SHARD_DIVIDER = 24 / SHARDS_IN_DAY;

  const now = new Date(createdAt);
  const date = now.toISOString().substring(0, 10);
  const hour = now.getUTCHours();

  const hourShard = Math.floor(hour / SHARD_DIVIDER);
  const shardPad = hourShard.toString().padStart(2, '0');

  const listPK = `cls#${date}#s#${shardPad}`;
  const listSK = `ts#${createdAt}#id#${callId}`;

  return { listPK, listSK };
};

const callsWithKeys = (props) => {
  const { calls } = props;
  const callsKeys = props.selectedItems.map(({ callId }) => {
    const call = calls.find((c) => c.CallId === callId);

    let listPK = call.ListPK;
    let listSK = call.ListSK;

    if (!listPK || !listSK) {
      const result = getListKeys(call.CallId, call.CreatedAt);
      listPK = result.listPK;
      listSK = result.listSK;
    }
    return {
      ListPK: listPK,
      ListSK: listSK,
      CallId: call.CallId,
    };
  });
  return callsKeys;
};

const invokeShareMeetings = async (props, currentRecipients) => {
  const callsKeys = callsWithKeys(props);
  const response = await API.graphql({
    query: shareMeetings,
    variables: {
      input: { Calls: callsKeys, MeetingRecipients: currentRecipients },
    },
  });

  const result = response.data.shareMeetings.Result;
  return result;
};

const invokeDeleteMeetings = async (props) => {
  const callsKeys = callsWithKeys(props);
  const response = await API.graphql({
    query: deleteMeetings,
    variables: {
      input: { Calls: callsKeys },
    },
  });

  const result = response.data.deleteMeetings.Result;
  return result;
};

export const ShareModal = (props) => {
  const { getCallDetailsFromCallIds } = props;

  const [share, setShare] = useState(false);
  const [currentRecipients, setCurrentRecipients] = useState([]);
  const [newRecipients, setNewRecipients] = useState([]);
  const [addRecipients, setAddRecipients] = useState('');
  const [changed, setChanged] = useState(false);
  const [originalCount, setOriginalCount] = useState(0);
  const [submit, setSubmit] = useState(false);
  const [shareResult, setShareResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalContent = props.selectedItems.length === 1 ? `"${props.selectedItems[0].callId}"` : `${props.selectedItems.length} meetings`;
  const currentRecipientsDescription = getCurrentRecipientsDescription(props.selectedItems);

  const openShareSettings = async () => {
    setShare(true);
    setIsLoading(true);

    const callDetails = await getCallDetailsFromCallIds(props.selectedItems.map((c) => c.callId));

    const recipients = new Set();
    callDetails.forEach((call) => {
      const sharedWithArray = parseSharedWith(call.SharedWith);
      sharedWithArray.forEach((email) => recipients.add(email));
    });

    const recipientList = Array.from(recipients).map((email) => email);
    setCurrentRecipients(recipientList);
    setIsLoading(false);
    setChanged(false);
    setOriginalCount(recipientList.length);
  };

  const closeShareSettings = () => {
    setShare(false);
    setCurrentRecipients([]);
    setAddRecipients('');
    setShareResult(null);
  };

  const handleAddRecipients = () => {
    if (!addRecipients.trim()) {
      return;
    }

    const emailList = addRecipients.split(',').map((email) => email.trim());
    const validEmails = emailList.filter((email) => {
      // Basic email validation regex
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email) && !currentRecipients.includes(email) && !newRecipients.includes(email);
    });
    setNewRecipients([...newRecipients, ...validEmails]);
    setAddRecipients('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShareResult(null);
    setSubmit(true);

    try {
      // merge current and new recipients
      const allRecipients = [...new Set([...currentRecipients, ...newRecipients])];
      const result = await invokeShareMeetings(props, allRecipients.join(','));
      setCurrentRecipients([]);
      setNewRecipients([]);
      setShareResult(result);
      await openShareSettings();
    } catch (error) {
      console.log('');
    }

    setSubmit(false);
  };

  return (
    <>
      {props.title ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={openShareSettings}
          disabled={props.selectedItems.length === 0 || props.loading}
          className="text-xs leading-none h-7 gap-1 px-2 text-gray-700"
        >
          <Share2Icon /> {props.title || null}
        </Button>
      ) : (
        <Button variant="outline" size="icon" onClick={openShareSettings} disabled={props.selectedItems.length === 0 || props.loading}>
          <Share2Icon />
        </Button>
      )}

      <Dialog open={share} onOpenChange={(openStatus) => !openStatus && closeShareSettings()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-lg mb-4">Share {modalContent}</DialogTitle>
            <DialogDescription>
              <div className="border border-gray-3 rounded-lg px-4 py-3 mb-3">
                <h3 className="text-base font-bold text-black">Add Users</h3>
                <h4 className="text-xs text-gray-6">Enter a comma-separated list of email addresses and choose Add.</h4>
                <div className="border-b border-gray-3 my-3" />
                <div className="mb-2">
                  <div className="flex gap-2">
                    <Input
                      value={addRecipients}
                      onChange={(event) => {
                        setChanged(true);
                        setAddRecipients(event.target.value);
                        setShareResult(null);
                      }}
                      placeholder="Enter email addresses"
                    />
                    <Button onClick={handleAddRecipients}>Add</Button>
                  </div>
                </div>
                <ShowNewRecipients newRecipients={newRecipients} setNewRecipients={setNewRecipients} />
              </div>
              <div className="border border-gray-3 rounded-lg px-4 py-3">
                <h3 className="text-base font-bold text-black">Existing Users</h3>
                <h4 className="text-xs text-gray-6">{currentRecipientsDescription}</h4>
                <div className="border-b border-gray-3 my-3" />
                <ShowCurrentRecipients
                  currentRecipients={currentRecipients}
                  originalCount={originalCount}
                  setCurrentRecipients={setCurrentRecipients}
                  setChanged={setChanged}
                  setShareResult={setShareResult}
                />
              </div>
              <div>
                {shareResult ? (
                  <Alert className="mt-2 border-cyan-500" variant="default">
                    <AlertTitle className="text-base text-cyan-900">Message</AlertTitle>
                    <AlertDescription className="text-sm text-cyan-800">{shareResult}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    type="button"
                    className="ring-red-600 text-red-600 hover:bg-red-50"
                    onClick={closeShareSettings}
                    disabled={isLoading}
                  >
                    Close
                  </Button>
                  <Button
                    variant="outline"
                    disabled={
                      isLoading || submit || !changed || (currentRecipients.length === 0 && originalCount === 0 && newRecipients.length === 0)
                    }
                    onClick={handleSubmit}
                  >
                    Submit {submit || isLoading ? '...' : ''}
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const DeleteModal = (props) => {
  const [visible, setVisible] = useState(false);
  const [deleteDisabled, setDeleteDisabled] = useState(false);
  const [deleteResult, setDeleteResult] = useState(null);
  const [deletedCallIds, setDeletedCallIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const history = useHistory();
  const { callId } = useParams();

  const modalContent = props.selectedItems.length === 1 ? `"${props.selectedItems[0].callId}"` : `${props.selectedItems.length} meetings`;

  const [deleteInputText, setDeleteInputText] = useState('');
  const inputMatchesConsentText = deleteInputText.toLowerCase() === deleteConsentText;

  useEffect(() => {
    setDeleteInputText('');
  }, [visible]);

  const openDeleteSettings = async () => {
    setVisible(true);
    setDeleteResult(null);
    setDeletedCallIds([]);
  };

  const closeDeleteSettings = () => {
    setDeleteDisabled(false);
    setVisible(false);
    setDeleteResult(null);
    setDeletedCallIds([]);
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    setDeleteDisabled(true);
    setIsLoading(true);
    setDeletedCallIds(props.selectedItems.map((c) => c.callId));

    try {
      const result = await invokeDeleteMeetings(props);
      setDeleteResult(result);
      if (callId) {
        history.goBack();
      }
    } catch (error) {
      console.log('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubmit = (event) => {
    event.preventDefault();
    if (inputMatchesConsentText) {
      handleDelete(event);
    }
  };

  return (
    <div>
      {props.title ? (
        <Button
          size="sm"
          variant="ghost"
          onClick={openDeleteSettings}
          disabled={props.selectedItems.length === 0 || props.loading}
          className="text-xs leading-none h-7 gap-1 px-2 text-gray-700"
        >
          <Trash2Icon /> {props.title || null}
        </Button>
      ) : (
        <Button variant="outline" size="icon" onClick={openDeleteSettings} disabled={props.selectedItems.length === 0 || props.loading}>
          <Trash2Icon />
        </Button>
      )}

      {props.selectedItems.length > 0 ? (
        <Dialog open={visible} onOpenChange={(openStatus) => !openStatus && closeDeleteSettings()}>
          <DialogContent className="gap-3">
            <DialogHeader className="border-b border-gray-3">
              <DialogTitle className="text-lg mb-2">Delete {modalContent}</DialogTitle>
            </DialogHeader>
            <div>
              <p className="text-sm text-black mb-2">
                {props.selectedItems.length > 1 ? (
                  <>
                    Permanently delete <span className="font-bold">{props.selectedItems.length} meetings</span>? You can't undo this action.
                  </>
                ) : (
                  <>
                    Permanently delete meeting <span className="font-bold">{props.selectedItems[0].callId}</span>? You can't undo this action.
                  </>
                )}
              </p>
              <Alert variant="default" className="mb-3 border-yellow-800 bg-yellow-50">
                <AlertDescription className="text-sm text-cyan-800">
                  Proceeding with this action will delete the
                  {props.selectedItems.length > 1 ? ' meetings with all their content. ' : ' meeting with all its content.'}{' '}
                </AlertDescription>
              </Alert>
              <p className="text-sm text-gray-6 mb-3">To avoid accidental deletions, we ask you to provide additional written consent.</p>
              <form onSubmit={handleDeleteSubmit}>
                <p className="text-sm mb-1">To confirm this deletion, type "{deleteConsentText}".</p>
                <Input placeholder={deleteConsentText} onChange={(event) => setDeleteInputText(event.target.value)} value={deleteInputText} />
              </form>

              <div>
                {deleteResult ? (
                  <Alert className="mt-2 border-cyan-500" variant="default">
                    <AlertTitle className="text-base text-cyan-900">Message</AlertTitle>
                    <AlertDescription className="text-sm text-cyan-800">{deleteResult}</AlertDescription>
                  </Alert>
                ) : null}

                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="outline" type="button" className="ring-red-600 text-red-600 hover:bg-red-50" onClick={closeDeleteSettings}>
                    Close
                  </Button>
                  <Button variant="outline" disabled={!inputMatchesConsentText || deleteDisabled} onClick={handleDelete}>
                    Delete{isLoading ? '...' : ''}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Dialog open={visible} onOpenChange={(openStatus) => !openStatus && closeDeleteSettings()}>
          <DialogContent className="gap-3">
            <DialogHeader className="border-b border-gray-3">
              <DialogTitle className="text-lg mb-2">
                Delete {deletedCallIds.length === 1 ? `"${deletedCallIds[0]}"` : `${deletedCallIds.length} meetings`}
              </DialogTitle>
            </DialogHeader>
            <div>
              {deleteResult ? (
                <Alert className="mt-2 border-cyan-500" variant="default">
                  <AlertTitle className="text-base text-cyan-900">Message</AlertTitle>
                  <AlertDescription className="text-sm text-cyan-800">{deleteResult}</AlertDescription>
                </Alert>
              ) : null}

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" type="button" className="ring-red-600 text-red-600 hover:bg-red-50" onClick={closeDeleteSettings}>
                  Close
                </Button>
                <Button variant="outline" disabled={!inputMatchesConsentText || deleteDisabled} onClick={handleDelete}>
                  Delete{isLoading ? '...' : ''}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};
