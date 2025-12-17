"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type React from "react";
import { useState } from "react";
import { toast } from "sonner";

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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useDefaultAccount } from "@/hooks/useDefaultAccount";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import { useCreateTransactionMutation } from "@/redux/api/transactionApi";
import type {
  TransactionFormState,
  CreateTransactionPayload,
  RecurringInterval,
  TransactionType,
} from "@/types/transaction";

interface AddExpenseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialFormState: TransactionFormState = {
  type: "EXPENSE",
  amount: "",
  category: "",
  description: "",
  isRecurring: false,
  recurringInterval: "",
};

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseModalProps) {
  const [formState, setFormState] = useState<TransactionFormState>(initialFormState);
  const defaultAccountId = useDefaultAccount();
  const [createTransaction, { isLoading }] = useCreateTransactionMutation();
  const { data: categoriesResponse, isLoading: isLoadingCategories } = useGetCategoriesQuery();

  const categories = categoriesResponse?.data || [];

  const updateField = <K extends keyof TransactionFormState>(
    field: K,
    value: TransactionFormState[K],
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.amount || !formState.category || !defaultAccountId) {
      return;
    }

    if (formState.isRecurring && !formState.recurringInterval) {
      return;
    }

    // Map UI form state to API payload
    const payload: CreateTransactionPayload = {
      accountId: defaultAccountId,
      categoryId: formState.category, // assumes category value is the categoryId
      amount: Number.parseFloat(formState.amount),
      type: formState.type as TransactionType,
      description: formState.description || undefined,
      isRecurring: formState.isRecurring || undefined,
      recurringInterval: formState.isRecurring
        ? (formState.recurringInterval.toUpperCase() as RecurringInterval)
        : undefined,
    };

    const loadingToast = toast.loading("Creating transaction...");

    try {
      await createTransaction(payload).unwrap();
      toast.success("Transaction created successfully");
      resetForm();
      onOpenChange(false);
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Failed to create transaction. Please try again.";
      toast.error(message);
    } finally {
      toast.dismiss(loadingToast);
    }
  };

  const resetForm = () => {
    setFormState(initialFormState);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--background)] border-[var(--border)] z-110">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Transaction</DialogTitle>
            <DialogDescription>
              Enter the details of your transaction below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={formState.type}
                  onValueChange={(value: TransactionType) =>
                    updateField("type", value)
                  }
                >
                  <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] rounded-md cursor-pointer py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#3b3b4b]">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] z-120">
                    <SelectItem value="EXPENSE" className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]">
                      Expense
                    </SelectItem>
                    <SelectItem value="INCOME" className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]">
                      Income
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formState.category}
                  onValueChange={(value) => updateField("category", value)}
                  disabled={isLoadingCategories}
                >
                  <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] rounded-md cursor-pointer py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#3b3b4b]">
                    <SelectValue placeholder={isLoadingCategories ? "Loading categories..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] max-h-60 overflow-y-auto z-120">
                    {isLoadingCategories ? (
                      <SelectItem value="loading" disabled>
                        Loading categories...
                      </SelectItem>
                    ) : categories.length === 0 ? (
                      <SelectItem value="no-categories" disabled>
                        No categories available
                      </SelectItem>
                    ) : (
                      categories.map((cat) => (
                        <SelectItem
                          key={cat.id}
                          value={cat.id}
                          className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]"
                        >
                          {cat.icon} {cat.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7 bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                  value={formState.amount}
                  onChange={(e) => updateField("amount", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                value={formState.description}
                onChange={(e) => updateField("description", e.target.value)}
                className="bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between space-x-2">
                <div className="space-y-0.5">
                  <Label htmlFor="recurring">Recurring Transaction</Label>
                  <p className="text-sm text-muted-foreground">
                    Set up a recurring schedule for this transaction
                  </p>
                </div>
                <Switch
                  id="recurring"
                  checked={formState.isRecurring}
                  onCheckedChange={(checked) => updateField("isRecurring", checked)}
                />
              </div>

              {formState.isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="recurringInterval">Recurring Interval *</Label>
                  <Select
                    value={formState.recurringInterval}
                    onValueChange={(value) => updateField("recurringInterval", value)}
                  >
                    <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] rounded-md cursor-pointer py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#3b3b4b]">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                    <SelectContent className="bg-[var(--card)] border-[var(--border)] z-120">
                      <SelectItem value="DAILY" className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]">
                        Daily
                      </SelectItem>
                      <SelectItem value="WEEKLY" className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]">
                        Weekly
                      </SelectItem>
                      <SelectItem value="MONTHLY" className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]">
                        Monthly
                      </SelectItem>
                      <SelectItem value="YEARLY" className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]">
                        Yearly
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                className="border-[var(--border)] hover:bg-[var(--card)] cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
