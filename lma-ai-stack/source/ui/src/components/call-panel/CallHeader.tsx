import React from 'react';
import { Avatar, AvatarFallback } from 'components/ui/avatar';
import { ICallDetails } from 'components/call-list/types';
import moment from 'moment';
import { Button } from 'components/ui/button';
import { FileTextIcon, FileUpIcon, MailIcon } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from 'components/ui/dropdown-menu';
import { PiMicrosoftExcelLogo } from 'react-icons/pi';
import { FaRegFilePdf } from 'react-icons/fa6';
import {
  handleExportSummaryToPDF,
  handleExportSummaryToTXT,
  handleExportTranscriptToExcel,
  handleExportTranscriptToTXT,
  sendToEmail,
} from './_helpers';
import useCallsContext from 'contexts/calls';
import { shareModal, deleteModal } from 'components/common/meeting-controls';

interface ICallHeader {
  data: ICallDetails;
  callTranscriptPerCallId: any;
  getCallDetailsFromCallIds: any;
}

const CallHeader = ({ data, callTranscriptPerCallId, getCallDetailsFromCallIds }: ICallHeader) => {
  const createdDate = moment(data.initiationTimeStamp);
  const updatedAt = moment(data.updatedAt);

  const { calls } = useCallsContext() as any;
  const props = {
    calls,
    selectedItems: [data],
    loading: false,
    title: 'Share',
    getCallDetailsFromCallIds,
  };

  return (
    <div className="flex flex-row gap-2 justify-between pb-4 border-b mb-4 sticky top-12 bg-white z-9">
      <div className="flex flex-row gap-2">
        <Avatar>
          <AvatarFallback className="uppercase">{data?.agentId?.[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base">{data.owner}</p>
          <div>
            <p className="text-xs">
              {[
                data.initiationTimeStamp && createdDate.isValid() ? createdDate.format('DD/MM/YYYY, hh:mm') : null,
                data.conversationDurationInHumanReadableFormat,
                data.updatedAt && updatedAt.isValid() ? `Last updated ${updatedAt.fromNow()}` : null,
              ]
                .filter(Boolean)
                .join(', ')}
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-row flex-wrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="text-xs leading-none h-7 gap-1 px-2 text-gray-700">
              <FileUpIcon /> Exports
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => handleExportSummaryToTXT(data)}>
                <FileTextIcon /> Export Summary to TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportSummaryToPDF(data)}>
                <FaRegFilePdf className="ml-[2px]" />
                Export Summary to PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportTranscriptToTXT(callTranscriptPerCallId, data)}>
                <FileTextIcon />
                Export Transcript to TXT
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportTranscriptToExcel(callTranscriptPerCallId, data)}>
                <PiMicrosoftExcelLogo />
                Export Transcript to Excel
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" variant="ghost" className="text-xs leading-none h-7 gap-1 px-2 text-gray-700" onClick={() => sendToEmail(data)}>
          <MailIcon /> Email
        </Button>
        {shareModal(props)}
        {deleteModal(props)}
      </div>
    </div>
  );
};

export default CallHeader;
