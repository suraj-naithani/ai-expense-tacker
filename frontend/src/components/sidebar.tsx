"use client"

import {
    Calendar,
    CreditCard,
    HelpCircle,
    MessagesSquare,
    PieChart,
    Receipt,
    Settings,
    Shield,
    Users2,
    Video,
    Wallet,
    Wand2,
    X
} from "lucide-react"

import { Home } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"

export default function Sidebar({
    isOpen,
    setIsOpen
}: {
    isOpen: boolean
    setIsOpen: (open: boolean) => void
}) {
    function handleNavigation() {
        if (window.innerWidth < 1024) {
            setIsOpen(false)
        }
    }

    function NavItem({
        href,
        icon: Icon,
        children,
    }: {
        href: string
        icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
        children: React.ReactNode
    }) {
        return (
            <Link
                href={href}
                onClick={handleNavigation}
                className="flex items-center px-3 py-2 text-sm rounded-md transition-colors text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#1F1F23]"
            >
                <Icon className="h-4 w-4 mr-3 flex-shrink-0" />
                {children}
            </Link>
        )
    }

    return (
        <>
            <nav
                className={`min-h-screen bg-white dark:bg-[#0F0F12] border-r border-gray-200 dark:border-[#1F1F23] transition-all duration-200 ease-in-out
                            fixed inset-y-0 left-0 z-[70] w-64 lg:static lg:min-w-0
                            ${isOpen ? "translate-x-0 lg:w-64" : "-translate-x-full lg:w-0 lg:overflow-hidden"}`}
            >
                <div className="h-full flex flex-col">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex aspect-square size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                                <Wand2 className="size-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold">Designali</h2>
                                <p className="text-sm text-gray-400">Creative Suite</p>
                            </div>
                        </div>
                        <Button className="lg:hidden" variant="secondary" size="icon" onClick={() => setIsOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto py-4 px-4">
                        <div className="space-y-6">
                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Overview
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard" icon={Home}>
                                        Dashboard
                                    </NavItem>
                                    <NavItem href="/dashboard/categories" icon={PieChart}>
                                        Categories
                                    </NavItem>
                                    <NavItem href="/dashboard/calendar" icon={Calendar}>
                                        Calendar
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Finance
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="/dashboard/transactions" icon={Wallet}>
                                        Transactions
                                    </NavItem>
                                    <NavItem href="/dashboard/reports" icon={Receipt}>
                                        Reports
                                    </NavItem>
                                    <NavItem href="/dashboard/payments" icon={CreditCard}>
                                        Payments
                                    </NavItem>
                                </div>
                            </div>

                            <div>
                                <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                    Team
                                </div>
                                <div className="space-y-1">
                                    <NavItem href="#" icon={Users2}>
                                        Members
                                    </NavItem>
                                    <NavItem href="#" icon={Shield}>
                                        Permissions
                                    </NavItem>
                                    <NavItem href="#" icon={MessagesSquare}>
                                        Chat
                                    </NavItem>
                                    <NavItem href="#" icon={Video}>
                                        Meetings
                                    </NavItem>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="px-4 py-4 border-t border-gray-200 dark:border-[#1F1F23]">
                        <div className="space-y-1">
                            <NavItem href="/dashboard/settings" icon={Settings}>
                                Settings
                            </NavItem>
                            <NavItem href="#" icon={HelpCircle}>
                                Help
                            </NavItem>
                        </div>
                    </div>
                </div>
            </nav>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[65] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    )
}
