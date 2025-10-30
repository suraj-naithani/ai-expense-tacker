"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"
import Sidebar from "../../components/sidebar"
import Navbar from "@/components/navbar"

interface LayoutProps {
    children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
    const [mounted, setMounted] = useState(false)
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    useEffect(() => {
        const isLargeScreen = window.innerWidth >= 1024
        setIsSidebarOpen(isLargeScreen)
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    return (
        <div className="flex h-screen">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            <div className="w-full flex flex-1 flex-col">
                <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23]">
                    <Navbar setIsSidebarOpen={setIsSidebarOpen} />
                </header>
                <main className="flex-1 overflow-auto p-3 sm:p-6 bg-[--background]">{children}</main>
            </div>
        </div>
    )
}
