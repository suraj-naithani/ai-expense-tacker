"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Moon, PanelLeft, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import { useState } from "react"
import Profile from "./profile"
import { Button } from "./ui/button"

interface NavbarProps {
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({ setIsSidebarOpen }: NavbarProps) {
    const { theme, setTheme } = useTheme();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [notifications, setNotifications] = useState(5)

    return (
        <nav className="px-3 sm:px-6 flex items-center justify-between bg-[--background] border-b border-gray-200 dark:border-[#1F1F23] h-full">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    className="p-2 rounded-lg bg-[--background]"
                    onClick={() => setIsSidebarOpen((prev) => !prev)}
                >
                    <PanelLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>

                <h1 className="text-l font-semibold">Expense Tracker</h1>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
                <Button variant="ghost" size="icon" className="rounded-2xl relative">
                    <Bell className="h-5 w-5" />
                    {notifications > 0 && (
                        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                            {notifications}
                        </span>
                    )}
                </Button>

                <Button variant="ghost" size="icon" className="rounded-full cursor-pointer" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger className="focus:outline-none">
                        <Image
                            src="/avatar.png"
                            alt="User avatar"
                            width={25}
                            height={25}
                            className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-8 sm:h-8 cursor-pointer"
                        />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        sideOffset={8}
                        className="w-[280px] sm:w-80 !bg-[--card] border-border rounded-lg shadow-lg"
                    >
                        <Profile avatar="/avatar.png" />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </nav>
    )
}
