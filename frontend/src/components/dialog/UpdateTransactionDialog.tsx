"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type React from "react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useGetCategoriesQuery } from "@/redux/api/categoryApi";
import type {
  Transaction,
  UpdateTransactionFormValues,
  TransactionType,
  RecurringInterval,
} from "@/types/transaction";

interface FormState {
  type: TransactionType;
  amount: string;
  categoryId: string;
  description: string;
  recurringInterval: string;
  isActive: boolean;
}

interface UpdateTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction: Transaction | null;
  onSave: (values: UpdateTransactionFormValues) => void;
}

export function UpdateTransactionDialog({
  open,
  onOpenChange,
  transaction,
  onSave,
}: UpdateTransactionDialogProps) {
  const initialState: FormState = {
    type: "EXPENSE",
    amount: "",
    categoryId: "",
    description: "",
    recurringInterval: "",
    isActive: true,
  };

  const [form, setForm] = useState<FormState>(initialState);
  const { data: categoriesRes, isLoading: loadingCats } = useGetCategoriesQuery();
  const categories = categoriesRes?.data || [];

  useEffect(() => {
    if (open && transaction) {
      setForm({
        type: transaction.type,
        amount: transaction.amount.toString(),
        categoryId: transaction.category?.id || "",
        description: transaction.description || "",
        recurringInterval: transaction.recurringInterval || "",
        isActive: transaction.isActive,
      });
    }
  }, [open, transaction]);

  const resetAndClose = () => {
    setForm(initialState);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!amount || !form.categoryId) return;

    onSave({
      type: form.type,
      amount,
      categoryId: form.categoryId,
      description: form.description || undefined,
      isActive: form.isActive,
      recurringInterval: (transaction?.isActive || form.isActive) ? form.recurringInterval as RecurringInterval : undefined,
    });
    resetAndClose();
  };

  if (!transaction) return null;


  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
      )}
      <Dialog open={open} onOpenChange={resetAndClose}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--background)] border-[var(--border)] z-110">
          <DialogHeader>
            <DialogTitle className="text-xl">Update Transaction</DialogTitle>
            <DialogDescription>
              Update the details of your transaction below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type *</Label>
                <Select
                  value={form.type}
                  onValueChange={(value: TransactionType) =>
                    setForm(prev => ({ ...prev, type: value as TransactionType }))
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
                  value={form.categoryId}
                  onValueChange={(value) => setForm(prev => ({ ...prev, categoryId: value }))}
                  disabled={loadingCats}
                >
                  <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] rounded-md cursor-pointer py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#3b3b4b]">
                    <SelectValue placeholder={loadingCats ? "Loading categories..." : "Select category"} />
                  </SelectTrigger>
                  <SelectContent className="bg-[var(--card)] border-[var(--border)] max-h-60 overflow-y-auto z-120">
                    {loadingCats ? (
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
                  value={form.amount}
                  onChange={(e) => setForm(prev => ({ ...prev, amount: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                value={form.description}
                onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
              />
            </div>

            {/* Only show recurring settings if this is a recurring transaction */}
            {transaction?.isRecurring && (
              <div className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="active">Enable Recurring Transaction</Label>
                    <p className="text-sm text-muted-foreground">
                      Toggle to enable or disable the recurring schedule for this transaction
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={form.isActive}
                    onCheckedChange={(checked) => setForm(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>

                {form.isActive && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="recurringInterval">Recurring Interval *</Label>
                      <Select
                        value={form.recurringInterval}
                        onValueChange={(value) => setForm(prev => ({ ...prev, recurringInterval: value }))}
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
                  </>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={resetAndClose}
                className="border-[var(--border)] hover:bg-[var(--card)] cursor-pointer"
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