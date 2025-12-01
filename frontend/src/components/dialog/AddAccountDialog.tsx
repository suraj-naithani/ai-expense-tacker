"use client";

import { useState } from "react";

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

export type AccountType = "current" | "savings" | "credit-card" | "cash";

export interface AccountFormValues {
    id: string;
    name: string;
    type: AccountType;
    initialBalance: number;
    isDefault: boolean;
}

interface AddAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (account: AccountFormValues) => void;
}

export function AddAccountDialog({
    open,
    onOpenChange,
    onSave,
}: AddAccountDialogProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState<AccountType>("current");
    const [initialBalance, setInitialBalance] = useState<string>("");
    const [isDefault, setIsDefault] = useState(false);

    const resetForm = () => {
        setName("");
        setType("current");
        setInitialBalance("");
        setIsDefault(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name) return;

        const parsedBalance = Number.parseFloat(initialBalance || "0");

        onSave({
            id: Date.now().toString(),
            name,
            type,
            initialBalance: Number.isNaN(parsedBalance) ? 0 : parsedBalance,
            isDefault,
        });

        resetForm();
        onOpenChange(false);
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
            )}
            <Dialog
                open={open}
                onOpenChange={(next) => {
                    if (!next) {
                        resetForm();
                    }
                    onOpenChange(next);
                }}
            >
                <DialogContent className="sm:max-w-[430px] bg-[var(--card)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle>Create account</DialogTitle>
                        <DialogDescription>
                            Add a new account to track your transactions.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="account-name">Account name</Label>
                            <Input
                                id="account-name"
                                placeholder="Work, Personal, Business..."
                                className="bg-[var(--card)] border-[var(--border)]"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Account type</Label>
                            <Select
                                value={type}
                                onValueChange={(value) => setType(value as AccountType)}
                            >
                                <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] cursor-pointer">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--card)] border-[var(--border)] z-120">
                                    <SelectItem value="current">Current account</SelectItem>
                                    <SelectItem value="savings">Savings account</SelectItem>
                                    <SelectItem value="credit-card">Credit card</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="initial-balance">Initial balance</Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    ₹
                                </span>
                                <Input
                                    id="initial-balance"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-7 bg-[var(--card)] border-[var(--border)]"
                                    value={initialBalance}
                                    onChange={(e) => setInitialBalance(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">Set as default account</p>
                                <p className="text-xs text-muted-foreground">
                                    All new transactions will use this account by default.
                                </p>
                            </div>
                            <Switch
                                checked={isDefault}
                                onCheckedChange={(checked) => setIsDefault(!!checked)}
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                                className="border-[var(--border)] hover:bg-[var(--card-hover)] cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer"
                            >
                                Create account
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}


