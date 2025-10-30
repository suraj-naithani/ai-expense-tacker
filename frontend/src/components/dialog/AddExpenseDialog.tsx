"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import moment from "moment"
import type React from "react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
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
import { Textarea } from "@/components/ui/textarea"

const categories = [
    { value: "food", label: "Food & Dining", icon: "🍽️" },
    { value: "transport", label: "Transportation", icon: "🚗" },
    { value: "shopping", label: "Shopping", icon: "🛍️" },
    { value: "bills", label: "Bills & Utilities", icon: "⚡" },
    { value: "entertainment", label: "Entertainment", icon: "🎬" },
    { value: "healthcare", label: "Healthcare", icon: "🏥" },
    { value: "education", label: "Education", icon: "📚" },
    { value: "travel", label: "Travel", icon: "✈️" },
    { value: "income", label: "Income", icon: "💰" },
    { value: "other", label: "Other", icon: "📌" },
]

interface AddExpenseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseModalProps) {
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("")
    const [date, setDate] = useState<Date>(new Date())
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [openCategoryDropdown, setOpenCategoryDropdown] = useState(false)
    const [openDatePicker, setOpenDatePicker] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!amount || !category) {
            return
        }

        const expense = {
            id: Date.now(),
            amount: Number.parseFloat(amount),
            description,
            category,
            date: date.toISOString(),
            createdAt: new Date().toISOString(),
        }

        console.log("New expense:", expense)

        resetForm()
        onOpenChange(false)
    }

    const resetForm = () => {
        setAmount("")
        setDescription("")
        setCategory("")
        setDate(new Date())
    }

    return (
        <>
            {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px] bg-[var(--background)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle className="text-xl">Add Expense</DialogTitle>
                        <DialogDescription>Enter the details of your expense below.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount">Amount *</Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                    <Input
                                        id="amount"
                                        type="number"
                                        step="0.01"
                                        placeholder="0.00"
                                        className="pl-7 bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category">Category *</Label>
                                <Select value={category} onValueChange={setCategory} >
                                    <SelectTrigger className="w-full bg-[var(--card)] border-[var(--border)] rounded-md cursor-pointer py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#3b3b4b]">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[var(--card)] border-[var(--border)] max-h-60 overflow-y-auto z-120">
                                        {categories.map((cat) => (
                                            <SelectItem
                                                key={cat.value}
                                                value={cat.value}
                                                className="hover:bg-[var(--card-hover)] focus:bg-[var(--card-hover)]"
                                            >
                                                {cat.icon} {cat.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter a description for this expense"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="bg-[var(--card)] border-[var(--border)] focus:border-[#6366f1]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Popover open={openDatePicker} onOpenChange={setOpenDatePicker}>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant="outline"
                                        className="w-full justify-start text-left font-normal cursor-pointer bg-[var(--card)] border-[var(--border)] hover:bg-[var(--card-hover)]"
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? moment(date).format("LL") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 bg-[var(--card)] border-[var(--border)] z-130" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={(date) => {
                                            if (date) {
                                                setDate(date)
                                                setOpenDatePicker(false)
                                            }
                                        }}
                                        initialFocus
                                        className="bg-[var(--card)] z-130"
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
                                className="border-[var(--border)] hover:bg-[var(--card)] cursor-pointer"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer">
                                Add Expense
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
