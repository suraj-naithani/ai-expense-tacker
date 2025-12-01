"use client";

import { Plus, Wallet } from "lucide-react";
import { useMemo, useState } from "react";

import {
    AddAccountDialog,
    type AccountFormValues,
} from "@/components/dialog/AddAccountDialog";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
                    className="group relative flex aspect-[16/9] w-full items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--card)] text-muted-foreground outline-none transition hover:border-[#6366f1] hover:bg-[var(--card-hover)] focus-visible:ring-2 focus-visible:ring-[#6366f1]"
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
                        className="group flex aspect-[16/9] w-full flex-col justify-between overflow-hidden rounded-2xl border-[var(--border)] bg-[var(--card)] shadow-sm transition hover:border-[#6366f1]/70 hover:shadow-md"
                    >
                        <CardHeader className="flex flex-row items-start justify-between pb-1">
                            <div className="space-y-2">
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
                            <div className="flex flex-col items-end gap-1">
                                <Switch
                                    checked={account.isDefault}
                                    onCheckedChange={() => handleToggleDefault(account.id)}
                                />
                                <span className="text-[11px] text-muted-foreground">
                                    {account.isDefault ? "Default" : "Make default"}
                                </span>
                            </div>
                        </CardHeader>
                        <CardContent className="flex items-end justify-between pt-0 text-xs text-muted-foreground">
                            <div className="flex-1" />
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
        </div>
    );
}


