"use client"

import {
    Calendar,
    DollarSign,
    Edit,
    HandCoins,
    MoreHorizontal,
    Plus,
    Trash2,
    TrendingDown,
    TrendingUp,
    User
} from "lucide-react"
import { useState } from "react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddPaymentDialog } from "@/components/dialog/AddPaymentDialog"

const lentMoney = [
    {
        id: 1,
        name: "John Smith",
        amount: 500,
        date: "2024-01-10",
        dueDate: "2024-02-10",
        status: "pending",
        description: "Emergency loan",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 2,
        name: "Sarah Johnson",
        amount: 250,
        date: "2024-01-05",
        dueDate: "2024-01-25",
        status: "overdue",
        description: "Car repair",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 3,
        name: "Mike Wilson",
        amount: 150,
        date: "2023-12-20",
        dueDate: "2024-01-20",
        status: "paid",
        description: "Dinner expenses",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 4,
        name: "Emily Davis",
        amount: 300,
        date: "2024-01-12",
        dueDate: "2024-02-12",
        status: "pending",
        description: "Medical bills",
        avatar: "/placeholder.svg?height=32&width=32",
    },
]

const borrowedMoney = [
    {
        id: 1,
        name: "Alex Thompson",
        amount: 800,
        date: "2024-01-08",
        dueDate: "2024-02-08",
        status: "pending",
        description: "Business investment",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 2,
        name: "Lisa Brown",
        amount: 200,
        date: "2023-12-15",
        dueDate: "2024-01-15",
        status: "overdue",
        description: "Rent assistance",
        avatar: "/placeholder.svg?height=32&width=32",
    },
    {
        id: 3,
        name: "David Miller",
        amount: 450,
        date: "2023-11-20",
        dueDate: "2023-12-20",
        status: "new",
        description: "Laptop purchase",
        avatar: "/placeholder.svg?height=32&width=32",
    },
]

export default function Page() {
    const [activeTab, setActiveTab] = useState("lent")
    const [isLendModalOpen, setIsLendModalOpen] = useState(false)
    const [modalType, setModalType] = useState<"lent" | "borrowed">("lent")

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge className="rounded-full bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20">Pending</Badge>
            case "overdue":
                return <Badge className="rounded-full bg-[#f87171]/10 text-[#f87171] border-[#f87171]/20">Overdue</Badge>
            case "paid":
                return <Badge className="rounded-full bg-[#4ade80]/10 text-[#4ade80] border-[#4ade80]/20">Paid</Badge>
            default:
                return <Badge className="rounded-full" variant="secondary">{status}</Badge>
        }
    }

    const totalLent = lentMoney.reduce((sum, item) => sum + item.amount, 0)
    const totalBorrowed = borrowedMoney.reduce((sum, item) => sum + item.amount, 0)
    const pendingLent = lentMoney.filter((item) => item.status === "pending").reduce((sum, item) => sum + item.amount, 0)
    const pendingBorrowed = borrowedMoney
        .filter((item) => item.status === "pending")
        .reduce((sum, item) => sum + item.amount, 0)

    const handleQuickAction = (type: "lent" | "borrowed") => {
        setModalType(type)
        setIsLendModalOpen(true)
    }

    return (
        <>
            <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Payment</h1>
                        <p className="text-muted-foreground">Manage and track all your financial transactions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Transaction
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:gap-6 grid-cols-2 lg:grid-cols-4">
                    <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Lent</CardTitle>
                            <HandCoins className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-[#4ade80]">${totalLent.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">{lentMoney.length} people</p>
                        </CardContent>
                    </Card>

                    <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Borrowed</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-[#f87171]">${totalBorrowed.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">{borrowedMoney.length} people</p>
                        </CardContent>
                    </Card>

                    <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending to Receive</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-[#f59e0b]">${pendingLent.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Money to collect</p>
                        </CardContent>
                    </Card>

                    <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Pending to Pay</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-[#a78bfa]">${pendingBorrowed.toFixed(2)}</div>
                            <p className="text-xs text-muted-foreground">Money to pay back</p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common actions for managing your money records</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
                            <Button
                                className="w-full justify-start bg-[#4ade80]/10 text-[#4ade80] border border-[#4ade80]/20 hover:bg-[#4ade80]/20"
                                onClick={() => handleQuickAction("lent")}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Record Money Lent
                            </Button>
                            <Button
                                className="w-full justify-start bg-[#f87171]/10 text-[#f87171] border border-[#f87171]/20 hover:bg-[#f87171]/20"
                                onClick={() => handleQuickAction("borrowed")}
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Record Money Borrowed
                            </Button>
                            <Button className="w-full justify-start bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20 hover:bg-[#f59e0b]/20">
                                <Calendar className="mr-2 h-4 w-4" />
                                Send Payment Reminders
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader>
                        <CardTitle>Money Management</CardTitle>
                        <CardDescription>{`Track money you've lent to others and borrowed from others`}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2 bg-[var(--card-hover)] ]">
                                <TabsTrigger value="lent" className="data-[state=active]:bg-[#6366f1]">
                                    Money Lent ({lentMoney.length})
                                </TabsTrigger>
                                <TabsTrigger value="borrowed" className="data-[state=active]:bg-[#6366f1]">
                                    Money Borrowed ({borrowedMoney.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="lent" className="mt-6">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-[var(--border)]">
                                                <TableHead>Person</TableHead>
                                                <TableHead className="hidden sm:table-cell">Amount</TableHead>
                                                <TableHead className="hidden md:table-cell">Date Lent</TableHead>
                                                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden lg:table-cell">Description</TableHead>
                                                <TableHead className="w-[50px]">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {lentMoney.map((record) => (
                                                <TableRow key={record.id} className="hover:bg-[var(--card-hover)] border-[var(--border)]">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.name} />
                                                                <AvatarFallback className="bg-[#6366f1] text-white">
                                                                    {record.name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <span className="font-medium">{record.name}</span>
                                                                <div className="sm:hidden text-xs text-muted-foreground">
                                                                    ${record.amount} • {record.date}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell font-medium text-[#4ade80]">
                                                        ${record.amount}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">{record.date}</TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                                        {record.dueDate}
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                                                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                                                        {record.description}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-[var(--card)] border-[var(--border)]">
                                                                <DropdownMenuItem>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                                                <DropdownMenuItem>Send Reminder</DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-[var(--card)]" />
                                                                <DropdownMenuItem className="text-[#f87171]">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>

                            <TabsContent value="borrowed" className="mt-6">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="border-[var(--border)]">
                                                <TableHead>Person</TableHead>
                                                <TableHead className="hidden sm:table-cell">Amount</TableHead>
                                                <TableHead className="hidden md:table-cell">Date Borrowed</TableHead>
                                                <TableHead className="hidden md:table-cell">Due Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="hidden lg:table-cell">Description</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {borrowedMoney.map((record) => (
                                                <TableRow key={record.id} className="hover:bg-[var(--card-hover)] border-[var(--border)]">
                                                    <TableCell>
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="h-8 w-8">
                                                                <AvatarImage src={record.avatar || "/placeholder.svg"} alt={record.name} />
                                                                <AvatarFallback className="bg-[#6366f1] text-white">
                                                                    {record.name
                                                                        .split(" ")
                                                                        .map((n) => n[0])
                                                                        .join("")}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div>
                                                                <span className="font-medium">{record.name}</span>
                                                                <div className="sm:hidden text-xs text-muted-foreground">
                                                                    ${record.amount} • {record.date}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="hidden sm:table-cell font-medium text-[#f87171]">
                                                        ${record.amount}
                                                    </TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">{record.date}</TableCell>
                                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                                        {record.dueDate}
                                                    </TableCell>
                                                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                                                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                                                        {record.description}
                                                    </TableCell>
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end" className="bg-[var(--card)] border-[var(--border)]">
                                                                <DropdownMenuItem>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem>Mark as Paid</DropdownMenuItem>
                                                                <DropdownMenuItem>Set Reminder</DropdownMenuItem>
                                                                <DropdownMenuSeparator className="bg-[var(--card)]" />
                                                                <DropdownMenuItem className="text-[#f87171]">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates on your money records</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#4ade80]/10 border border-[#4ade80]/20">
                                <User className="h-5 w-5 text-[#4ade80]" />
                                <div>
                                    <div className="font-medium text-[#4ade80]">Mike Wilson paid back $150</div>
                                    <div className="text-sm text-muted-foreground">2 hours ago</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#f87171]/10 border border-[#f87171]/20">
                                <Calendar className="h-5 w-5 text-[#f87171]" />
                                <div>
                                    <div className="font-medium text-[#f87171]">Sarah Johnson payment overdue</div>
                                    <div className="text-sm text-muted-foreground">1 day ago</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-[#60a5fa]/10 border border-[#60a5fa]/20">
                                <Plus className="h-5 w-5 text-[#60a5fa]" />
                                <div>
                                    <div className="font-medium text-[#60a5fa]">New loan to Emily Davis</div>
                                    <div className="text-sm text-muted-foreground">3 days ago</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <AddPaymentDialog open={isLendModalOpen} onOpenChange={setIsLendModalOpen} type={modalType} />
        </>
    )
}
