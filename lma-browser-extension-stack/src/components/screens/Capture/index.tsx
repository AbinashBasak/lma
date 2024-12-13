import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList } from 'components/ui/tabs';
import MeetingDetailsTab from './MeetingDetailsTab';
import Footer from './Footer';
import Transcript from './Transcript';
import MeetingNote from './MeetingNote';
import { Captions, Headset, NotebookPen } from 'lucide-react';
import TabsTrigger from './TabsTrigger';
import Header from './Header';

function Capture() {
    useEffect(() => {
        if (chrome && chrome.runtime) {
            chrome.runtime.getManifest();
        }
    }, []);

    return (
        <div className="h-full">
            <div className="h-[80vh] min-h-[365px] flex flex-col">
                <Header />
                <div className="bg-slate-900 flex-1">
                    <Tabs defaultValue="MeetingDetails" className="w-full h-full flex flex-row">
                        <TabsList className="flex-col justify-start gap-2 h-full w-10 rounded-none bg-slate-700 pt-4">
                            <TabsTrigger icon={<Headset size={20} />} tableName="MeetingDetails" title="Meeting Details" />
                            <TabsTrigger icon={<Captions size={20} />} tableName="transcript" title="Transcript" />
                            <TabsTrigger icon={<NotebookPen size={20} />} tableName="note" title="Note" />
                        </TabsList>
                        <TabsContent value="MeetingDetails" className="mt-0 flex-1 hidden data-[state=active]:block" forceMount>
                            <MeetingDetailsTab />
                        </TabsContent>
                        <TabsContent value="transcript" className="mt-0 flex-1 hidden data-[state=active]:block" forceMount>
                            <Transcript />
                        </TabsContent>
                        <TabsContent value="note" className="mt-0 flex-1 hidden data-[state=active]:block" forceMount>
                            <MeetingNote />
                        </TabsContent>
                    </Tabs>
                </div>
                <Footer />
            </div>
        </div>
    );
}

export default Capture;
