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

import type { AccountFormValues, AccountType } from "./AddAccountDialog";

interface UpdateAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    account: AccountFormValues | null;
    onSave: (account: AccountFormValues) => void;
}

export function UpdateAccountDialog({
    open,
    onOpenChange,
    account,
    onSave,
}: UpdateAccountDialogProps) {
    const [name, setName] = useState("");
    const [type, setType] = useState<AccountType>("current");
    const [initialBalance, setInitialBalance] = useState<string>("");
    const [isDefault, setIsDefault] = useState(false);

    useEffect(() => {
        if (open && account) {
            setName(account.name);
            setType(account.type);
            setInitialBalance(account.initialBalance.toString());
            setIsDefault(account.isDefault);
        }
    }, [open, account]);

    const handleClose = (next: boolean) => {
        if (!next) {
            setName("");
            setType("current");
            setInitialBalance("");
            setIsDefault(false);
        }
        onOpenChange(next);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!account || !name) return;

        const parsedBalance = Number.parseFloat(initialBalance || "0");

        onSave({
            ...account,
            name,
            type,
            initialBalance: Number.isNaN(parsedBalance) ? 0 : parsedBalance,
            isDefault,
        });

        handleClose(false);
    };

    if (!account) return null;

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
            )}
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[430px] bg-[var(--card)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle>Update account</DialogTitle>
                        <DialogDescription>
                            Update the details of your account.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label htmlFor="update-account-name">Account name</Label>
                            <Input
                                id="update-account-name"
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
                                onValueChange={(value) =>
                                    setType(value as AccountType)
                                }
                            >
                                <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] cursor-pointer">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent className="bg-[var(--card)] border-[var(--border)] z-120">
                                    <SelectItem value="current">
                                        Current account
                                    </SelectItem>
                                    <SelectItem value="savings">
                                        Savings account
                                    </SelectItem>
                                    <SelectItem value="credit-card">
                                        Credit card
                                    </SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="update-initial-balance">
                                Balance
                            </Label>
                            <div className="relative">
                                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    ₹
                                </span>
                                <Input
                                    id="update-initial-balance"
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="pl-7 bg-[var(--card)] border-[var(--border)]"
                                    value={initialBalance}
                                    onChange={(e) =>
                                        setInitialBalance(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-dashed border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
                            <div className="space-y-0.5">
                                <p className="text-sm font-medium">
                                    Set as default account
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    All new transactions will use this account
                                    by default.
                                </p>
                            </div>
                            <Switch
                                checked={isDefault}
                                onCheckedChange={(checked) =>
                                    setIsDefault(!!checked)
                                }
                            />
                        </div>

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


