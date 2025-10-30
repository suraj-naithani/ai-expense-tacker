"use client"

import type React from "react"
import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PaymentModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    type: "lent" | "borrowed"
}

export function AddPaymentDialog({ open, onOpenChange, type }: PaymentModalProps) {
    const [amount, setAmount] = useState("")
    const [personName, setPersonName] = useState("")
    const [description, setDescription] = useState("")
    const [dueDate, setDueDate] = useState<Date>()
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [dialogType, setDialogType] = useState(type);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!amount || !personName) {
            return
        }

        const record = {
            id: Date.now(),
            amount: Number.parseFloat(amount),
            personName,
            description,
            dueDate: dueDate?.toISOString(),
            type,
            status: "pending",
            createdAt: new Date().toISOString(),
        }

        console.log("New record:", record)

        resetForm()
        onOpenChange(false)
    }

    const resetForm = () => {
        setAmount("")
        setPersonName("")
        setDescription("")
        setDueDate(undefined)
    }

    return (
        <>
            {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]" />}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px] bg-[var(--card)] border-[var(--border)] z-[110]">
                    <DialogHeader>
                        <DialogTitle className="text-xl">
                            Add Transaction
                        </DialogTitle>
                        <DialogDescription>
                            Record a new financial transaction.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-7  bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
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
                                    value={personName}
                                    onChange={(e) => setPersonName(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Transaction Type *</Label>
                            <Select value={dialogType} onValueChange={(value: "lent" | "borrowed") => setDialogType(value)} >
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
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className=" bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dueDate">Due Date (Optional)</Label>
                            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="dueDate"
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal  bg-[var(--card)] border-[var(--border)] hover:bg-[#1e1e24]"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dueDate ? format(dueDate, "PPP") : <span>Pick a due date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0  bg-[var(--card)] border-[var(--border)]" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={dueDate}
                                        onSelect={(date) => {
                                            setDueDate(date)
                                            setOpenDatePicker(false)
                                        }}
                                        initialFocus
                                        className="bg-[#18181b]"
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    resetForm()
                                    onOpenChange(false)
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
    )
}
