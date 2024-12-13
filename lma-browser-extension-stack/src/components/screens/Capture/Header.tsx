import React from 'react';
import { useUserContext } from 'context/UserContext';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from 'components/ui/dropdown-menu';
import { Button } from 'components/ui/button';
import { Menu } from 'lucide-react';

export default function Header() {
    const { logout } = useUserContext();

    return (
        <div className="bg-slate-800 px-4 py-4 flex justify-between">
            <h1 className="text-sm font-semibold text-gray-3">Leali Live Meeting Assistant</h1>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="bg-transparent border-slate-700 hover:bg-slate-700/50">
                        <Menu size={20} color="#ffffff" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-slate-700 border-slate-700 text-white">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>Go to Dashboard</DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-slate-800" />
                    <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
