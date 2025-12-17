"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import type {
    Transaction,
    TransactionFormState,
    TransactionType,
    RecurringInterval
} from "@/types/transaction.d";

interface EditTransactionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    transaction: Transaction | null;
    onSave: (transaction: Transaction) => void;
}

export function EditTransactionDialog({
    open,
    onOpenChange,
    transaction,
    onSave,
}: EditTransactionDialogProps) {
    const [type, setType] = useState<TransactionType>("EXPENSE");
    const [amount, setAmount] = useState<string>("");
    const [category, setCategory] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [isRecurring, setIsRecurring] = useState<boolean>(false);
    const [recurringInterval, setRecurringInterval] = useState<string>("");
    const [account, setAccount] = useState<string>("");

    useEffect(() => {
        if (open && transaction) {
            setType(transaction.type);
            setAmount(transaction.amount.toString());
            setCategory(transaction.category?.id || "");
            setDescription(transaction.description || "");
            setIsRecurring(transaction.isRecurring);
            setRecurringInterval(transaction.recurringInterval || "");
            setAccount(transaction.account.id);
        }
    }, [open, transaction]);

    const handleClose = (next: boolean) => {
        if (!next) {
            setType("EXPENSE");
            setAmount("");
            setCategory("");
            setDescription("");
            setIsRecurring(false);
            setRecurringInterval("");
            setAccount("");
        }
        onOpenChange(next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!transaction || !amount) return;

        const parsedAmount = Number.parseFloat(amount || "0");

        const updatedTransaction: Transaction = {
            ...transaction,
            type,
            amount: Number.isNaN(parsedAmount) ? 0 : parsedAmount,
            description,
            isRecurring,
            recurringInterval: isRecurring ? recurringInterval as RecurringInterval : null,
        };

        onSave(updatedTransaction);

        handleClose(false);
    };

    if (!transaction) return null;

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
            )}
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[430px] bg-[var(--card)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle>Edit transaction</DialogTitle>
                        <DialogDescription>
                            Update the details of your transaction.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="edit-transaction-type">Type</Label>
                                <Select
                                    value={type}
                                    onValueChange={(value) =>
                                        setType(value as TransactionType)
                                    }
                                >
                                    <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] cursor-pointer">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--card)] border-[var(--border)] z-120">
                                        <SelectItem value="EXPENSE">
                                            Expense
                                        </SelectItem>
                                        <SelectItem value="INCOME">
                                            Income
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="edit-transaction-account">Account</Label>
                                <Select
                                    value={account}
                                    onValueChange={(value) =>
                                        setAccount(value)
                                    }
                                    disabled
                                >
                                    <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] cursor-pointer">
                                        <SelectValue placeholder="Select account" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--card)] border-[var(--border)] z-120">
                                        <SelectItem value={transaction.account.id}>
                                            {transaction.account.name}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-transaction-amount">
                                Amount
                            </Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    ₹
                                </span>
                                <Input
                                    id="edit-transaction-amount"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-7 bg-[var(--card)] border-[var(--border)]"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="edit-transaction-description">Description</Label>
                            <Textarea
                                id="edit-transaction-description"
                                placeholder="Enter description"
                                className="bg-[var(--card)] border-[var(--border)]"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">
                                    Recurring Transaction
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Set up a recurring schedule for this transaction
                                </p>
                            </div>
                            <Switch
                                checked={isRecurring}
                                onCheckedChange={(checked) =>
                                    setIsRecurring(!!checked)
                                }
                            />
                        </div>

                        {isRecurring && (
                            <div className="space-y-2">
                                <Label htmlFor="edit-recurring-interval">Recurring Interval</Label>
                                <Select
                                    value={recurringInterval}
                                    onValueChange={(value) => setRecurringInterval(value)}
                                >
                                    <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] cursor-pointer">
                                        <SelectValue placeholder="Select interval" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--card)] border-[var(--border)] z-120">
                                        <SelectItem value="DAILY">Daily</SelectItem>
                                        <SelectItem value="WEEKLY">Weekly</SelectItem>
                                        <SelectItem value="MONTHLY">Monthly</SelectItem>
                                        <SelectItem value="YEARLY">Yearly</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleClose(false)}
                                className="border-[var(--border)] hover:bg-[var(--card-hover)] cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer"
                            >
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}