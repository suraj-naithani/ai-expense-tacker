"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { DeleteTransactionDialogProps } from "@/types/transaction";

export function DeleteTransactionDialog({
    open,
    onOpenChange,
    transactionDescription,
    transactionAmount,
    transactionType,
    onConfirm,
}: DeleteTransactionDialogProps) {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    const getTransactionInfo = () => {
        if (transactionDescription) {
            return transactionDescription;
        }
        if (transactionAmount) {
            return `${transactionType === "EXPENSE" ? "Expense of" : "Income of"} ₹${transactionAmount}`;
        }
        return "this transaction";
    };

    return (
        <>
            {open && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-100" />
            )}
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[430px] bg-[var(--card)] border-[var(--border)] z-110">
                    <DialogHeader>
                        <DialogTitle>Delete transaction</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete{" "}
                            <span className="font-medium text-foreground">
                                {getTransactionInfo()}
                            </span>
                            ? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

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
                            type="button"
                            onClick={handleConfirm}
                            className="bg-[#6366f1] hover:bg-[#4f46e5] cursor-pointer"
                        >
                            Delete transaction
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}