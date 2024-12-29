'use client'

import React, {useEffect, useState} from 'react';
import {useTheme} from "next-themes";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {Button} from "@/components/ui/button";
import {MoonIcon, SunIcon, SunMoonIcon} from "lucide-react";

const ModeToggle = () => {
    const [mounted, setMounted] = useState(false);
    const {theme, setTheme} = useTheme()

    useEffect(() => {
        setMounted(true);
    }, [])

    if (!mounted) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant={'ghost'} className={'focus-visible:ring-0 focus-visible:ring-offset-0'}>
                    {theme === 'system'
                        ? <SunMoonIcon/>
                        : theme === 'dark'
                            ? <MoonIcon/>
                            : <SunIcon/>
                    }
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuCheckboxItem checked={theme === 'system'} onClick={() => setTheme('system')}>
                    system
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={theme === 'dark'} onClick={() => setTheme('dark')}>
                    dark
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked={theme === 'light'} onClick={() => setTheme('light')}>
                    light
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default ModeToggle;
