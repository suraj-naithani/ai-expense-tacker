"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useGetDateTransactionsQuery } from "@/redux/api/transactionApi";
import { useDefaultAccount } from "@/hooks/useDefaultAccount";
import moment from "moment";
import type { Transaction } from "@/types/transaction";
import { useState, useEffect } from "react";

interface CalendarDateTransactionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    date: string; // YYYY-MM-DD format
}

export function CalendarDateTransactionsDialog({
    open,
    onOpenChange,
    date,
}: CalendarDateTransactionsDialogProps) {
    const defaultAccountId = useDefaultAccount();
    const [lastFetchedDate, setLastFetchedDate] = useState<string | null>(null);

    const {
        data: dateTransactionsResponse,
        isLoading,
        isFetching,
    } = useGetDateTransactionsQuery(
        {
            date,
            ...(defaultAccountId && { accountId: defaultAccountId }),
        },
        {
            skip: !open || !date || !defaultAccountId,
            refetchOnMountOrArgChange: true,
        }
    );

    // Track when data fetch completes for the current date
    useEffect(() => {
        if (!isFetching && dateTransactionsResponse && date) {
            setLastFetchedDate(date);
        }
    }, [isFetching, dateTransactionsResponse, date]);

    // Reset last fetched date when dialog closes or date changes
    useEffect(() => {
        if (!open) {
            setLastFetchedDate(null);
        }
    }, [open]);

    // Only show data if we're not fetching AND we have fetched data for the current date
    const isDateMismatch = date !== lastFetchedDate;
    const shouldShowLoading = isLoading || isFetching || isDateMismatch;
    const transactions: Transaction[] = shouldShowLoading ? [] : (dateTransactionsResponse?.data || []);
    const formattedDate = moment(date).format("MMMM DD, YYYY");

    // Calculate summary
    const summary = {
        totalIncome: transactions
            .filter((t) => t.type === "INCOME")
            .reduce((sum, t) => sum + t.amount, 0),
        totalExpense: transactions
            .filter((t) => t.type === "EXPENSE")
            .reduce((sum, t) => sum + t.amount, 0),
        count: transactions.length,
    };
    const netIncome = summary.totalIncome - summary.totalExpense;

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
            )}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[450px] bg-[var(--card)] border-[var(--border)] z-[110] max-h-[80vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Transactions for {formattedDate}</DialogTitle>
                        <DialogDescription>
                            {transactions.length > 0
                                ? `${transactions.length} transaction${transactions.length > 1 ? "s" : ""} found`
                                : "No transactions for this date"}
                        </DialogDescription>
                    </DialogHeader>

                    {shouldShowLoading ? (
                        <div className="text-center py-8 text-muted-foreground">
                            Loading transactions...
                        </div>
                    ) : transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            No transactions found for this date
                        </div>
                    ) : (
                        <div className="flex flex-col flex-1 min-h-0 space-y-4">
                            {/* Summary - Fixed */}
                            <div className="flex items-center justify-between px-2 py-3 bg-[var(--card-hover)] rounded-lg flex-shrink-0">
                                <div>
                                    <div className="text-xs text-muted-foreground">Total Income</div>
                                    <div className="text-sm font-semibold text-[#4ade80]">
                                        ₹{summary.totalIncome.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Total Expenses</div>
                                    <div className="text-sm font-semibold text-[#f87171]">
                                        ₹{summary.totalExpense.toFixed(2)}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground">Net Amount</div>
                                    <div className={`text-sm font-semibold ${netIncome >= 0 ? "text-[#60a5fa]" : "text-[#f87171]"}`}>
                                        ₹{Math.abs(netIncome).toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            {/* Transactions List - Scrollable */}
                            <div className="flex-1 overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] min-h-0">
                                <div className="space-y-1">
                                    {transactions.map((transaction) => (
                                        <div
                                            key={transaction.id}
                                            className="flex items-start justify-between py-2 hover:bg-[var(--card-hover)] transition-colors rounded px-1"
                                        >
                                            <div className="flex items-start gap-2 flex-1 min-w-0">
                                                {transaction.category?.icon && (
                                                    <span className="text-base mt-0.5">{transaction.category.icon}</span>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm font-medium truncate">
                                                        {transaction.description || "No description"}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-0.5">
                                                        {moment(transaction.createdAt).format("hh:mm A")}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="ml-3 text-right flex-shrink-0">
                                                <div className="text-xs text-muted-foreground mb-0.5">
                                                    {transaction.category?.name || "Uncategorized"}
                                                </div>
                                                <div
                                                    className={`text-sm font-semibold ${transaction.type === "INCOME"
                                                        ? "text-[#4ade80]"
                                                        : "text-[#f87171]"
                                                        }`}
                                                >
                                                    {transaction.type === "INCOME" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-[var(--border)]">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="w-full border-[var(--border)] hover:bg-[var(--card-hover)]"
                        >
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}

