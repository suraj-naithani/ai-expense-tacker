"use client";

import { Edit2, MoreVertical, Plus, Trash2, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
    AddAccountDialog,
    type AccountFormValues,
} from "@/components/dialog/AddAccountDialog";
import { DeleteAccountDialog } from "@/components/dialog/DeleteAccountDialog";
import { EditAccountDialog } from "@/components/dialog/EditAccountDialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";

type Account = AccountFormValues;

const initialAccounts: Account[] = [
    {
        id: "1",
        name: "Work",
        type: "current",
        initialBalance: 5941,
        isDefault: true,
    },
    {
        id: "2",
        name: "Savings",
        type: "savings",
        initialBalance: 12500,
        isDefault: false,
    },
    {
        id: "3",
        name: "Cash Wallet",
        type: "cash",
        initialBalance: 240,
        isDefault: false,
    },
];

const formatAccountType = (type: Account["type"]) => {
    switch (type) {
        case "current":
            return "Current account";
        case "savings":
            return "Savings account";
        case "credit-card":
            return "Credit card";
        case "cash":
            return "Cash";
        default:
            return type;
    }
};

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

    const defaultAccountId = useMemo(
        () => accounts.find((a) => a.isDefault)?.id,
        [accounts],
    );

    const handleCreateAccount = (account: AccountFormValues) => {
        setAccounts((prev) => {
            let updated = [...prev];

            if (account.isDefault) {
                updated = updated.map((a) => ({ ...a, isDefault: false }));
            }

            return [
                ...updated,
                {
                    ...account,
                    initialBalance: account.initialBalance,
                },
            ];
        });
    };

    const handleToggleDefault = (id: string) => {
        setAccounts((prev) =>
            prev.map((account) => ({
                ...account,
                isDefault: account.id === id,
            })),
        );
    };

    const handleOpenEdit = (account: Account) => {
        setEditingAccount(account);
        setIsEditDialogOpen(true);
    };

    const handleSaveEdit = (updated: AccountFormValues) => {
        setAccounts((prev) => {
            let next = prev.map((account) =>
                account.id === updated.id ? { ...account, ...updated } : account,
            );

            if (updated.isDefault) {
                next = next.map((account) => ({
                    ...account,
                    isDefault: account.id === updated.id,
                }));
            }

            return next;
        });
        setEditingAccount(null);
    };

    const handleOpenDelete = (account: Account) => {
        setAccountToDelete(account);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!accountToDelete) return;

        setAccounts((prev) => {
            const remaining = prev.filter(
                (account) => account.id !== accountToDelete.id,
            );

            if (accountToDelete.isDefault && remaining.length > 0) {
                const [first, ...rest] = remaining;
                return [{ ...first, isDefault: true }, ...rest];
            }

            return remaining;
        });

        setAccountToDelete(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Reports</h1>
                    <p className="text-muted-foreground">
                        Analyze your financial data and trends
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:gap-5 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {/* Add new account card */}
                <button
                    type="button"
                    onClick={() => setIsDialogOpen(true)}
                    className="group relative flex min-h-[150px] w-full items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] text-muted-foreground outline-none transition hover:border-[#6366f1] hover:bg-[var(--card-hover)] focus-visible:ring-2 focus-visible:ring-[#6366f1]"
                >
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--background)] text-[#6366f1] shadow-sm group-hover:border-[#6366f1]">
                            <Plus className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-medium">Add New Account</p>
                    </div>
                </button>

                {accounts.map((account) => (
                    <Card
                        key={account.id}
                        className="group flex w-full min-h-[150px] flex-col justify-between overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[#6366f1]/70 hover:shadow-md"
                    >
                        <CardHeader className="flex flex-row items-start justify-between pb-0.5">
                            <div className="space-y-1">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {account.name}
                                </CardTitle>
                                <p className="text-2xl font-semibold tracking-tight">
                                    ₹
                                    {account.initialBalance.toLocaleString("en-IN", {
                                        maximumFractionDigits: 2,
                                    })}
                                </p>
                                <span className="text-xs text-muted-foreground">
                                    {formatAccountType(account.type)}
                                </span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 rounded-full text-muted-foreground hover:text-foreground hover:bg-[var(--card-hover)] cursor-pointer"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className="bg-[var(--card)] border-[var(--border)]"
                                >
                                    <DropdownMenuItem
                                        onClick={() => handleOpenEdit(account)}
                                        className="text-xs cursor-pointer"
                                    >
                                        <Edit2 className="mr-2 h-3 w-3" />
                                        Edit account
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => handleOpenDelete(account)}
                                        className="text-xs text-destructive focus:text-destructive cursor-pointer"
                                        variant="destructive"
                                    >
                                        <Trash2 className="mr-2 h-3 w-3" />
                                        Delete account
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between pt-0 text-xs text-muted-foreground">
                            <div className="flex items-center gap-2 text-[11px]">
                                <Switch
                                    checked={account.isDefault}
                                    onCheckedChange={() =>
                                        handleToggleDefault(account.id)
                                    }
                                />
                                <span className="text-[11px] text-muted-foreground">
                                    {account.isDefault ? "Default" : "Make default"}
                                </span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px]">
                                <Wallet className="h-3 w-3 text-muted-foreground" />
                                <span>
                                    {defaultAccountId === account.id
                                        ? "Default account"
                                        : "Secondary account"}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <AddAccountDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSave={handleCreateAccount}
            />

            <EditAccountDialog
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                account={editingAccount}
                onSave={handleSaveEdit}
            />

            <DeleteAccountDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                accountName={accountToDelete?.name}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}


