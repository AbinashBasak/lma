'use client';

import * as React from 'react';
import { AudioWaveform, Command, GalleryVerticalEnd, LinkIcon, SquareTerminal } from 'lucide-react';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import { TeamSwitcher } from './team-switcher';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from 'components/ui/sidebar';
// import MeetingLimitButton from './MeetingLimitButton';
import useAppContext from 'contexts/app';
import { LMA_VERSION } from 'components/common/constants';

// This is sample data.
const data = {
  teams: [
    {
      name: 'Acme Inc',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'My Meetings',
      url: '/calls',
      icon: SquareTerminal,
    },
    {
      title: 'Stream Audio',
      url: '/stream',
      icon: SquareTerminal,
    },
    {
      title: 'Download extension',
      url: `/lma-chrome-extension-${LMA_VERSION}.zip`,
      icon: LinkIcon,
      external: true,
    },
    // {
    //   title: 'Settings',
    //   url: '#',
    //   icon: Settings2,
    //   items: [
    //     {
    //       title: 'General',
    //       url: '#',
    //     },
    //     {
    //       title: 'Team',
    //       url: '#',
    //     },
    //     {
    //       title: 'Billing',
    //       url: '#',
    //     },
    //     {
    //       title: 'Limits',
    //       url: '#',
    //     },
    //   ],
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppContext() as any;
  const userId = user?.attributes?.email || 'user';
  const userName = user?.username || 'User Name';

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        {/* <MeetingLimitButton /> */}
        <NavUser
          user={{
            name: userName,
            email: userId,
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
