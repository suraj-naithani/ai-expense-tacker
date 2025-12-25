"use client";

import type React from "react";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CreatePaymentFormValues, PaymentType } from "@/types/payment";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "lent" | "borrowed";
  onSave: (values: CreatePaymentFormValues) => void;
}

export function AddPaymentDialog({
  open,
  onOpenChange,
  type,
  onSave,
}: PaymentModalProps) {
  const [form, setForm] = useState({
    amount: "",
    personName: "",
    description: "",
    dueDate: undefined as Date | undefined,
    dialogType: type as "lent" | "borrowed",
  });
  const [openDatePicker, setOpenDatePicker] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.amount || !form.personName) {
      return;
    }

    const paymentType: PaymentType = form.dialogType === "lent" ? "LENT" : "BORROWED";

    onSave({
      amount: Number.parseFloat(form.amount),
      personName: form.personName,
      type: paymentType,
      description: form.description || undefined,
      dueDate: form.dueDate?.toISOString() || undefined,
      status: "PENDING",
    });

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setForm({
      amount: "",
      personName: "",
      description: "",
      dueDate: undefined,
      dialogType: type,
    });
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />
      )}
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] bg-[var(--card)] border-[var(--border)] z-[110]">
          <DialogHeader>
            <DialogTitle className="text-xl">Add Transaction</DialogTitle>
            <DialogDescription>
              Record a new financial transaction.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
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
                    className="pl-7  bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                    value={form.amount}
                    onChange={(e) => setForm((prev) => ({ ...prev, amount: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="personName">Person *</Label>
                <Input
                  id="personName"
                  placeholder="Enter name"
                  className=" bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                  value={form.personName}
                  onChange={(e) => setForm((prev) => ({ ...prev, personName: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type *</Label>
              <Select
                value={form.dialogType}
                onValueChange={(value: "lent" | "borrowed") =>
                  setForm((prev) => ({ ...prev, dialogType: value }))
                }
              >
                <SelectTrigger className="z-[130] w-full bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]">
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent className=" bg-[var(--card)] border-[var(--border)] z-[130]">
                  <SelectItem value="lent">Money Lent</SelectItem>
                  <SelectItem value="borrowed">Money Borrowed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What was this money for?"
                value={form.description}
                onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                className=" bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date (Optional)</Label>
              <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    id="dueDate"
                    variant="outline"
                    className="w-full justify-start text-left font-normal bg-[var(--card)] border-[var(--border)] hover:bg-[#1e1e24]"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {form.dueDate ? (
                      format(form.dueDate, "PPP")
                    ) : (
                      <span>Pick a due date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-auto p-0 bg-[var(--card)] border-[var(--border)] z-[150]"
                  align="start"
                >
                  <Calendar
                    mode="single"
                    selected={form.dueDate}
                    onSelect={(date) => {
                      setForm((prev) => ({ ...prev, dueDate: date }));
                      setOpenDatePicker(false);
                    }}
                    initialFocus
                    className="bg-[var(--card)]"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  onOpenChange(false);
                }}
                className="border-[var(--border)] hover:bg-[var(--card-hover)]"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-[#6366f1] hover:bg-[#4f46e5]">
                Record {type === "lent" ? "Lent" : "Borrowed"} Money
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
