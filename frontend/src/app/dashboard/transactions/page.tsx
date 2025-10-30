"use client"

import {
    DollarSign,
    Download,
    Edit,
    Filter,
    MoreHorizontal,
    Plus,
    Search,
    Target,
    Trash2,
    TrendingDown,
    TrendingUp
} from "lucide-react"
import { useState } from "react"

import { AddExpenseDialog } from "@/components/dialog/AddExpenseDialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const transactions = [
    {
        id: 1,
        description: "Grocery Store",
        category: "Food",
        amount: -85.5,
        date: "2024-01-15",
        type: "expense",
        account: "Credit Card",
    },
    {
        id: 2,
        description: "Salary",
        category: "Income",
        amount: 3500.0,
        date: "2024-01-15",
        type: "income",
        account: "Bank Account",
    },
    {
        id: 3,
        description: "Gas Station",
        category: "Transport",
        amount: -45.2,
        date: "2024-01-14",
        type: "expense",
        account: "Debit Card",
    },
    {
        id: 4,
        description: "Netflix",
        category: "Entertainment",
        amount: -15.99,
        date: "2024-01-14",
        type: "expense",
        account: "Credit Card",
    },
    {
        id: 5,
        description: "Coffee Shop",
        category: "Food",
        amount: -12.5,
        date: "2024-01-13",
        type: "expense",
        account: "Cash",
    },
]

export default function Page() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedTransactions, setSelectedTransactions] = useState<number[]>([])
    const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false)

    const filteredTransactions = transactions.filter((transaction) =>
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const toggleTransaction = (id: number) => {
        setSelectedTransactions((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
    }

    const toggleAll = () => {
        setSelectedTransactions(
            selectedTransactions.length === filteredTransactions.length ? [] : filteredTransactions.map((t) => t.id),
        )
    }

    return (
        <>
            <div className="space-y-4 md:space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Transactions</h1>
                        <p className="text-muted-foreground">Manage and track all your financial transactions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="border-[var(--border)]">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        <Button variant="outline" size="sm" className="border-[var(--border)]">
                            <Filter className="h-4 w-4 mr-2" />
                            Filter
                        </Button>
                        <Button
                            size="sm"
                            className="bg-[#6366f1] hover:bg-[#4f46e5] text-white"
                            onClick={() => setIsAddExpenseOpen(true)}
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Transaction
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
                    <Card className="border-[var(--border)] bg-[var(--card)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold text-[#4ade80]">₹12,450.00</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-[#4ade80]">+2.5%</span> from last month
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="border-[var(--border)] bg-[var(--card)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
                            <Target className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl md:text-2xl font-bold">{filteredTransactions.length}</div>
                            <p className="text-xs text-muted-foreground">
                                <span className="text-[#f87171]">-2.5%</span> from last month
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-[var(--border)] bg-[var(--card)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Income</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#4ade80]">
                                $
                                {filteredTransactions
                                    .filter((t) => t.type === "income")
                                    .reduce((sum, t) => sum + t.amount, 0)
                                    .toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {filteredTransactions.filter((t) => t.type === "income").length} transactions
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-[var(--border)] bg-[var(--card)]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Expenses</CardTitle>
                            <TrendingDown className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-[#f87171]">
                                $
                                {Math.abs(
                                    filteredTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
                                ).toFixed(2)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {filteredTransactions.filter((t) => t.type === "expense").length} transactions
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border-[var(--border)] bg-[var(--card)] shadow-sm">
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                        <div>
                            <CardTitle>All Transactions</CardTitle>
                            <CardDescription>Manage and track all your financial transactions</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            {selectedTransactions.length > 0 && (
                                <Button variant="outline" size="sm" className="border-[var(--border)]">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete ({selectedTransactions.length})
                                </Button>
                            )}
                            <Button variant="outline" size="sm" className="border-[var(--border)]">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-[var(--border)]">
                                        <TableHead className="w-[50px]">
                                            <Checkbox
                                                checked={selectedTransactions.length === filteredTransactions.length}
                                                onCheckedChange={toggleAll}
                                            />
                                        </TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead className="hidden sm:table-cell">Category</TableHead>
                                        <TableHead className="hidden md:table-cell">Account</TableHead>
                                        <TableHead className="hidden sm:table-cell">Date</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead className="w-[50px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((transaction) => (
                                        <TableRow key={transaction.id} className="border-[var(--border)]">
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedTransactions.includes(transaction.id)}
                                                    onCheckedChange={() => toggleTransaction(transaction.id)}
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div>{transaction.description}</div>
                                                    <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                                        {transaction.category} • {transaction.date}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell">
                                                <Badge variant="secondary" className="bg-[var(--card-hover)]">
                                                    {transaction.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell text-muted-foreground">
                                                {transaction.account}
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-muted-foreground">{transaction.date}</TableCell>
                                            <TableCell
                                                className={`text-right font-medium ${transaction.type === "income" ? "text-[#4ade80]" : "text-[#f87171]"
                                                    }`}
                                            >
                                                {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
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
                    </CardContent>
                </Card>
            </div>

            <AddExpenseDialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen} />
        </>
    )
}
