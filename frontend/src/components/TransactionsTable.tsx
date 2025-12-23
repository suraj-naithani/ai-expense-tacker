"use client";

import { ChevronLeft, ChevronRight, Edit, MoreHorizontal, Power, Trash2 } from "lucide-react";
import moment from "moment";
import type { TransactionsTableProps } from "@/types/transaction";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export function TransactionsTable({
    transactions,
    isLoading = false,
    variant = "regular",
    selectedTransactions = [],
    onSelectTransaction,
    onSelectAll,
    onEdit,
    onDelete,
    onToggleActive,
    pagination,
    currentPage,
    pageSize,
    onPageChange,
    onPageSizeChange,
    emptyMessage,
}: TransactionsTableProps) {
    const isRecurring = variant === "recurring";
    const totalPages = pagination?.totalPages ?? 1;
    const totalItems = pagination?.total ?? 0;
    const startItem = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
    const endItem = pagination ? Math.min(pagination.page * pagination.limit, totalItems) : 0;

    const defaultEmptyMessage = isRecurring
        ? "No recurring transactions found."
        : "No transactions found.";

    const colSpan = isRecurring ? 7 : 7;

    return (
        <>
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-[var(--border)]">
                            {!isRecurring && onSelectTransaction && (
                                <TableHead className="w-[50px]">
                                    <Checkbox
                                        checked={
                                            selectedTransactions.length === transactions.length && transactions.length > 0
                                        }
                                        onCheckedChange={onSelectAll}
                                    />
                                </TableHead>
                            )}
                            <TableHead>Description</TableHead>
                            <TableHead className="hidden sm:table-cell">Category</TableHead>
                            <TableHead className="hidden md:table-cell">Account</TableHead>
                            {isRecurring ? (
                                <>
                                    <TableHead className="hidden sm:table-cell">Frequency</TableHead>
                                    <TableHead className="hidden sm:table-cell">Next Date</TableHead>
                                </>
                            ) : (
                                <TableHead className="hidden sm:table-cell">Date</TableHead>
                            )}
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="text-center py-6">
                                    Loading transactions...
                                </TableCell>
                            </TableRow>
                        ) : transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={colSpan} className="text-center py-6">
                                    {emptyMessage || defaultEmptyMessage}
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((transaction) => (
                                <TableRow key={transaction.id} className="border-[var(--border)]">
                                    {!isRecurring && onSelectTransaction && (
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedTransactions.includes(transaction.id)}
                                                onCheckedChange={() => onSelectTransaction(transaction.id)}
                                            />
                                        </TableCell>
                                    )}
                                    <TableCell className="font-medium">
                                        <div>
                                            <div>{transaction.description || "No description"}</div>
                                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                                                {transaction.category
                                                    ? `${transaction.category.icon} ${transaction.category.name}`
                                                    : "Uncategorized"}{" "}
                                                •{" "}
                                                {isRecurring
                                                    ? transaction.nextExecutionDate
                                                        ? moment(transaction.nextExecutionDate).format("DD/MM/YYYY")
                                                        : "Not set"
                                                    : moment(transaction.createdAt).format("DD/MM/YYYY")}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <Badge variant="secondary" className="bg-[var(--card-hover)]">
                                            {transaction.category
                                                ? `${transaction.category.icon} ${transaction.category.name}`
                                                : "Uncategorized"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="hidden md:table-cell text-muted-foreground">
                                        {transaction.account.name}
                                    </TableCell>
                                    {isRecurring ? (
                                        <>
                                            <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                <Badge variant="outline" className="text-xs">
                                                    {transaction.recurringInterval
                                                        ? transaction.recurringInterval.charAt(0).toUpperCase() +
                                                        transaction.recurringInterval.slice(1).toLowerCase()
                                                        : "Once"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden sm:table-cell text-muted-foreground">
                                                {transaction.nextExecutionDate
                                                    ? moment(transaction.nextExecutionDate).format("DD/MM/YYYY")
                                                    : "Not set"}
                                            </TableCell>
                                        </>
                                    ) : (
                                        <TableCell className="hidden sm:table-cell text-muted-foreground">
                                            {moment(transaction.createdAt).format("DD/MM/YYYY")}
                                        </TableCell>
                                    )}
                                    <TableCell
                                        className={`text-right font-medium ${transaction.type === "INCOME" ? "text-[#4ade80]" : "text-[#f87171]"
                                            }`}
                                    >
                                        {transaction.type === "INCOME" ? "+" : "-"}₹
                                        {Math.abs(transaction.amount).toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                                align="end"
                                                className="bg-[var(--card)] border-[var(--border)]"
                                            >
                                                {onEdit && (
                                                    <DropdownMenuItem onClick={() => onEdit(transaction)}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                )}
                                                {isRecurring && onToggleActive && (
                                                    <DropdownMenuItem onClick={() => onToggleActive(transaction)}>
                                                        <Power className="mr-2 h-4 w-4" />
                                                        {transaction.isActive ? "Deactivate" : "Activate"}
                                                    </DropdownMenuItem>
                                                )}
                                                {onDelete && (
                                                    <DropdownMenuItem
                                                        className="text-[#f87171]"
                                                        onClick={() => onDelete(transaction)}
                                                    >
                                                        <Trash2 className="mr-2 h-4 w-4" />
                                                        Delete
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
            {pagination && totalItems > 0 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[var(--border)] pt-4 mt-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
                        <Select value={pageSize.toString()} onValueChange={onPageSizeChange}>
                            <SelectTrigger className="w-[80px] h-8 border-[var(--border)] bg-[var(--card)]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[var(--card)] border-[var(--border)]">
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="30">30</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                                <SelectItem value="100">100</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            Showing {startItem} to {endItem} of {totalItems} transactions
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[var(--border)]"
                                    onClick={() => onPageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="bg-[#6366f1] hover:bg-[#4f46e5] text-white cursor-default pointer-events-none"
                                >
                                    {currentPage}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-[var(--border)]"
                                    onClick={() => onPageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

