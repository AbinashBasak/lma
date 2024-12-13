import React from 'react';
import { TabsTrigger as CNTabsTrigger } from 'components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from 'components/ui/tooltip';

type Props = {
    icon: any;
    title: string;
    tableName: string;
};

export default function TabsTrigger({ icon, title, tableName }: Props) {
    return (
        <CNTabsTrigger
            className="w-9 hover:bg-slate-800 data-[state=active]:bg-slate-800 data-[state=active]:text-white text-slate-300 rounded-sm"
            value={tableName}
        >
            <Tooltip>
                <TooltipTrigger asChild>
                    <div className="py-2">{icon}</div>
                </TooltipTrigger>
                <TooltipContent>{title}</TooltipContent>
            </Tooltip>
        </CNTabsTrigger>
    );
}
