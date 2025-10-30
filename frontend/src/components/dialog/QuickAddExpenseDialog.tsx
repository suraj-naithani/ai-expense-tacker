"use client"

import { useState } from "react"
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
import { Coffee, Car, ShoppingCart, Film } from "lucide-react"

const quickExpenses = [
    { name: "Coffee", amount: 5, icon: Coffee, category: "Food & Dining" },
    { name: "Gas", amount: 50, icon: Car, category: "Transportation" },
    { name: "Groceries", amount: 100, icon: ShoppingCart, category: "Food & Dining" },
    { name: "Movie", amount: 15, icon: Film, category: "Entertainment" },
]

interface QuickAddExpenseProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function QuickAddExpenseDialog({ open, onOpenChange }: QuickAddExpenseProps) {
    const [selectedExpense, setSelectedExpense] = useState(quickExpenses[0])
    const [amount, setAmount] = useState(selectedExpense.amount.toString())

    const handleSubmit = () => {
        onOpenChange(false)
    }

    return (
        <>
            {open && <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[425px] bg-[var(--card)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle>Quick Add Expense</DialogTitle>
                        <DialogDescription>Select a common expense and adjust the amount if needed.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-2">
                            {quickExpenses.map((expense) => (
                                <Button
                                    key={expense.name}
                                    variant={selectedExpense.name === expense.name ? "default" : "outline"}
                                    className={`h-16 flex-col gap-2 cursor-pointer ${selectedExpense.name === expense.name
                                        ? "bg-[#6366f1] hover:bg-[#4f46e5]"
                                        : "border-[var(--border)] hover:bg-[var(--card-hover)]"
                                        }`}
                                    onClick={() => {
                                        setSelectedExpense(expense)
                                        setAmount(expense.amount.toString())
                                    }}
                                >
                                    <expense.icon className="h-5 w-5" />
                                    <span className="text-xs">{expense.name}</span>
                                </Button>
                            ))}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-7 bg-[var(--card)] border-[var(--border)] "
                                />
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => onOpenChange(false)} className="border-[var(--border)] hover:bg-[var(--card-hover)] cursor-pointer">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer">
                            Add Expense
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
